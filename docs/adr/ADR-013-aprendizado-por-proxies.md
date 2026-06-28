# ADR-013: Aprendizado por proxies (compra + ajuste), consumo é bônus

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A spec-produto diz que "consumo é opcional — o sistema deve funcionar mesmo sem registros de consumo". Ao mesmo tempo, a spec-produto descreve que o sistema aprende frequência, consumo, sazonalidade e recorrência. Há uma inconsistência real: se consumo é opcional, como o sistema aprende o quanto um Item dura? Pedir ao usuário que registre consumo diário ("usei 200g de arroz hoje") é uma carga insuportável — ninguém vai fazer isso. Se não há consumo, o sistema não aprende?

## Decisão
O sistema aprende por **proxies implícitos**, sem exigir registro de consumo explícito:
- **Compra** registrada → sinal de que o Item foi consumido no intervalo desde a última Compra.
- **Ajuste de Despensa** (especialmente "Acabou" e "Pouco") → sinal de consumo acelerado ou lento.
- **Sugestão dispensada** (swipe [F1]) → sinal de que o usuário discorda da estimativa.

Registro explícito de consumo (ex.: "usei hoje") não é uma funcionalidade do MVP — é bônus se surgir em fases futuras.

## Consequências
**Positivas:**
- O usuário não precisa mudar comportamento para alimentar o aprendizado — o fluxo de Compra já existia por outras razões.
- O sistema começa a aprender imediatamente a partir da primeira Compra, sem configuração inicial de consumo.
- Alinha com a filosofia "quanto mais o sistema aprende, menos esforço é exigido" sem criar esforço adicional.

**Negativas / trade-offs:**
- A precisão do aprendizado no MVP é limitada: o sistema sabe que arroz foi comprado há 21 dias, mas não sabe quando acabou — a estimativa de "provavelmente acabando" é uma suposição, não um cálculo.
- Sem consumo explícito, mudanças de hábito (família cresceu, item parou de ser consumido) demoram mais para ser detectadas — o sistema pode sugerir itens que o usuário não usa mais por mais tempo.
- O aprendizado por proxies requer uma lógica de back-end mais sofisticada para não gerar ruído: uma Compra com 3 pacotes de café não significa que o usuário consumiu em dobro.

## Alternativas consideradas
- **Registro de consumo obrigatório (ex.: notificação diária "o que você usou hoje?"):** rejeitado porque exige mudança radical de comportamento e cria um sistema que pune usuários que não alimentam o dado — contraria o princípio de baixo atrito.
- **Consumo via integração com sensores (geladeira inteligente, peso em prateleira):** rejeitado porque é tecnicamente fora do escopo de um MVP mobile e dependeria de hardware específico do usuário.
- **Apenas frequência de Compra sem inferir consumo (modelo mais simples):** considerado como ponto de partida do MVP — o aprendizado por proxies de Compra é suficiente para a Fase 0; Ajuste como proxy entra como refinamento natural.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Consumo (opcional), Aprendizado, Lista automática
- [ADR-005](./ADR-005-captura-manual-com-autocomplete.md) — Compra como principal fonte de dados de aprendizado
- [ADR-007](./ADR-007-ajuste-de-despensa-3-opcoes.md) — Ajuste como segundo proxy de consumo
- [ADR-004](./ADR-004-confianca-como-semaforo.md) — semáforo que reflete a qualidade dos proxies
