# ADR-002: Home é a Lista (não dashboard, não despensa)

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A spec-produto lista "lista automática" e "recomendações" como dois requisitos funcionais separados, e a spec-design diz que "lista de compras é a principal tela do sistema". Simultaneamente, a Despensa é onde vive o estoque estimado — uma candidata natural a home para um produto de abastecimento. Havia ambiguidade real sobre qual tela o usuário vê primeiro ao abrir o app. A resposta define o foco do produto: é ferramenta de compra ativa ou painel de controle de estoque?

## Decisão
A aba ativa ao abrir o aplicativo é a Lista. A Lista unifica sugestões da IA e itens manuais em uma única superfície orientada à ação de comprar. A Despensa é uma aba secundária, não a home.

## Consequências
**Positivas:**
- Reforça o posicionamento de "assistente de compras", não de "controle de estoque".
- A tarefa mais frequente (ver o que precisa comprar) exige zero toques adicionais ao abrir o app.
- A Lista serve de âncora para sugestões da IA — o usuário não precisa ir a outro lugar para ver Sugestões.

**Negativas / trade-offs:**
- Usuários que querem checar a Despensa precisam de 1 toque extra — não é um fluxo de primeiro acesso.
- Uma Lista vazia no Dia 1 (antes de qualquer Compra registrada) pode frustrar novos usuários que esperam ver valor imediato. Mitiga-se com estado vazio orientado a ação ([ADR-012](./ADR-012-estado-vazio-com-cta.md)).
- A decisão fixa a navegação de abertura; se o produto evoluir para um painel de insights, a home precisará ser reconsiderada.

## Alternativas consideradas
- **Despensa como home:** rejeitado porque o usuário médio abre o app com intenção de comprar, não de auditar estoque. Colocar inventário na home muda o posicionamento para ferramenta de controle.
- **Dashboard de resumo (estoque + sugestões + histórico):** rejeitado porque adiciona uma tela intermediária sem ação direta, aumenta complexidade de desenvolvimento e fragmenta a experiência no MVP.
- **Última tela visitada (persistência de estado):** rejeitado porque comportamento inconsistente entre sessões gera desorientação; requer estado de sessão mais complexo no MVP.

## Referências
- [docs/spec-design.md](../spec-design.md) — "Lista de compras: Principal tela do sistema"
- [docs/spec-produto.md](../spec-produto.md) — Lista automática, Recomendações
- [ADR-001](./ADR-001-bottom-tab-mais-fab-central.md) — estrutura de navegação que suporta esta decisão
- [ADR-003](./ADR-003-lista-absorve-recomendacoes.md) — como Lista e Sugestões foram unificadas
- [ADR-012](./ADR-012-estado-vazio-com-cta.md) — estado vazio da Lista no Dia 1
