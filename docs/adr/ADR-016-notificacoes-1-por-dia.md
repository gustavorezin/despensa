# ADR-016: Notificações no máximo 1 por dia — Fase 1

- **Status:** Aceito — fase de entrega ajustada pelo [ADR-024](./ADR-024-adiamento-das-notificacoes-push.md)
- **Data:** 2026-06-28
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
O principal risco de retenção do produto é o usuário esquecer de abrir o app. A spec-produto fala em "aprender padrões" — mas o aprendizado só acontece se o usuário registrar Compras regularmente. Notificações push são a ferramenta padrão para reengajamento, mas apps que abusam de notificações são deletados. Um assistente de abastecimento que notifica o usuário 3 vezes por dia ("sua Lista foi atualizada!", "Você comprou arroz 20 dias atrás!", "Está quase na hora de comprar!") cria fadiga e destrói a relação de confiança que o produto precisa cultivar.

## Decisão
O sistema envia no máximo **1 notificação push por dia** por Casa, com deep-link direto para a Lista. O conteúdo é contextual (ex.: "Sua lista parece pronta — 8 sugestões te esperando."). O usuário pode desativar notificações nas configurações de Conta. Notificações entram na Fase 1.

## Consequências
**Positivas:**
- Limite hard de 1/dia previne fadiga de notificação — o usuário aprende que a notificação do app vale atenção.
- Deep-link direto para a Lista reduz o atrito de reengajamento para 1 toque.
- Notificação contextual (menciona o número de sugestões) entrega valor imediato no próprio banner, sem exigir que o usuário abra o app para saber se vale abrir.
- O usuário que não recebe notificação hoje sabe que não há nada urgente — o silêncio é informativo.

**Negativas / trade-offs:**
- 1 notificação/dia pode ser insuficiente para usuários que fazem compras com alta frequência ou que têm mudanças rápidas na Despensa.
- A lógica de "quando enviar" a notificação diária precisa ser inteligente: enviar às 23h59 é tecnicamente "1 por dia" mas inútil. Requer análise de horário de uso por usuário — complexidade não trivial.
- Usuários que desativam notificações do sistema operacional não recebem nenhuma — o app fica dependente de abertura ativa.

## Alternativas consideradas
- **Sem limite fixo (IA decide quantas notificações enviar):** rejeitado porque a IA pode errar o tom e virar spam — o limite hard é uma salvaguarda de produto, não um teto técnico.
- **Notificações semanais (resumo semanal):** rejeitado porque semanal é tarde demais para uma despensa que muda diariamente; o usuário perde o timing ideal de compra e o app perde relevância.
- **Notificações baseadas em gatilhos (ex.: "Acabou o leite") em tempo real:** rejeitado porque o sistema não sabe em tempo real quando algo acabou — os sinais são proxies ([ADR-013](./ADR-013-aprendizado-por-proxies.md)), não sensores. Notificações em tempo real baseadas em proxies gerariam falsos positivos frequentes.

## Referências
- [docs/visao.md](../visao.md) — Filosofia: assistente, não sistema de controle
- [docs/spec-produto.md](../spec-produto.md) — Princípio de baixo atrito
- [ADR-013](./ADR-013-aprendizado-por-proxies.md) — proxies que alimentam o conteúdo da notificação
- [ADR-003](./ADR-003-lista-absorve-recomendacoes.md) — Lista como destino do deep-link
