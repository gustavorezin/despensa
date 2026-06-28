# ADR-012: Estados vazios sempre com CTA, nunca tela branca

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
No MVP, um novo usuário que pula o onboarding ([ADR-009](./ADR-009-onboarding-3-telas.md)) chega a uma Lista completamente vazia. A Despensa também estará vazia. O histórico de Compras estará vazio. Uma tela branca ou com mensagem genérica ("Nenhum item ainda") transmite a sensação de produto quebrado, não de produto esperando dados. A spec-design exige que o app transmita a sensação de assistente inteligente — e um assistente mudo não é inteligente.

## Decisão
Todo estado vazio do app tem obrigatoriamente um texto explicativo contextual e uma chamada para ação (CTA) principal visível. O texto explica por que está vazio e o CTA orienta ao próximo passo de maior valor. Telas brancas ou mensagens sem ação são vedadas.

Exemplos:
- Lista vazia → "Ainda estou aprendendo seus hábitos. Que tal registrar sua primeira compra?" [botão: Registrar compra]
- Despensa vazia → "Sua despensa ainda não tem itens. Registre uma compra para começarmos a estimar." [botão: Registrar compra]
- Histórico vazio → "Sem compras ainda. Registre sua primeira compra e veja o histórico aqui." [botão: Registrar compra]

## Consequências
**Positivas:**
- O usuário nunca sente que o app está quebrado — o estado vazio é um convite, não um beco sem saída.
- O CTA de "Registrar compra" no estado vazio reforça que esse é o fluxo fundacional do produto.
- Reduz abandono no Dia 1, que é o ponto de maior risco de churn em apps de aprendizado.
- É consistente com a filosofia de que o assistente orienta ativamente ([docs/visao.md](../visao.md)).

**Negativas / trade-offs:**
- Escrever microcópia contextual para cada estado vazio (Lista, Despensa, Histórico, busca sem resultados, filtro sem resultados) é trabalho de conteúdo não trivial — fácil de ser subestimado.
- CTA sempre para "Registrar compra" pode ser repetitivo demais. Estados específicos podem ter CTAs mais relevantes (ex.: Despensa vazia → "Ajustar despensa" pode ser mais útil que "Registrar compra").
- Se o estado vazio for decorativo demais (ilustrações, animações), compete com o CTA e aumenta peso do app.

## Alternativas consideradas
- **Tela branca com texto simples ("Nenhum item"):** rejeitado porque não orienta ação e transmite produto incompleto ou quebrado.
- **Estado vazio com dados de exemplo (seed fictício):** rejeitado porque confunde o usuário — dados que parecem reais mas são fictícios destroem a confiança quando o usuário percebe que são falsos.
- **Onboarding obrigatório antes de ver qualquer tela vazia:** rejeitado porque conflita com [ADR-009](./ADR-009-onboarding-3-telas.md) (opção de pular legítima) e com a filosofia de baixo atrito.

## Referências
- [docs/visao.md](../visao.md) — Filosofia: assistente ativo, não sistema passivo
- [docs/spec-design.md](../spec-design.md) — Comunicação, Fluxos prioritários
- [ADR-009](./ADR-009-onboarding-3-telas.md) — "pular" como origem do estado vazio
- [ADR-002](./ADR-002-home-eh-a-lista.md) — Lista como primeira tela que pode aparecer vazia
