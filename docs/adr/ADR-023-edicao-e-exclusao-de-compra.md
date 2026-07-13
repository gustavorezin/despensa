# ADR-023: Edição e exclusão de Compra com rederivação da Despensa

- **Status:** Aceito
- **Data:** 2026-07-12
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
Na Fase 0 uma Compra registrada é imutável: quem erra quantidade, item ou data não tem saída — o ajuste de Despensa corrige o presente, mas o histórico errado continua alimentando o aprendizado ([ADR-013](./ADR-013-aprendizado-por-proxies.md)). Registrar Compra deriva a Despensa e recalcula Sugestões na mesma transação, então qualquer mudança no histórico precisa refletir nesses dados derivados.

## Decisão
Uma Compra pode ser **editada** (descrição, data, itens: adicionar/remover/quantidade/unidade) e **excluída** (com confirmação). Após qualquer escrita, a Despensa é **rederivada por Item afetado** a partir do histórico persistido (a quantidade vem da Compra de data mais recente; um ajuste manual mais recente que ela continua dominando), e as Sugestões são regeneradas pelo mecanismo existente. Item sem nenhuma fonte restante (nenhuma Compra, nenhum ajuste) sai da Despensa.

## Consequências
**Positivas:**
- Erros de registro deixam de ser permanentes — confiança no histórico e no aprendizado.
- A rederivação por Item afetado é pontual e correta; nada de recalcular a Casa inteira na Despensa.
- O mesmo mecanismo corrige o registro com data retroativa ([ADR-021](./ADR-021-descricao-e-data-no-registro.md)).

**Negativas / trade-offs:**
- Itens da Lista marcados como COMPRADOS pela Compra **não são revertidos** ao editá-la/excluí-la: Sugestões renascem pelo motor no recálculo, mas um item adicionado manualmente à Lista e consumido pela Compra excluída precisa ser readicionado à mão. Aceito pela simplicidade.
- Editar uma Compra antiga não reconstitui consumo ocorrido entre lá e cá — a rederivação usa só os proxies persistidos (limitação inerente do modelo F0/F1).

## Alternativas consideradas
- **Compra imutável + "compra de correção":** rejeitada porque é hostil ao usuário e polui o histórico.
- **Rastrear `compraId` no ListaItem para reverter COMPRADO:** rejeitada porque é event sourcing em miniatura — complexidade desproporcional ao dano que evita.
- **Recalcular a Despensa da Casa inteira a cada escrita:** rejeitada porque só os Itens afetados mudam; as Sugestões já são recalculadas por Casa e continuam assim.

## Referências
- [ADR-013](./ADR-013-aprendizado-por-proxies.md) — proxies que a rederivação lê
- [ADR-021](./ADR-021-descricao-e-data-no-registro.md) — data retroativa
- [docs/spec-tecnica.md](../spec-tecnica.md) — §4 fluxos e transações
