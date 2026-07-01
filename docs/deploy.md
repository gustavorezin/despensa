# Deploy — Vercel + Neon

Guia do item 4 do Marco 0: colocar o app no ar com CI por push (deploy a cada
push na `main`). Banco de produção no **Neon**, app na **Vercel**.

O código já está pronto: a Vercel roda `npm run vercel-build`, que executa
`prisma migrate deploy && next build` — ou seja, aplica as migrations no Neon
automaticamente a cada deploy.

## 1. Banco no Neon

1. Crie uma conta em <https://neon.tech> e um projeto (região mais próxima, ex.: AWS `sa-east-1` São Paulo).
2. No projeto, copie a **connection string**. Use a **direta** (sem `-pooler` no host) como `DATABASE_URL` — funciona para migrations e para o runtime do MVP. (Pooling é otimização para depois.)
   - Formato: `postgresql://USUARIO:SENHA@ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require`
3. Guarde essa URL para o passo 3.

> As tabelas são criadas pela migration no primeiro deploy — não precisa rodar nada manualmente no Neon.

## 2. Projeto na Vercel

1. Em <https://vercel.com>, **Add New → Project** e importe o repositório do GitHub (`gustavorezin/despenca`).
2. Framework: **Next.js** (detectado automaticamente). Não altere o build command — a Vercel usa o script `vercel-build` do `package.json`.
3. Antes de clicar em **Deploy**, configure as variáveis de ambiente (passo 3).

## 3. Variáveis de ambiente na Vercel

Em **Settings → Environment Variables**, adicione (escopo: Production, e Preview se quiser):

| Variável             | Valor                                                        |
| -------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`       | Connection string do Neon (passo 1)                          |
| `AUTH_SECRET`        | Gere um novo: `npx auth secret` (não reutilize o de dev)     |
| `AUTH_GOOGLE_ID`     | Client ID do Google (mesmo do dev ou um específico de prod)  |
| `AUTH_GOOGLE_SECRET` | Client secret do Google                                      |
| `AUTH_RESEND_KEY`    | API key do Resend                                            |
| `AUTH_EMAIL_FROM`    | `Despensa <contato@seudominio>` (domínio verificado no Resend) |

`AUTH_URL`/`AUTH_TRUST_HOST` não são necessários: a Vercel é detectada e o host confiado automaticamente.

## 4. Google OAuth — redirect URI de produção

No [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials** → seu OAuth Client, em **Authorized redirect URIs** adicione a URL de produção:

```
https://SEU-APP.vercel.app/api/auth/callback/google
```

(Mantenha também `http://localhost:3000/api/auth/callback/google` para o dev.)

## 5. Resend — domínio de envio

Para enviar o magic link de produção, verifique seu domínio em
<https://resend.com/domains> e use um `AUTH_EMAIL_FROM` desse domínio. Sem
domínio verificado, o Resend só entrega para o email da própria conta.

## 6. Deploy e verificação

1. Clique em **Deploy**. O build roda `prisma migrate deploy` (cria as tabelas no Neon) e depois `next build`.
2. Acesse `https://SEU-APP.vercel.app/api/auth/providers` — deve listar `google` e `resend`.
3. Teste o login Google e o magic link por email.

A partir daí, todo push na `main` dispara um novo deploy (CI por push).
