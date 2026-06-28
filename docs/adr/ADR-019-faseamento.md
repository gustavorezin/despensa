# ADR-019: Faseamento — cada fase entrega valor sozinha

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** meta
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
Produtos de software com IA tendem a atrasar porque cada funcionalidade parece depender da anterior: "Não posso lançar Sugestões sem Consumo registrado", "Não posso lançar Consumo sem Multi-morador", "Não posso lançar Multi-morador sem Offline". Esse raciocínio de pré-requisitos encadeados adia indefinidamente a entrega de valor. O risco maior não é lançar um MVP imperfeito — é não lançar enquanto o aprendizado real dos usuários seria capaz de guiar as decisões de produto.

## Decisão
Adotamos uma regra inviolável de faseamento: **cada fase deve entregar valor sozinha, sem depender de fases posteriores**. Se descobrirmos que o item X da Fase N pressupõe o item Y da Fase N+1, a dependência é reescrita (Y antecipado, X postergado, ou a decisão arquitetural revisada). O modelo de dados pode preparar estruturas para fases futuras (ex.: Casa desde a Fase 0 para multi-morador), mas a UX de cada fase deve ser completa e satisfatória sem essas fases.

As fases definidas são: 0 (MVP), 1 (Atrito do dia-a-dia), 2 (IA mais inteligente), 3 (Captura por imagem), 4 (Resiliência), 5 (Colaboração), 6+ (Visão longa).

## Consequências
**Positivas:**
- Permite lançamento incremental real: a Fase 0 pode estar em produção enquanto a Fase 1 ainda está em desenvolvimento.
- Cada fase pode ser validada com usuários reais antes de investir na próxima — reduz o risco de construir funcionalidades que ninguém usa.
- Priorização fica mais clara: se a Fase 1 depende da Fase 2, reescrevemos — não esperamos.
- Stakeholders têm visibilidade do roadmap com entregáveis concretos por fase, não listas abstratas de funcionalidades.

**Negativas / trade-offs:**
- A regra pode gerar tensão com decisões de arquitetura: preparar o modelo de dados para fases futuras (ex.: Casa para multi-morador) tem custo técnico presente sem benefício imediato de UX.
- Fases bem delimitadas criam expectativa de datas — e datas de fases são difíceis de prometer quando a fase anterior não validou o produto.
- Alguns recursos genuinamente dependem de outros: Modo Mercado ([ADR-015](./ADR-015-modo-mercado-na-fase-1.md)) precisa de uma Lista com Sugestões para ter valor — a "independência" da Fase 1 pressupõe Fase 0 em uso. A regra deve ser lida como "entrega valor sem a próxima fase", não "entrega valor sem nenhuma fase anterior".

## Alternativas consideradas
- **Roadmap por épicos (sem fases explícitas):** rejeitado porque épicos sem ordem de entrega não comunicam prioridade e permitem que discussões de funcionalidade avancem sem âncora de valor entregável.
- **MVP único com todas as funcionalidades priorizadas (sem fases):** rejeitado porque gera um MVP de 6–12 meses de desenvolvimento antes de qualquer aprendizado real — contraria a filosofia de "assistente que aprende com o uso".
- **Fases por área funcional (ex.: "fase de IA", "fase de captura"):** rejeitado porque uma fase de "captura" que inclui tanto captura manual (valor alto, custo baixo) quanto foto da nota (valor alto, custo alto) não comunica o que entregar primeiro.

## Referências
- [docs/visao.md](../visao.md) — Filosofia do produto: aprendizado contínuo
- [ADR-010](./ADR-010-multi-morador-fora-do-mvp.md) — exemplo de decisão de faseamento (modelo de dados agora, UX depois)
- [ADR-014](./ADR-014-foto-da-nota-na-fase-3.md) — foto postergada para a Fase 3 por esta regra
- [ADR-020](./ADR-020-adocao-de-adrs.md) — rastreio das decisões de faseamento
