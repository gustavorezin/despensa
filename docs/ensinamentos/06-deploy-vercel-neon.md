# 06 — Deploy (Vercel + Neon)

> Objetivo: entender **como o app chega em produção** e por que o deploy é
> automático. Este é o "porquê" conceitual; o passo a passo operacional está em
> [docs/deploy.md](../deploy.md).

## O modelo: "CI por push"

Não há um botão de "publicar" nem um servidor para administrar. A regra é:

> **Todo push na branch `main` dispara um novo deploy na Vercel.**

Isso é *CI por push* (integração/entrega contínua). A vantagem, decidida lá no
[roadmap da spec-tecnica §6](../spec-tecnica.md), é evitar um "big bang" de deploy
no fim do projeto: o app sobe em produção desde o Marco 0 e cada mudança já vai ao
ar. Se algo quebra, quebra pequeno.

## Quem faz o quê

| Serviço | Papel |
|---|---|
| **Vercel** | hospeda e roda o app Next.js. Detecta o framework, faz o build a cada push, serve as rotas. |
| **Neon** | o PostgreSQL **de produção** (gerenciado, serverless). É o mesmo Postgres do dev, só que na nuvem. |
| **GitHub** | onde mora o código; o push aqui é o gatilho do deploy. |

O par Vercel + Neon foi escolhido por terem free tier suficiente e "zero infra
para manter" ([spec-tecnica §1](../spec-tecnica.md)).

## O truque do `vercel-build`: migrations no deploy

A peça que faz o banco de produção se manter em dia sozinho está no
`package.json`:

```json
"vercel-build": "prisma migrate deploy && next build"
```

A Vercel usa esse script no lugar do build padrão. Ele faz **duas coisas em
ordem**:

1. `prisma migrate deploy` — aplica no Neon qualquer migration nova que ainda não
   estava lá (ver [ensinamento 02](./02-prisma-e-postgres.md)). É a versão
   "só aplica, não cria" — segura para produção.
2. `next build` — compila o app.

Consequência prática: **você não roda nada manualmente no Neon**. Mudou o schema,
gerou a migration em dev, deu push → a Vercel aplica a migration e faz o build.
No primeiro deploy foi assim que as tabelas nasceram no Neon.

## Variáveis de ambiente: a mesma chave, valores por ambiente

O código lê tudo de `process.env` (a `DATABASE_URL`, as `AUTH_*`). O que muda
entre dev e produção **não é o código, são os valores**:

| Onde | Como as envs entram |
|---|---|
| **Desenvolvimento** | arquivo `.env.local` (copiado de `.env.example`; ignorado pelo Git). Banco = Docker local. |
| **Produção** | painel da Vercel → *Settings → Environment Variables*. Banco = Neon. |

As que a produção precisa (detalhadas no [deploy.md §3](../deploy.md)):
`DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`,
`AUTH_RESEND_KEY`, `AUTH_EMAIL_FROM`.

Dois cuidados que valem entender:
- **`AUTH_SECRET` deve ser novo em produção** (`npx auth secret`), nunca o de dev.
  É o segredo que assina/protege a sessão — reusar o de dev enfraquece a produção.
- **`AUTH_URL`/`AUTH_TRUST_HOST` não são necessárias**: a Vercel é detectada e o
  host confiado automaticamente (lembra do `trustHost: true` do
  [ensinamento 03](./03-autenticacao-com-authjs.md)).

## O que cada provedor de login exige a mais em produção

Subir o app não basta; os logins têm um passo extra por serem serviços externos:

- **Google** → registrar a **redirect URI de produção**
  (`https://SEU-APP.vercel.app/api/auth/callback/google`) no Google Cloud Console.
  Sem isso, o login Google quebra só em produção ([ensinamento 04](./04-login-com-google-oauth.md)).
- **Resend** → **verificar um domínio** para o `AUTH_EMAIL_FROM`, senão o magic
  link não chega para outros emails ([ensinamento 05](./05-magic-link-com-resend.md)).

## Como conferir um deploy

1. o build da Vercel roda `prisma migrate deploy` (cria/atualiza tabelas) e depois
   `next build`;
2. abrir `https://SEU-APP.vercel.app/api/auth/providers` → deve listar `google` e
   `resend`;
3. testar o login Google e o magic link.

Hoje o app está no ar em **despenca.vercel.app** — o Marco 0 fecha aqui.

## Recapitulando

- Push na `main` → deploy automático (CI por push).
- `vercel-build` aplica migrations no Neon **antes** do build — banco sempre em dia.
- Mesmo código, envs diferentes por ambiente; `AUTH_SECRET` novo em prod.
- Google e Resend pedem configuração extra por serem externos.

**Volta ao [índice](./README.md).** Isto encerra os ensinamentos do Marco 0.
