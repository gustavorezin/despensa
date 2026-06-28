# ADR-009: Onboarding em 3 telas com "pular" legítimo

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
Todo novo usuário precisa nomear sua Casa (dado obrigatório para multi-morador futuro — [ADR-010](./ADR-010-multi-morador-fora-do-mvp.md)) e escolher como começar a usar o app. Sem onboarding, a Lista fica vazia e o usuário não sabe o que fazer ([ADR-012](./ADR-012-estado-vazio-com-cta.md)). O risco oposto é um onboarding extenso que peça dados que o app ainda não usa (preferências de IA, categorias favoritas, múltiplos moradores) — isso cria atrito antes do primeiro valor entregue. A spec-design pede fluxos curtos e a filosofia do produto é que o usuário não deve ser forçado a configurar o sistema para obter valor.

## Decisão
O onboarding tem exatamente 3 telas: (1) autenticação; (2) nome da Casa — único campo obrigatório; (3) escolha de como começar (registrar primeira Compra / inserir o que já tem na Despensa / pular). "Pular" é uma opção legítima e de primeiro nível — não escondida, não culpabilizante.

## Consequências
**Positivas:**
- O usuário chega à tela principal em menos de 1 minuto.
- Nome da Casa é coletado sem parecer burocrático — é o único dado pedido.
- "Pular" respeita usuários que preferem explorar antes de configurar; não penaliza esses usuários com estados de erro.
- A tela 3 é uma bifurcação orientada ao valor, não uma lista de preferências.

**Negativas / trade-offs:**
- Usuários que pulam chegam a uma Lista vazia — o estado vazio precisa ser muito bem resolvido ([ADR-012](./ADR-012-estado-vazio-com-cta.md)) para não transmitir a impressão de app quebrado.
- Sem coletar hábitos iniciais (itens frequentes, tamanho da família), as primeiras Sugestões da IA serão fracas — o aprendizado começa do zero. Isso é honesto, mas pode decepcionar usuários com expectativas altas.
- Não coletamos preferências de notificação no onboarding — o usuário pode não perceber que existe esse recurso [F1] até configurar a Conta.

## Alternativas consideradas
- **Onboarding de 5–7 telas com seed de dados (itens frequentes, tamanho da família):** rejeitado porque aumenta o atrito inicial sem entregar valor imediato — os dados de seed ficam desatualizados rapidamente e criam falsa sensação de personalização.
- **Zero onboarding (direto para a Lista):** rejeitado porque o nome da Casa é necessário para o modelo de dados multi-morador ([ADR-010](./ADR-010-multi-morador-fora-do-mvp.md)) e porque a tela de escolha da Tela 3 orienta o usuário ao primeiro valor de forma eficiente.
- **Onboarding obrigatório sem opção de pular:** rejeitado porque força um fluxo específico em usuários que podem querer explorar — contraria a filosofia do produto de baixo atrito e IA como assistente, não como controle.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Casas, Princípio de baixo atrito
- [docs/spec-design.md](../spec-design.md) — Fluxos curtos, poucos toques
- [ADR-010](./ADR-010-multi-morador-fora-do-mvp.md) — por que nomear a Casa é obrigatório desde o início
- [ADR-012](./ADR-012-estado-vazio-com-cta.md) — como a Lista vazia é tratada após "pular"
