# ADR-025: Dicas de uso centralizadas na Conta

- **Status:** Aceito
- **Data:** 2026-07-12
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
O valor do app depende de o usuário entender o jeito certo de usá-lo: registrar Compras logo, ajustar a Despensa quando notar diferença, dispensar Sugestões ruins (tudo alimenta o aprendizado — [ADR-013](./ADR-013-aprendizado-por-proxies.md)). Nada disso é óbvio na interface, e o produto não quer dar o "caminho das pedras" com tours guiados — quer dar dicas simples que o usuário consulta quando quiser.

## Decisão
Uma página estática **"Dicas de uso"**, acessível pela aba Conta, reúne dicas curtas por tela (Registrar, Despensa, Lista, Compras) e a filosofia geral de uso, em tom simples e direto. Sem tour guiado, sem cards contextuais por tela, sem estado de leitura/dispensa.

## Consequências
**Positivas:**
- Zero intrusão: quem quer aprender encontra; quem já sabe nunca é interrompido.
- Zero estado: nada a persistir, sincronizar ou invalidar — a página é conteúdo puro.
- Um único lugar para manter atualizado conforme o produto evolui.

**Negativas / trade-offs:**
- Descoberta passiva: quem nunca abre a Conta não encontra as dicas. Aceito — o app deve ser usável sem elas.

## Alternativas consideradas
- **Tour guiado / onboarding interativo:** rejeitado porque adiciona peso, interrompe o primeiro uso e envelhece mal a cada mudança de tela.
- **Cards contextuais dispensáveis por tela:** rejeitado porque exige estado de dispensa (por dispositivo ou por usuário) para um benefício pequeno frente à página central.

## Referências
- [docs/visao.md](../visao.md) — assistente, não sistema de controle
- [ADR-013](./ADR-013-aprendizado-por-proxies.md) — comportamento que as dicas ensinam
