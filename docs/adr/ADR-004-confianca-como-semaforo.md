# ADR-004: Confiança da estimativa exposta como semáforo (não % numérica)

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A spec-produto define que o estoque da Despensa é uma estimativa e que deve existir um nível de confiança dessa estimativa. A questão é como exibir isso. Uma percentagem numérica ("73% de confiança") é tecnicamente precisa, mas cognitivamente estranha para o contexto doméstico — ninguém pensa em estoque de arroz em percentagem. A spec-design exige linguagem simples e evitar termos técnicos. Ao mesmo tempo, exibir apenas a quantidade estimada sem indicação de incerteza pode gerar decisões de compra erradas.

## Decisão
O nível de confiança da estimativa de Despensa é exibido como semáforo de três estados: 🟢 (confiança alta — informação recente ou confirmada), 🟡 (confiança média — inferência com histórico moderado), 🔴 (confiança baixa — dado antigo ou nunca confirmado). Nenhum número percentual aparece na interface.

## Consequências
**Positivas:**
- Linguagem doméstica: o usuário entende instintivamente o que verde/amarelo/vermelho significa.
- Incentiva ação corretiva sem ansiedade: um item 🔴 convida ao ajuste rápido, não gera alarme.
- Visualmente escaneável: o usuário lê o estado de toda a Despensa com um passar de olhos.
- Preserva honestidade do sistema sem expor detalhes técnicos irrelevantes ao usuário.

**Negativas / trade-offs:**
- Perde granularidade: "72%" e "51%" viram o mesmo 🟡, ocultando diferença real de certeza.
- Definir os limiares entre 🟢/🟡/🔴 é uma decisão de back-end que impacta diretamente a percepção de confiabilidade — se mal calibrada, o 🟢 perde credibilidade.
- Usuários avançados que queiram entender a lógica exata não têm acesso a ela no MVP.

## Alternativas consideradas
- **Percentagem numérica (ex.: "78% confiante"):** rejeitado porque terminologia técnica contraria a spec-design e gera dúvida ("78% é bom? É preocupante?") sem orientar ação.
- **Texto qualitativo sem cor (ex.: "Estimativa recente" / "Dados desatualizados"):** rejeitado porque não é escaneável — o usuário precisa ler cada item, não pode perceber o estado da Despensa de relance.
- **Ocultar confiança totalmente:** rejeitado porque viola o princípio de transparência da spec-produto; o sistema perderia credibilidade ao apresentar estimativas como fatos.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Estoque: nível de confiança, Princípio de transparência
- [docs/spec-design.md](../spec-design.md) — Comunicação: linguagem simples, evitar termos técnicos
- [ADR-007](./ADR-007-ajuste-de-despensa-3-opcoes.md) — ajuste rápido que atualiza a confiança
- [ADR-008](./ADR-008-explicacao-em-tap-to-expand.md) — explicação detalhada disponível sob demanda
