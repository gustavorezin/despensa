# ADR-011: Vocabulário canônico (Item, Compra, Despensa, Lista, Casa, Sugestão)

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
As specs usam termos inconsistentes entre si: "inventário" e "estoque" na spec-produto, "inventário" e "Despensa" no plano de UX, "lista automática" e "recomendações" como conceitos separados. Sem vocabulário unificado, cada ADR, cada tela, cada microcópia pode usar termos diferentes para o mesmo conceito — gerando confusão no time e incoerência na interface. O problema se agrava com o tempo: uma decisão futura que usa "inventário" estará em conflito silencioso com telas que usam "Despensa".

## Decisão
Adotamos seis termos canônicos que substituem todos os sinônimos nas specs, ADRs, microcópia e código:

| Termo | Significado | Substitui |
|---|---|---|
| **Lista** | Lista de compras corrente (Sugestões + itens manuais) | "lista automática", "recomendações" |
| **Despensa** | Estoque estimado da Casa | "inventário", "estoque" |
| **Item** | Produto genérico normalizado (ex.: "Leite Integral") | "produto", "item de lista" |
| **Compra** | Evento de abastecimento (uma ida ao mercado) | "compra", "registro", "nota" |
| **Casa** | Container de dados; usuário pertence a uma Casa | "residência", "lar", "conta familiar" |
| **Sugestão** | Item proposto pela IA, com badge visual | "recomendação", "sugestão automática" |

O usuário **nunca** vê "inventário", "normalização" ou percentuais de confiança.

## Consequências
**Positivas:**
- Todos os documentos, telas e ADRs futuros falam a mesma língua — onboarding de novos membros do time é mais rápido.
- Reduz ambiguidade nas reviews de UX: "esse campo é um Item ou uma Compra?" tem resposta precisa.
- Vocabulário doméstico ("Despensa", "Casa") reforça o posicionamento de assistente familiar, não de sistema técnico.
- ADRs podem se referenciar sem ambiguidade.

**Negativas / trade-offs:**
- "Compra" no vocabulário canônico é um evento (ida ao mercado), não um Item comprado — isso é contraintuitivo. Precisa ser documentado explicitamente para novos desenvolvedores.
- "Item" é muito genérico em inglês e em código pode colidir com palavras reservadas ou convenções de ORM. O time de back-end precisará de atenção ao nomear entidades.
- Divergência entre vocabulário da interface e vocabulário do banco de dados (se o back-end usar "Product" e "Purchase") pode causar confusão ao ler código junto de uma tela.

## Alternativas consideradas
- **Manter os termos das specs originais ("lista automática", "inventário"):** rejeitado porque perpetua a ambiguidade e torna os ADRs mais difíceis de navegar.
- **Termos em inglês (alinhados com código):** rejeitado porque o produto é em português e misturar idiomas na microcópia e nos ADRs criaria distância entre o que o usuário vê e o que o time documenta.
- **Glossário separado sem substituição explícita nas specs:** rejeitado porque glossários opcionais não são seguidos; a substituição precisa ser declarada e cobrada em revisão.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — fonte das inconsistências de vocabulário resolvidas aqui
- [docs/visao.md](../visao.md) — linguagem usada para público-alvo
- [ADR-003](./ADR-003-lista-absorve-recomendacoes.md) — "Lista" substitui "lista automática" + "recomendações"
- [ADR-010](./ADR-010-multi-morador-fora-do-mvp.md) — "Casa" como container de dados
