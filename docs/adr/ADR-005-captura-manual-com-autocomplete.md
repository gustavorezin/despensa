# ADR-005: Captura manual com autocomplete agressivo no MVP

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
Registrar uma Compra é o fluxo principal do produto — sem ele, não há dados, não há aprendizado, não há Sugestões. A spec-produto prevê captura manual no MVP e via nota fiscal futuramente. A spec-design exige poucos toques e pouca digitação. A tensão está em que registrar manualmente uma Compra de 10+ itens é intrinsecamente tedioso; se o atrito for alto, o usuário abandona após a primeira tentativa. Foto da nota fiscal resolveria o problema, mas aumenta a complexidade do MVP além do aceitável ([ADR-014](./ADR-014-foto-da-nota-na-fase-3.md)).

## Decisão
No MVP, a captura de Compra é exclusivamente manual, mas o autocomplete é agressivo: começa a sugerir Itens a partir do segundo caractere digitado, prioriza Itens já comprados pela Casa, e permite adicionar um Item à Compra com um único toque na sugestão. Cada Item vira um chip com quantidade editável inline.

## Consequências
**Positivas:**
- Elimina a maior parte da digitação para Itens recorrentes — depois da primeira Compra, o usuário digita 2–3 letras e toca.
- O catálogo de Itens cresce organicamente a cada Compra: o autocomplete fica melhor com o uso.
- Implementação determinística, sem dependência de IA ou câmera — MVP mais estável.
- A tela de captura já está arquitetada para receber Foto ([F3]) e Marcar da lista ([F1]) sem redesenho.

**Negativas / trade-offs:**
- Registrar 5 itens manualmente custa ~20 toques — tolerável, mas perceptivelmente mais lento que escanear uma nota.
- Usuários com pressa no caixa provavelmente não usarão o app ali — o registro acontece depois, de memória, introduzindo erros.
- Itens comprados pela primeira vez (sem histórico) não se beneficiam do autocomplete: a digitação completa é necessária.

## Alternativas consideradas
- **Foto da nota fiscal no MVP:** rejeitado porque exige OCR, normalização de itens por IA e tela de revisão — triplica a complexidade do MVP e atrasa a entrega do produto básico. Ver [ADR-014](./ADR-014-foto-da-nota-na-fase-3.md).
- **Lista pré-cadastrada de produtos (catálogo fixo):** rejeitado porque impõe curadoria contínua de produto e não respeita a normalização por Casa — "Leite Integral" da Camila pode ter qty diferente do catálogo genérico.
- **Voz (ditado):** rejeitado porque depende de reconhecimento de voz confiável para nomes de produtos, é inutilizável em locais barulhentos e requer tratamento de linguagem natural não prioritário no MVP.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Compras: inicialmente manual; Produtos: normalização
- [docs/spec-design.md](../spec-design.md) — Poucos toques, pouca digitação
- [ADR-013](./ADR-013-aprendizado-por-proxies.md) — como a Compra alimenta o aprendizado
- [ADR-014](./ADR-014-foto-da-nota-na-fase-3.md) — foto da nota como evolução do fluxo
- [ADR-017](./ADR-017-marcar-da-lista-na-fase-1.md) — terceira via de registro na Fase 1
