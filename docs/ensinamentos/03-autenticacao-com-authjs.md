# 03 — Autenticação com Auth.js

> Objetivo: entender como o login funciona no projeto — o que o Auth.js faz, onde
> ele guarda as coisas, e como a sessão descobre a **Casa ativa** do usuário.

## O que é o Auth.js

**Auth.js** (o antigo NextAuth; usamos a v5) é a biblioteca que cuida de
autenticação **dentro do próprio app** — sem serviço externo pago. Ele resolve:
o fluxo de login com provedores (Google, email...), a criação/leitura da sessão,
e a gravação de usuários no banco. Escolha registrada na [spec-tecnica §1.1](../spec-tecnica.md).

Toda a configuração vive em **um arquivo**: `src/auth.ts`.

## As três coisas que o `src/auth.ts` monta

```ts
export const { handlers, signIn, signOut, auth } = NextAuth({ ...config });
```

Essa linha devolve quatro peças que usamos pelo app:

| Peça | Para que serve |
|---|---|
| `handlers` | os `GET`/`POST` HTTP do login — reexportados no Route Handler (ver abaixo). |
| `auth` | lê a sessão atual no servidor (ex.: "quem é o usuário desta requisição?"). |
| `signIn` / `signOut` | dispara login/logout a partir do código. |

E o Route Handler que expõe tudo isso na web é aquele arquivo mínimo do
[ensinamento 01](./01-nextjs-e-o-projeto.md):

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

Ou seja: **toda URL `/api/auth/*`** (login, logout, callbacks dos provedores) é
atendida pelos `handlers` que o Auth.js gerou.

## O PrismaAdapter: onde o login encontra o banco

```ts
adapter: PrismaAdapter(prisma),
```

O **adapter** é a ponte entre o Auth.js e o nosso banco. Com o `PrismaAdapter`,
o Auth.js grava e lê usuários/sessões usando aquele mesmo `prisma` do
[ensinamento 02](./02-prisma-e-postgres.md). É por isso que o `schema.prisma` tem
quatro modelos "em inglês" — eles são o **contrato do adapter**:

| Modelo | O que guarda |
|---|---|
| `User` | a pessoa (id, email, nome, imagem). |
| `Account` | o vínculo com um provedor externo (ex.: a conta Google e seus tokens). |
| `Session` | uma sessão ativa (o "estou logado") com token e validade. |
| `VerificationToken` | tokens temporários do magic link por email (ver [ensinamento 05](./05-magic-link-com-resend.md)). |

Não escrevemos nenhum SQL para login: mudamos o `schema.prisma`, rodamos a
migration, e o adapter usa essas tabelas.

## Sessão "database" vs "jwt" — e por que escolhemos database

Existem duas estratégias de sessão:

- **`jwt`** — a sessão vive num cookie assinado (um token). Nada é gravado no
  banco; o servidor confia no token.
- **`database`** — a sessão é uma **linha na tabela `Session`**; o cookie só
  guarda um id que aponta para ela.

Escolhemos **`database`**:

```ts
session: { strategy: "database" },
```

Por quê: como já temos o Postgres e o `PrismaAdapter`, guardar a sessão no banco
é simples, permite revogar sessões, e casa com o resto. (Detalhe técnico: com
provedor de email/magic link, o adapter praticamente já pede sessão em banco.)

## `trustHost: true`

```ts
trustHost: true,
```

O Auth.js precisa saber qual é a URL do site para montar os links de callback.
`trustHost: true` diz "confie no host que chegou na requisição". Na Vercel isso
seria automático, mas declaramos explicitamente para funcionar também no dev
local e em qualquer verificação self-hosted.

## Os provedores (os "jeitos de entrar")

```ts
providers: [
  Google,
  Resend({ from: process.env.AUTH_EMAIL_FROM }),
],
```

Os dois do F0 ([spec-produto §4.1](../spec-produto.md)):

- **Google** → login OAuth. Detalhado no [ensinamento 04](./04-login-com-google-oauth.md).
- **Resend** → magic link por email (login sem senha). Detalhado no [ensinamento 05](./05-magic-link-com-resend.md).

Cada provedor lê suas credenciais de variáveis de ambiente (`AUTH_GOOGLE_ID`,
`AUTH_RESEND_KEY`, ...). O Auth.js segue uma convenção de nomes: variáveis
`AUTH_GOOGLE_*` são reconhecidas pelo provedor Google **sem precisar passá-las no
código** — por isso `Google` aparece "pelado", sem argumentos.

## O callback `session`: onde a Casa ativa entra na história

Este é o trecho mais importante para o **nosso** domínio. Um usuário do Despensa
não vive sozinho: ele pertence a uma ou mais **Casas** (via `Morador`), e todo
dado do app é escopado por Casa ([spec-tecnica §2.4](../spec-tecnica.md)). O login
sozinho só sabe *quem* é a pessoa; ele não sabe *qual Casa* mostrar.

O callback `session` resolve isso — ele roda toda vez que a sessão é lida e nos
deixa **enriquecer** o objeto de sessão:

```ts
async session({ session, user }) {
  const morador = await prisma.morador.findFirst({
    where: { usuarioId: user.id },
    orderBy: { criadoEm: "asc" },
    select: { casaId: true },
  });
  session.usuarioId = user.id;
  session.casaId = morador?.casaId ?? null;
  return session;
}
```

O que ele faz, em português:
1. dado o usuário logado, procura o **primeiro `Morador`** dele (a Casa mais
   antiga a que pertence);
2. anexa na sessão `usuarioId` e `casaId`.

Se o usuário **ainda não tem Casa nenhuma**, `casaId` fica `null` — e é
exatamente esse `null` que o Marco 1 vai usar para mandar a pessoa ao
**onboarding** (que cria a Casa). Ver fluxo em [spec-tecnica §4.1](../spec-tecnica.md).
O comentário no código deixa claro: aqui é só a *plumbing*; a **criação** de Casa
é do onboarding, não daqui.

## Fazendo o TypeScript conhecer os campos novos

Como injetamos `usuarioId` e `casaId` na sessão, precisamos avisar o TypeScript
que eles existem — senão `session.casaId` daria erro de tipo. É o papel de
`src/types/next-auth.d.ts`:

```ts
declare module "next-auth" {
  interface Session {
    usuarioId: string;
    casaId: string | null;
    user: DefaultSession["user"];
  }
}
```

Isso **estende** o tipo `Session` da biblioteca (declaration merging). Sempre que
adicionarmos algo à sessão no callback, atualizamos este arquivo em paralelo.

## Recapitulando com o código de hoje

| Arquivo | O que ensina |
|---|---|
| `src/auth.ts` | config central: adapter, sessão em banco, provedores, callback. |
| `src/app/api/auth/[...nextauth]/route.ts` | expõe o login como rotas HTTP. |
| `src/types/next-auth.d.ts` | estende o tipo `Session` com `usuarioId`/`casaId`. |
| `schema.prisma` (User/Account/Session/VerificationToken) | tabelas do adapter. |

**Próximos:** [04 — Google OAuth](./04-login-com-google-oauth.md) e
[05 — Magic link com Resend](./05-magic-link-com-resend.md), que detalham cada
provedor.
