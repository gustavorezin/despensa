# ADR-015: Modo Mercado como fullscreen modal — Fase 1

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
Usar o app no supermercado é um contexto radicalmente diferente de usá-lo na cozinha. No mercado, o usuário está em pé, com carrinho ou sacola, olhando prateleiras, com atenção dividida. A Lista organizada por motivo ([ADR-006](./ADR-006-sugestoes-agrupadas-por-motivo.md)) é ótima para planejar o que comprar mas ineficiente para executar a compra — o usuário precisa cruzar as prateleiras várias vezes para seguir a ordem de "Provavelmente acabando" → "Recorrentes". Além disso, elementos de UI como bottom bar e FAB consomem espaço que poderia ser item de lista.

## Decisão
O Modo Mercado é uma tela fullscreen modal (sem bottom bar, sem FAB) ativada por um botão explícito na Lista. Dentro do Modo Mercado, os Itens são reorganizados por **categoria de produto** para refletir a disposição de prateleiras. Cada Item tem check gigante para facilitar o toque com polegar. Ao finalizar, o CTA "Registrar compra" é pré-preenchido com os Itens marcados. O Modo Mercado entra na Fase 1.

## Consequências
**Positivas:**
- Reorganização por categoria elimina deslocamentos desnecessários no mercado — reduz tempo de compra.
- Fullscreen maximiza espaço de toque — checks grandes reduzem erros de toque em ambiente com distração.
- Transição clara entre "planejar" (Lista normal) e "executar" (Modo Mercado) — contextos distintos, interfaces distintas.
- Integra com [ADR-017](./ADR-017-marcar-da-lista-na-fase-1.md): ao sair do Modo Mercado, "Registrar compra" aproveita os Itens já marcados.

**Negativas / trade-offs:**
- A lógica de "categoria de produto" precisa estar disponível para cada Item no back-end desde a Fase 1 — se itens novos não tiverem categoria, aparecem em "Sem categoria", degradando a experiência.
- O botão "Modo Mercado" na Lista (tela principal) é um elemento permanente a partir da Fase 1, ocupando espaço visual mesmo quando o usuário não está no mercado.
- Fullscreen sem bottom bar pode desorientar usuários que querem checar a Despensa durante a compra — precisam sair do Modo Mercado para acessar outras abas.

## Alternativas consideradas
- **Modo Mercado como aba separada na bottom bar:** rejeitado porque ocupa slot de navegação permanente para um modo de uso pontual (uma vez por semana no máximo) e confunde o modelo mental do app.
- **Reorganização da Lista por categoria ao detectar GPS próximo ao supermercado:** rejeitado porque requer permissão de localização, tem alta latência e é muito invasivo — o usuário deve controlar quando ativa o Modo Mercado.
- **Modo Mercado no MVP (Fase 0):** rejeitado porque o valor do Modo Mercado depende de uma Lista madura com Itens suficientes — no MVP, com 0–5 Sugestões, o modo não entrega valor diferenciado.

## Referências
- [docs/spec-design.md](../spec-design.md) — Poucos toques, fluxos prioritários, registrar compra rápido
- [ADR-001](./ADR-001-bottom-tab-mais-fab-central.md) — bottom tab que o Modo Mercado oculta
- [ADR-006](./ADR-006-sugestoes-agrupadas-por-motivo.md) — agrupamento por motivo na Lista vs. por categoria no Modo Mercado
- [ADR-017](./ADR-017-marcar-da-lista-na-fase-1.md) — "marcar da lista" como saída natural do Modo Mercado
