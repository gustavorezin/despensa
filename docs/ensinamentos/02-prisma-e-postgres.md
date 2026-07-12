# 02 — Prisma + PostgreSQL

> Objetivo: entender como o app guarda dados — o que é o Prisma, o que são
> migrations, e por que o nosso `PrismaClient` é montado do jeito que é.

## O elenco

- **PostgreSQL** — o banco de dados relacional (tabelas, colunas, relações).
  Em **dev** roda num container Docker local; em **produção** é o **Neon**
  (Postgres gerenciado). O código não muda entre os dois — só a `DATABASE_URL`.
- **Prisma** — o **ORM**: a camada que traduz entre objetos TypeScript e SQL.
  Em vez de escrever `SELECT ... FROM compra`, escrevemos `prisma.compra.findMany(...)`
  com tipos e autocompletar.

## O `schema.prisma` é a fonte da verdade

Toda a modelagem vive em `prisma/schema.prisma`. É um único arquivo que descreve
**todas as tabelas, colunas, relações e enums**. A partir dele o Prisma:

1. **gera o client tipado** (`@prisma/client`) — os tipos TypeScript que usamos
   no código saem daqui;
2. **gera as migrations** — o SQL que cria/altera as tabelas de verdade.

Um modelo é uma tabela. Exemplo abreviado do nosso schema:

```prisma
model Casa {
  id       String   @id @default(cuid())
  nome     String
  criadaEm DateTime @default(now())

  moradores Morador[]   // relação: uma Casa tem vários Moradores
}
```

Coisas que já aparecem no nosso schema e vale reconhecer:

- `@id @default(cuid())` — chave primária; `cuid()` gera um id único de texto
  (em vez de número sequencial).
- `String?` — o `?` significa **opcional** (`NULL` no banco). Ex.: `categoria String?`.
- `@unique` e `@@unique([a, b])` — unicidade de uma coluna ou de uma combinação.
  Ex.: `@@unique([casaId, nomeCanonico])` garante "um Item canônico por Casa".
- `@@index([...])` — índice para acelerar buscas (ex.: filtrar por `casaId`).
- `@relation(...)` + `onDelete: Cascade` — relação entre tabelas e o que acontece
  ao apagar o pai (Cascade = apaga os filhos junto).
- `enum` — conjunto fechado de valores (ex.: `TipoAjuste { TEM POUCO ACABOU PRECISO }`).

Repare na **convenção mista, e ela é intencional**: os modelos do Auth.js
(`User`, `Account`, `Session`, `VerificationToken`) ficam **em inglês** porque
são contrato da biblioteca; todo o **domínio** (`Casa`, `Item`, `Compra`...) fica
**em português** ([spec-tecnica §7](../spec-tecnica.md)). O topo do arquivo
documenta isso.

## Migrations: mudanças de banco versionadas

Uma **migration** é um arquivo SQL que registra *uma mudança* no banco. Em vez de
alterar tabelas na mão, a gente altera o `schema.prisma` e o Prisma gera o SQL
correspondente. Isso dá **histórico** e garante que dev e produção tenham
exatamente o mesmo banco.

Já existe a primeira:

```
prisma/migrations/20260701021904_init/migration.sql
```

É o `init` — cria todas as tabelas do Marco 0. O nome tem timestamp para manter
a ordem. O `migration_lock.toml` fixa o provider (`postgresql`).

Dois comandos, dois contextos (dos scripts do `package.json`):

| Comando | Quando | O que faz |
|---|---|---|
| `npm run db:migrate` (`prisma migrate dev`) | **desenvolvimento** | você mudou o schema; ele cria uma nova migration e aplica no banco local. |
| `npm run db:deploy` (`prisma migrate deploy`) | **produção/CI** | só **aplica** migrations já existentes, sem criar nada. |

Na Vercel, o `db:deploy` roda automático dentro do `vercel-build`
(`prisma migrate deploy && next build`) — por isso o banco de produção se
atualiza sozinho a cada push. Detalhe no [06 — Deploy](./06-deploy-vercel-neon.md).

## O driver adapter (Prisma 7) — por que `PrismaPg`

No Prisma 7, o client não conecta mais "sozinho": ele usa um **driver adapter**,
uma biblioteca que fala o protocolo do banco. Usamos `@prisma/adapter-pg`, que
usa o driver `pg` (Postgres puro). Vantagem para nós: o **mesmo adapter** serve
para o Postgres local e para o Neon — a diferença é só a string de conexão.

```ts
// src/lib/prisma.ts (essência)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });
```

## O truque do singleton (e por que ele existe)

O `src/lib/prisma.ts` tem um detalhe que parece estranho:

```ts
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalParaPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
```

**Problema que isso resolve:** em desenvolvimento, o Next.js recarrega os módulos
a cada alteração (hot-reload). Se criássemos `new PrismaClient()` toda vez, o
banco encheria de conexões abertas até estourar. **Solução:** guardar a instância
no `globalThis` (que sobrevive ao hot-reload) e reaproveitá-la. Em produção não
há hot-reload, então não precisamos poluir o global — daí o `if`.

Regra prática: **nunca** dê `new PrismaClient()` espalhado pelo código. Sempre
importe `prisma` de `@/lib/prisma`.

## Onde a `DATABASE_URL` é lida (duas vezes, de propósito)

A URL de conexão é usada em **dois momentos diferentes**, e cada um a lê por um
caminho:

1. **Em runtime** (o app rodando) → `src/lib/prisma.ts`, via `process.env`.
2. **Na CLI do Prisma** (migrations, `prisma studio`) → `prisma.config.ts`.

O `prisma.config.ts` tem uma sutileza: a partir do Prisma 7, com um arquivo de
config presente, o Prisma **não carrega os `.env` sozinho**. Então nós carregamos
manualmente com `dotenv`, `.env.local` **antes** de `.env`, para o local de dev
vencer o padrão — a mesma precedência que o Next.js usa. Em produção esses
arquivos não existem e a variável já vem do ambiente da Vercel.

## Ferramenta útil: Prisma Studio

`npm run db:studio` abre uma UI web para ver e editar as tabelas do banco local —
ótimo para conferir se uma Compra foi salva sem escrever SQL.

## Recapitulando com o código de hoje

| Arquivo | O que ensina |
|---|---|
| `prisma/schema.prisma` | modelagem, relações, enums, convenção PT/EN. |
| `prisma/migrations/.../migration.sql` | migration versionada (o `init`). |
| `src/lib/prisma.ts` | driver adapter + singleton anti-hot-reload. |
| `prisma.config.ts` | como a CLL do Prisma acha a `DATABASE_URL`. |
| `docker-compose.yml` | o Postgres local de desenvolvimento. |

**Próximo:** [03 — Autenticação com Auth.js](./03-autenticacao-com-authjs.md),
que usa este `prisma` para guardar usuários e sessões.
