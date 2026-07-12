# Ensinamentos

Notas de estudo sobre **como as tecnologias que usamos funcionam** — escritas a
partir do que já foi construído no projeto Despensa, não de tutoriais genéricos.
Cada documento explica um conceito e aponta para o arquivo real onde ele aparece.

> Estas notas são didáticas e evoluem junto com o código. Diferente das
> [ADRs](../adr/) (decisões imutáveis) e das specs (contrato), aqui o objetivo é
> **entender o "como" e o "porquê" técnico**. Se um trecho divergir do código,
> o código vence — atualize a nota.

## Índice

| # | Tema | O que você aprende |
|---|---|---|
| [01](./01-nextjs-e-o-projeto.md) | **Next.js e a forma do projeto** | App Router, Server vs Client Components, Route Handlers, o que roda no servidor. |
| [02](./02-prisma-e-postgres.md) | **Prisma + PostgreSQL** | Schema como fonte da verdade, migrations versionadas, driver adapter, o singleton do client. |
| [03](./03-autenticacao-com-authjs.md) | **Autenticação com Auth.js** | Sessão em banco, PrismaAdapter, callbacks, como a sessão resolve a Casa ativa. |
| [04](./04-login-com-google-oauth.md) | **Login com Google (OAuth)** | O que é OAuth 2.0, o fluxo de redirect, onde as credenciais entram. |
| [05](./05-magic-link-com-resend.md) | **Magic link com Resend** | Login por email sem senha, o token de verificação, o papel do Resend. |
| [06](./06-deploy-vercel-neon.md) | **Deploy (Vercel + Neon)** | CI por push, migrations no deploy, variáveis de ambiente por ambiente. |

## Como estas notas se ligam ao resto da doc

- **Visão / produto / design** → o *quê* e o *porquê de negócio* (`docs/visao.md`, `docs/spec-produto.md`, `docs/spec-design.md`).
- **Spec técnica** → a arquitetura-alvo e o roadmap (`docs/spec-tecnica.md`).
- **ADRs** → decisões travadas (`docs/adr/`).
- **Ensinamentos** (aqui) → *como a tecnologia funciona* no que já existe.
