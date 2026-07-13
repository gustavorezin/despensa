# ADR-021: Descrição livre e data editável no registro de Compra

- **Status:** Aceito
- **Data:** 2026-07-12
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A Compra é um evento (data + Itens + valor opcional, [ADR-011](./ADR-011-vocabulario-canonico.md)), mas o registro da Fase 0 não deixa o usuário dizer nada sobre o evento em si: a data é sempre "agora" e não há como identificar a Compra no histórico além dela. No uso real surgiram duas necessidades: registrar uma compra feita dias atrás (data retroativa) e reconhecer uma Compra no histórico ("foi a do Mercado Extra", "foi a janta do dia dos namorados").

## Decisão
A Compra ganha um campo **`descricao`** — texto livre, opcional, curto — exibido no histórico e no detalhe. A **data** passa a ser editável no registro: default hoje, datas retroativas permitidas, data futura proibida.

## Consequências
**Positivas:**
- O histórico fica reconhecível sem esforço: a descrição cobre tanto o lugar ("Mercado Extra") quanto a ocasião ("Janta do dia dos namorados") com um único campo.
- Data retroativa permite registrar a compra de ontem sem corromper a cronologia que alimenta a Despensa e o aprendizado.
- Ambos os campos são ignoráveis — o caminho rápido de captura ([ADR-005](./ADR-005-captura-manual-com-autocomplete.md)) continua intacto.

**Negativas / trade-offs:**
- Data retroativa obriga a derivação da Despensa a olhar o histórico (a Compra de data mais recente), não a Compra recém-registrada — a derivação fica um pouco mais cara.
- Texto livre não estrutura o dado: não dá para filtrar "todas as compras do Extra" com confiabilidade. Aceito — reconhecimento visual basta nesta fase.

## Alternativas consideradas
- **Entidade Mercado/local estruturado:** rejeitada porque cadastro de lojas é overengineering para o objetivo (reconhecer a Compra no histórico) e não cobre ocasiões ("janta especial").
- **Descrição obrigatória:** rejeitada porque adiciona atrito a toda captura, violando o princípio de baixo atrito.
- **Data sempre "agora" (status quo):** rejeitada porque quem esqueceu de registrar no dia perde a cronologia real — e a cronologia é insumo do aprendizado ([ADR-013](./ADR-013-aprendizado-por-proxies.md)).

## Referências
- [docs/spec-produto.md](../spec-produto.md) — §3.3 Compras
- [ADR-011](./ADR-011-vocabulario-canonico.md) — Compra como evento
- [ADR-005](./ADR-005-captura-manual-com-autocomplete.md) — captura de baixo atrito
