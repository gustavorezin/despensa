# 05 — Magic link com Resend

> Objetivo: entender o login por email sem senha — o que é um "magic link", qual
> o papel do Resend, e como o token de verificação funciona.

## O que é um magic link

É login por email **sem senha**: o usuário digita o email, recebe uma mensagem
com um link único, clica, e está logado. Nada para memorizar, nada para vazar.
A "prova de identidade" é simplesmente **ter acesso à caixa de entrada** daquele
email.

No Despensa é o segundo provedor do F0, ao lado do Google
([spec-produto §4.1](../spec-produto.md)).

## O papel do Resend

O app precisa **enviar um email de verdade** com o link. Enviar email de forma
confiável (que não caia em spam) é um problema por si só — então usamos o
**Resend**, um serviço de envio de email com API simples. O Auth.js já traz um
provedor pronto para ele:

```ts
// src/auth.ts
Resend({ from: process.env.AUTH_EMAIL_FROM }),
```

- `AUTH_RESEND_KEY` — a API key do Resend (lida do ambiente por convenção, como
  no Google; por isso não aparece no argumento).
- `AUTH_EMAIL_FROM` — o remetente que aparece no email, ex.:
  `Despensa <onboarding@resend.dev>` (ver `.env.example`).

## O fluxo, em passos

1. **Usuário digita o email** e pede o link (via `signIn("resend", { email })`).
2. **Auth.js gera um token** e grava uma linha em `VerificationToken` no banco
   (aquele modelo do [ensinamento 03](./03-autenticacao-com-authjs.md)): guarda o
   email (`identifier`), o `token` e um `expires` (validade curta).
3. **Resend envia o email** com o link, algo como
   `/api/auth/callback/resend?token=...&identifier=...`.
4. **Usuário clica.** O Auth.js compara o token do link com o que está em
   `VerificationToken`; se bate e não expirou, o token é **consumido** (apagado,
   para não servir duas vezes) e a pessoa é autenticada.
5. **Gravação.** Como no Google, o `PrismaAdapter` cria/recupera o `User` e cria
   a `Session`.

Repare que `VerificationToken` existe **exatamente** para este fluxo — é o único
provedor que o usa. O Google não precisa dele (lá a prova vem do próprio Google).

## Por que o token expira e é de uso único

Duas proteções embutidas:
- **expira** (`expires`) — um link vazado depois de X minutos não vale mais;
- **uso único** — consumido ao clicar, não dá para reusar.

É o mesmo princípio do OAuth ("código temporário"), só que a prova de identidade
aqui é o acesso ao email em vez da conta Google.

## O detalhe do domínio verificado (o pega mais comum)

Em desenvolvimento, dá para usar o remetente de teste `onboarding@resend.dev` e
o Resend entrega **apenas para o email da sua própria conta Resend** — suficiente
para testar sozinho.

Para produção (enviar para qualquer pessoa), é preciso **verificar um domínio**
em <https://resend.com/domains> e usar um `AUTH_EMAIL_FROM` desse domínio. Sem
isso, o magic link "não chega" para outros emails — sintoma clássico, explicado
no [docs/deploy.md](../deploy.md) §5.

## Como conferir que está de pé

`/api/auth/providers` deve listar `resend` junto com `google`. Aí é testar:
digitar o email, receber o link, clicar, e cair logado.

## Onde isso toca o nosso domínio

Igual ao Google: o magic link produz um `User` autenticado e **nada mais**. A
Casa ativa continua vindo do callback `session`, e a criação da Casa é do
onboarding (Marco 1). O provedor de login é intercambiável; o que acontece depois
do login é o mesmo.

## Recapitulando

- Magic link = login por email, sem senha; a prova é ter acesso à caixa.
- **Resend** é quem envia o email; `AUTH_RESEND_KEY` + `AUTH_EMAIL_FROM` nas envs.
- O `VerificationToken` guarda o token (curto e de uso único).
- Produção exige **domínio verificado** no Resend.

**Próximo:** [06 — Deploy (Vercel + Neon)](./06-deploy-vercel-neon.md), onde todas
essas variáveis de ambiente se juntam.
