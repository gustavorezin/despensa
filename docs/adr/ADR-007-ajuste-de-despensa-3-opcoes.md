# ADR-007: Ajuste de despensa com 3 opções predefinidas + ajuste preciso

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A spec-produto permite ajuste de inventário a qualquer momento para recalibrar o estoque estimado. A spec-design exige atualização rápida da Despensa sem exigir muito tempo do usuário. O desafio: pedir ao usuário que informe a quantidade exata (ex.: "0,6 pacotes de café") é lento e propenso a erro. Mas oferecer só opções genéricas sem precisão pode frustrar usuários que querem calibrar o sistema com cuidado. A grande maioria dos ajustes do dia a dia cabe em um de três estados: "ainda tenho", "tá acabando" ou "acabou".

## Decisão
O ajuste de Despensa é feito via bottom sheet com três opções predefinidas — **Tem** (reforça confiança, mantém quantidade estimada), **Pouco** (reduz quantidade, move Item para a Lista), **Acabou** (zera estoque, promove Item ao topo da Lista) — mais uma quarta opção **Ajuste preciso** que abre um seletor numérico para quem precisa de granularidade. A interação padrão é 2 toques (Item → opção).

## Consequências
**Positivas:**
- Cobre ~90% dos ajustes reais sem teclado — usuário opera com polegar, em pé, na cozinha.
- "Acabou" atualiza a Lista automaticamente: fechar a embalagem vira ação de abastecimento sem esforço extra.
- A opção "Tem" funciona como confirmação de confiança: o usuário reafirma que o sistema está correto, melhorando o semáforo ([ADR-004](./ADR-004-confianca-como-semaforo.md)).
- Três opções são memorizáveis — o usuário não precisa pensar, só reconhecer.

**Negativas / trade-offs:**
- "Pouco" é subjetivo: o sistema precisa inferir uma quantidade a partir de um estado qualitativo, e essa inferência pode estar errada.
- Usuários que sempre usam "Ajuste preciso" terão uma experiência mais lenta do que se o seletor fosse a opção padrão.
- A semântica de "Tem" precisa ser comunicada claramente — o usuário pode interpretar como "adicionar mais", não como "confirmar que ainda há".

## Alternativas consideradas
- **Slider de quantidade diretamente (sem opções rápidas):** rejeitado porque exige atenção fina e um toque longo para calibrar; impraticável em contexto de cozinha com as mãos sujas ou ocupadas.
- **Apenas as 3 opções sem ajuste preciso:** rejeitado porque seria condescendente com usuários que querem precisão — violaria o princípio de que o sistema serve ao usuário, não o contrário.
- **Campo numérico livre como primeira opção:** rejeitado porque evoca teclado numérico em contexto de uso rápido; 80% dos usuários não precisam de precisão decimal para gerir café ou arroz.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Ajuste de inventário, Estoque estimado
- [docs/spec-design.md](../spec-design.md) — Atualização rápida, poucos toques
- [ADR-004](./ADR-004-confianca-como-semaforo.md) — semáforo de confiança alimentado pelo ajuste
- [ADR-013](./ADR-013-aprendizado-por-proxies.md) — ajuste como proxy de consumo
