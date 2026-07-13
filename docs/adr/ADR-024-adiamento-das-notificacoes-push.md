# ADR-024: Adiamento das notificações push

- **Status:** Aceito
- **Data:** 2026-07-12
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
O [ADR-016](./ADR-016-notificacoes-1-por-dia.md) definiu o formato das notificações push (máx. 1/dia, deep-link para a Lista) e fixou a entrega na Fase 1. Ao planejar a Fase 1, o dono do produto decidiu priorizar o registro de Compra completo, o Modo Mercado e o "Marcar da lista" — e o próprio ADR-016 reconhece que o "quando enviar" exige análise de horário de uso, complexidade não trivial.

## Decisão
As notificações push **saem do escopo da Fase 1**. Serão implementadas em fase posterior, a definir. Tudo o mais decidido no ADR-016 (limite 1/dia, deep-link, conteúdo contextual, opt-out na Conta) permanece válido para quando forem implementadas.

## Consequências
**Positivas:**
- A Fase 1 entrega valor mais cedo, concentrada no que reduz atrito de uso ativo.
- Evita construir infraestrutura de push (permissões, service worker, agendamento inteligente) antes de o hábito de registro estar consolidado.

**Negativas / trade-offs:**
- Reengajamento continua dependendo de abertura ativa do app — o risco de esquecimento apontado no ADR-016 permanece sem mitigação por mais tempo.

## Alternativas consideradas
- **Manter push na Fase 1:** rejeitada por decisão de priorização do dono do produto.
- **Versão simplificada (push em horário fixo):** rejeitada porque o ADR-016 mostra que horário mal escolhido torna a notificação inútil e gasta a atenção do usuário.

## Referências
- [ADR-016](./ADR-016-notificacoes-1-por-dia.md) — decisão de formato, fase ajustada por este ADR
- [ADR-019](./ADR-019-faseamento.md) — cada fase entrega valor sozinha
