# ADR-010: Multi-morador fora do MVP, modelo de Casa pronto desde o Dia 1

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (modelo) / 5 (rollout)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A visão do produto é uma Casa compartilhada entre moradores — a spec-produto prevê explicitamente múltiplos moradores com dados compartilhados. No entanto, a funcionalidade de convite, permissões e resolução de conflitos de escrita simultânea exige investimento significativo de engenharia. Colocar multi-morador no MVP atrasaria a entrega de valor básico (Lista + Despensa + Compras) sem validar nada de novo. Ao mesmo tempo, ignorar o modelo de dados multi-morador no MVP criaria retrabalho custoso no futuro.

## Decisão
Multi-morador como funcionalidade de produto (convidar moradores, ver quem registrou, resolver conflitos) fica fora do MVP e entra na Fase 5. Porém, o modelo de dados adota desde a Fase 0 o conceito de **Casa** como container de todos os dados — cada usuário pertence a uma Casa, e todo dado (Itens, Compras, Despensa) vive dentro da Casa, não do usuário. Isso garante que adicionar moradores na Fase 5 não exige migração de dados.

## Consequências
**Positivas:**
- MVP entregue sem a complexidade de permissões, convites e conflitos de sincronização.
- A decisão de arquitetura de dados (Casa como container) não tem custo de UX visível — o usuário no MVP simplesmente não vê o conceito de moradores.
- Nome da Casa é coletado no onboarding ([ADR-009](./ADR-009-onboarding-3-telas.md)) de forma natural, sem parecer infraestrutura técnica.
- A Fase 5 adiciona moradores sem reescrever queries ou migrar dados.

**Negativas / trade-offs:**
- Se dois usuários de uma mesma casa real instalarem o app no MVP, terão Casas separadas e dados duplicados — experiência ruim que não pode ser corrigida sem suporte humano.
- O nome "Casa" no onboarding pode confundir usuário solo que mora em apartamento e não entende por que precisa nomear a Casa.
- A abstração de Casa introduz um nível extra no modelo de dados que tem custo de back-end mesmo quando não é usado.

## Alternativas consideradas
- **Multi-morador desde o MVP:** rejeitado porque convites, permissões e resolução de conflitos triplicam a complexidade do back-end — atrapalha entrega de valor básico sem validar a hipótese central de aprendizado de compras.
- **Modelo de dados centrado no usuário (sem Casa) no MVP, migrar depois:** rejeitado porque a migração para Casa na Fase 5 exigiria remapear todos os dados existentes — risco de perda de histórico e complexidade de query incompatível com entrega ágil.
- **Ignorar multi-morador completamente (fora do roadmap):** rejeitado porque contraria a visão do produto e da spec-produto; seria desonesto com o stakeholder apresentar um modelo sem caminho para colaboração.

## Referências
- [docs/visao.md](../visao.md) — Público-alvo: famílias e residências compartilhadas
- [docs/spec-produto.md](../spec-produto.md) — Casas: múltiplos moradores, dados compartilhados
- [ADR-009](./ADR-009-onboarding-3-telas.md) — nome da Casa coletado no onboarding
- [ADR-011](./ADR-011-vocabulario-canonico.md) — "Casa" como termo canônico
