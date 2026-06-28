# ADR-006: Sugestões da IA agrupadas por motivo (não por categoria)

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A Lista unifica Sugestões automáticas e itens manuais ([ADR-003](./ADR-003-lista-absorve-recomendacoes.md)). Como organizar esses itens dentro da tela? A organização por categoria de produto (Mercearia, Laticínios, Hortifruti) é comum em aplicativos de lista e facilita o uso no mercado. Porém, ela esconde a razão pela qual cada Item está sendo sugerido — o usuário não sabe se o arroz apareceu porque acabou ou porque é dia de compra. Essa falta de explicação enfraquece a confiança no sistema e contraria o princípio de transparência.

## Decisão
Na Lista, as Sugestões são agrupadas pelo motivo da Sugestão (ex.: "Provavelmente acabando", "Recorrentes", "Você adicionou"), não por categoria de produto. Cada grupo tem nome descritivo em linguagem natural. A categoria do produto fica disponível dentro do detalhe do Item e é usada pelo Modo Mercado ([ADR-015](./ADR-015-modo-mercado-na-fase-1.md)) para organização física no supermercado.

## Consequências
**Positivas:**
- O usuário entende imediatamente por que cada Item está na lista — sem precisar tocar.
- Reforça a percepção de IA útil e explicável, construindo confiança ao longo do tempo.
- Separa claramente intenção da IA ("provavelmente acabando") de intenção do usuário ("você adicionou").
- Complementa a explicação em tap-to-expand ([ADR-008](./ADR-008-explicacao-em-tap-to-expand.md)) — o grupo é o resumo, o drawer é o detalhe.

**Negativas / trade-offs:**
- No supermercado, a Lista agrupada por motivo é ineficiente: o usuário precisa andar pelo mercado seguindo a lógica da IA, não a lógica das prateleiras. Mitiga-se com Modo Mercado [F1] que reorganiza por categoria.
- Se um Item se enquadra em mais de um motivo (recorrente E provavelmente acabando), a lógica de priorização precisa ser clara no back-end — complexidade não trivial.
- Grupos com poucos itens fragmentam visualmente a Lista; requer lógica de colapso ou fusão de grupos pequenos.

## Alternativas consideradas
- **Agrupamento por categoria de produto (Mercearia, Laticínios…):** rejeitado para a Lista principal porque esconde o raciocínio da IA — o usuário sabe "o quê" mas não "por quê". Reservado para o Modo Mercado.
- **Lista plana sem grupos, ordenada por prioridade:** rejeitado porque sem grupos o usuário não tem âncora visual para entender o critério de ordenação; Sugestões da IA ficam misturadas com itens manuais sem diferenciação clara.
- **Tabs dentro da Lista ("IA" | "Manual"):** rejeitado porque fragmenta a experiência e contradiz [ADR-003](./ADR-003-lista-absorve-recomendacoes.md) de unificação.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Recomendações, Explicações, Transparência
- [docs/spec-design.md](../spec-design.md) — IA identificada, editável, explicada
- [ADR-003](./ADR-003-lista-absorve-recomendacoes.md) — unificação da Lista
- [ADR-008](./ADR-008-explicacao-em-tap-to-expand.md) — explicação detalhada sob demanda
- [ADR-015](./ADR-015-modo-mercado-na-fase-1.md) — Modo Mercado com agrupamento por categoria
