# 04 — Login com Google (OAuth)

> Objetivo: entender o que acontece quando o usuário clica em "Entrar com Google"
> — o fluxo OAuth, onde as credenciais entram, e por que existe uma "redirect URI".

## O problema que o OAuth resolve

Queremos deixar a pessoa entrar usando a conta Google dela, **sem** o Despensa
ver ou guardar a senha do Google. O **OAuth 2.0** é o protocolo padrão para isso:
o usuário se autentica no *próprio Google*, e o Google devolve ao nosso app uma
prova de que "esta pessoa é dona deste email". Nunca tocamos na senha.

## O fluxo, em passos

Quando o usuário clica em "Entrar com Google" (que chama o `signIn("google")` do
[ensinamento 03](./03-autenticacao-com-authjs.md)):

1. **Redirect para o Google.** O app manda o navegador para uma URL do Google,
   levando junto o nosso **Client ID** (quem está pedindo) e a **redirect URI**
   (para onde voltar depois).
2. **O usuário autoriza no Google.** Ele faz login no Google (se já não estiver)
   e confirma que autoriza o "Despensa" a ver nome/email.
3. **Google redireciona de volta** para a nossa **redirect URI**, carregando um
   **código de autorização** temporário.
4. **Troca do código por tokens.** Nos bastidores, o Auth.js troca esse código
   (usando o **Client Secret**) por tokens de acesso e pelos dados do perfil.
5. **Gravação.** O `PrismaAdapter` cria/atualiza o `User` e guarda o vínculo em
   `Account` (o provedor `google` e seus tokens); cria a `Session`. Pronto:
   logado.

Todo o passo 3–5 acontece na URL:

```
/api/auth/callback/google
```

...que é atendida pelos `handlers` do Auth.js (a rota catch-all `[...nextauth]`).
Nós não escrevemos esse callback — o Auth.js já sabe fazê-lo.

## As três credenciais e onde elas moram

| Credencial | O que é | Onde fica |
|---|---|---|
| **Client ID** | identifica publicamente o nosso app perante o Google. | env `AUTH_GOOGLE_ID`. |
| **Client Secret** | prova secreta de que é o nosso app trocando o código. | env `AUTH_GOOGLE_SECRET`. |
| **Redirect URI** | a URL autorizada para o Google devolver o usuário. | registrada no Google Cloud Console. |

As duas primeiras vêm do `.env.local` em dev (ver `.env.example`) e das variáveis
da Vercel em produção. Repare que **não aparecem no código** — o provedor `Google`
em `src/auth.ts` está "pelado" justamente porque o Auth.js lê `AUTH_GOOGLE_ID` e
`AUTH_GOOGLE_SECRET` do ambiente por convenção.

## A redirect URI e o "porquê de registrar cada ambiente"

O Google só devolve o usuário para URLs que **você registrou antes** — é uma
proteção: impede que outro site use seu Client ID e sequestre o login. Por isso
cada ambiente precisa da sua entrada no Google Cloud Console → *APIs & Services →
Credentials → Authorized redirect URIs*:

```
http://localhost:3000/api/auth/callback/google    ← desenvolvimento
https://SEU-APP.vercel.app/api/auth/callback/google ← produção
```

Se faltar a de produção, o login Google quebra **só em produção** com um erro de
"redirect_uri_mismatch" — sintoma clássico. O passo a passo está no
[06 — Deploy](./06-deploy-vercel-neon.md) e no [docs/deploy.md](../deploy.md) §4.

## Como conferir que está de pé

Depois de configurado, a rota `/api/auth/providers` lista os provedores ativos —
deve aparecer `google`. É o teste rápido que o `deploy.md` recomenda.

## Onde isso toca o nosso domínio

O OAuth só produz um `User` autenticado. **Ele não cria Casa nenhuma.** Quem
resolve a Casa ativa é o callback `session` ([ensinamento 03](./03-autenticacao-com-authjs.md)),
e quem *cria* a Casa é o onboarding (Marco 1). Ou seja: entrar com Google é só a
porta; o que a pessoa vê depois depende de já ser `Morador` de alguma Casa.

## Recapitulando

- OAuth = login via Google **sem** o app ver a senha.
- Client ID/Secret nas envs; redirect URI registrada no Google Cloud, **uma por
  ambiente**.
- O callback HTTP (`/api/auth/callback/google`) é do Auth.js — não escrevemos.
- Login ≠ Casa: a Casa vem depois, do onboarding.

**Próximo:** [05 — Magic link com Resend](./05-magic-link-com-resend.md), o outro
provedor — login por email, sem senha e sem OAuth.
