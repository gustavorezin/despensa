# 01 — Next.js e a forma do projeto

> Objetivo: entender o que o Next.js faz por baixo, e por que a estrutura de
> pastas do nosso `src/app/` é do jeito que é.

## O que é o Next.js, em uma frase

É um framework em cima do React que roda **nos dois lados**: parte do código
executa no **servidor** (Node.js, perto do banco) e parte executa no
**navegador** (interatividade). Ele cuida de roteamento, build, e da fronteira
entre servidor e cliente — coisas que o React puro não resolve sozinho.

No nosso projeto ele é o framework único: front-end e back-end no mesmo código
(ver [spec-tecnica §1](../spec-tecnica.md)). Não há "servidor de API separado".

## App Router: a pasta é a rota

Usamos o **App Router** (a forma moderna do Next.js). A regra central:

> **A estrutura de pastas dentro de `src/app/` *é* o mapa de URLs.**

- `src/app/page.tsx` → a rota `/` (a home). É o arquivo que hoje mostra a tela
  padrão do `create-next-app` — vamos substituí-lo no Marco 1.
- `src/app/layout.tsx` → o **layout raiz**: o HTML que envolve toda página
  (`<html>`, `<body>`, fontes, `globals.css`). Tudo que é comum a todas as telas
  mora aqui.

Nomes de arquivo têm significado fixo no App Router:

| Arquivo | Papel |
|---|---|
| `page.tsx` | a tela daquela rota (o que o usuário vê na URL). |
| `layout.tsx` | moldura persistente que envolve as `page.tsx` abaixo dela. |
| `route.ts` | um **endpoint HTTP** (não uma tela) — ver "Route Handlers" abaixo. |
| `loading.tsx` / `error.tsx` | estados de carregando/erro (ainda não usamos). |

### Grupos de rotas com `(parênteses)`

Na spec-tecnica a estrutura-alvo usa pastas como `(auth)`, `(onboarding)`,
`(app)`. Os parênteses criam um **grupo de rotas**: servem para organizar e dar
um `layout.tsx` diferente a um conjunto de telas **sem** virar segmento de URL.
Ex.: telas em `(app)/` compartilham o shell com bottom tab + FAB, mas a URL
continua `/lista`, não `/app/lista`. Isso ainda não existe no código — é o
Marco 1.

## Server Components vs Client Components (o conceito que mais confunde)

No App Router, **todo componente é Server Component por padrão**. Ou seja: ele
roda no servidor, renderiza HTML, e **pode acessar o banco diretamente** (chamar
um `service`, ler do Prisma) sem virar uma "API". O navegador recebe HTML pronto.

Um componente só vira **Client Component** — e aí roda no navegador, com estado,
`onClick`, `useState` etc. — quando o arquivo começa com a diretiva:

```tsx
"use client";
```

Regra prática que vamos seguir:
- **Ler dados / renderizar** → Server Component (fala com o `service`, que fala
  com o repositório/Prisma).
- **Interatividade** (formulário, bottom sheet, chip clicável) → Client Component.

Isso combina exatamente com a arquitetura em camadas da [spec-tecnica §2.4](../spec-tecnica.md):
a camada de Apresentação lê via *services* no servidor e só empurra para o
cliente o que precisa de interação.

> No `layout.tsx` atual repare que **não há `"use client"`** — ele é um Server
> Component. Ele só monta a estrutura e injeta as fontes; nada de estado.

## Server Actions vs Route Handlers (as duas formas de escrever/expor dados)

O Next.js nos dá dois mecanismos de back-end. A spec ([§1](../spec-tecnica.md))
decidiu usar os dois, cada um para uma coisa:

1. **Server Actions** — funções assíncronas marcadas com `"use server"` que o
   componente chama como se fosse uma função local, mas que **executam no
   servidor**. São o caminho para **mutações** (registrar Compra, aceitar
   Sugestão). Sem precisar criar rota, montar `fetch`, serializar JSON à mão.
   Ainda não temos nenhuma — chegam no Marco 1.

2. **Route Handlers** — arquivos `route.ts` que expõem um **endpoint HTTP** de
   verdade (`GET`, `POST`...). Servem para o que precisa ser uma URL: callbacks
   de terceiros, webhooks, e a futura API JSON para um cliente nativo.

O **único** Route Handler que já existe é o do Auth.js:

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";
export const { GET, POST } = handlers;
```

Aqui aparecem dois detalhes do App Router:
- `[...nextauth]` é uma **rota catch-all**: casa com `/api/auth/qualquer/coisa`
  (`/api/auth/signin`, `/api/auth/callback/google`, ...). O Auth.js precisa de
  várias sub-rotas e delega todas para o mesmo handler.
- exportar `GET` e `POST` de um `route.ts` é literalmente "responda a esses
  métodos HTTP nesta URL". Nós só reexportamos o que o Auth.js gera.

## O `@/` nos imports

`import { prisma } from "@/lib/prisma"` — o `@/` é um **atalho para `src/`**,
configurado no `tsconfig.json`. Evita `../../../lib/prisma`. Sempre que vir `@/`,
leia como "a partir de `src/`".

## Recapitulando com o código de hoje

| Arquivo | O que ensina |
|---|---|
| `src/app/layout.tsx` | layout raiz, Server Component, fontes e CSS global. |
| `src/app/page.tsx` | uma `page.tsx` = a rota `/`. |
| `src/app/api/auth/[...nextauth]/route.ts` | Route Handler + rota catch-all. |

**Próximo:** [02 — Prisma + PostgreSQL](./02-prisma-e-postgres.md), o outro lado
da fronteira: como o servidor fala com o banco.
