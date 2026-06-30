# CLAUDE.md

Guia para agentes de IA trabalhando neste repositório (app **Despensa** — assistente de abastecimento doméstico).

## Documentação de referência

Antes de qualquer tarefa técnica, consulte:

- [docs/visao.md](docs/visao.md) — visão e filosofia do produto.
- [docs/spec-produto.md](docs/spec-produto.md) — regras de negócio e faseamento.
- [docs/spec-design.md](docs/spec-design.md) — contrato de UX.
- [docs/spec-tecnica.md](docs/spec-tecnica.md) — stack, arquitetura, modelagem e roadmap técnico.
- [docs/adr/](docs/adr/) — decisões de produto/UX imutáveis (ADRs). Mudar uma decisão exige novo ADR.

## Convenção de nomenclatura (obrigatória)

- **Nomear em português** por padrão: entidades, variáveis, campos de banco, arquivos de domínio e documentação. Não misturar inglês e português numa mesma identificação.
- **Inglês só para termos técnicos consagrados** sem tradução natural: `Repository`, `Service`, `Controller`, `Next.js`, `PWA`, `ORM`, `deploy`, `Server Actions`, `Route Handlers`, `bottom sheet`.
- **Domínio segue o vocabulário canônico** (ADR-011): `Casa`, `Item`, `Compra`, `Despensa`, `Lista`, `Sugestão`, `Morador`.
- Exemplos: `Usuario` (não `User`), `Morador` (não `Membership`), `ApelidoItem` (não `ItemAlias`), `usuarioId` (não `userId`).
- Composição domínio+técnico: `CompraRepository`, `DespensaService`, `MotorAprendizado`.

## Stack (resumo — ver spec-tecnica.md)

- Next.js (App Router) full-stack como **PWA**; TypeScript.
- PostgreSQL (Neon) + Prisma; validação com Zod.
- Auth.js (email + Google). Hospedagem: Vercel + Neon.
- Arquitetura: monólito modular em camadas. O domínio (incl. motor de aprendizado) não conhece Next.js, Prisma nem HTTP.
