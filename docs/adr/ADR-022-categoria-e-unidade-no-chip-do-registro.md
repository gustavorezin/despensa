# ADR-022: Categoria e unidade definidas no chip do registro

- **Status:** Aceito
- **Data:** 2026-07-12
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
`Item.categoria` e `Item.unidadePadrao` existem no modelo desde a Fase 0, mas nenhuma tela os captura — a Despensa agrupa por categoria e quase tudo cai em "Sem categoria". O Modo Mercado ([ADR-015](./ADR-015-modo-mercado-na-fase-1.md)) depende de Itens categorizados para reorganizar por prateleira. Ao mesmo tempo, a captura manual é deliberadamente minimalista ([ADR-005](./ADR-005-captura-manual-com-autocomplete.md)): busca → chip → confirmar, ≤2 toques por item — categoria obrigatória destruiria isso.

## Decisão
Tocar no chip de um item durante o registro abre um **bottom sheet opcional** com quantidade, **unidade** e **categoria**. Unidades e categorias vêm de **listas fixas** definidas no domínio do Item (~10 categorias domésticas, 6 unidades). Informar categoria/unidade **sobrescreve** a classificação do Item (a última palavra é do usuário). Item sem categoria aparece no grupo "Sem categoria".

## Consequências
**Positivas:**
- O caminho rápido continua ≤2 toques: quem não abre o sheet registra como antes.
- Listas fixas garantem agrupamento consistente na Despensa e no Modo Mercado — sem "Laticínio"/"Laticínios"/"laticinios" fragmentando prateleiras.
- A classificação é feita no momento em que o usuário está pensando no item, sem tela de gestão separada.

**Negativas / trade-offs:**
- Categorias fixas podem não cobrir todos os hábitos; casos raros caem em "Sem categoria".
- Sobrescrever a classificação vale para toda a Casa — um morador pode reclassificar o que outro classificou (aceitável: modelo colaborativo da Casa).

## Alternativas consideradas
- **Categorização automática por IA:** rejeitada porque capacidade de linguagem entra em fase posterior (spec-tecnica §5.4); manual e fixo resolve agora.
- **Categoria obrigatória no registro:** rejeitada porque adiciona atrito a toda captura, violando o ADR-005.
- **Categoria em texto livre:** rejeitada porque fragmentaria o agrupamento do Modo Mercado e da Despensa.
- **Tela separada de gestão de Itens:** rejeitada nesta fase porque adiciona superfície de navegação para resolver o que o chip resolve no contexto.

## Referências
- [docs/spec-design.md](../spec-design.md) — §6.3 fluxo de registro
- [ADR-005](./ADR-005-captura-manual-com-autocomplete.md) — captura minimalista
- [ADR-015](./ADR-015-modo-mercado-na-fase-1.md) — dependência de categoria
