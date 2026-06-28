# ADR-020: Adoção de ADRs em `docs/adr/`

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** meta
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
Projetos de produto acumulam decisões silenciosas. Sem registro, a mesma discussão sobre "por que a home é a Lista e não a Despensa?" acontece novamente a cada novo membro do time, a cada sprint de refinamento, a cada troca de prioridade. O custo não é só de tempo — é o risco de reverter decisões tomadas por boas razões que ninguém lembra mais. As specs existentes (`visao.md`, `spec-produto.md`, `spec-design.md`) descrevem **o quê** foi decidido mas raramente **por quê** e **o que foi rejeitado**.

## Decisão
Toda decisão de UX ou produto não-trivial é documentada como um ADR em `docs/adr/`, seguindo o template `_template.md`. ADRs são imutáveis: uma decisão revista não edita o ADR anterior — cria um novo com `Status: Substituído por ADR-XXX`. Numeração é sequencial e nunca reutilizada. O `README.md` em `docs/adr/` é o índice navegável.

## Consequências
**Positivas:**
- Onboarding de novos membros do time em decisões de produto levita de semanas para horas.
- Decisões revisitadas têm contexto de origem disponível — facilita distinguir "mudamos de ideia" de "implementamos errado".
- O rastro de alternativas rejeitadas evita que o time proponha repetidamente soluções que já foram consideradas e descartadas.
- Revisões de produto têm referências concretas: "como ficou definido em ADR-006" é mais preciso que "me parece que foi decidido assim".

**Negativas / trade-offs:**
- ADRs têm custo de escrita: cada decisão documentada custa 30–60 minutos de redação cuidadosa. O time precisa valorizar esse investimento, senão os ADRs ficam superficiais ou não são escritos.
- Se o ADR não for escrito no momento da decisão (mas semanas depois, de memória), perde precisão — o "por que rejeitamos X" começa a ser reconstruído em vez de documentado.
- ADRs só têm valor se consultados. Se o time não tem o hábito de ler `docs/adr/` antes de propor mudanças, o repositório vira arquivo morto.
- A regra de "não editar ADR anterior" pode gerar ruído: um projeto com muitas mudanças de direção acumula ADRs do tipo "substituído por", tornando o índice volumoso.

## Alternativas consideradas
- **Decisões em comentários de PR ou issues do tracker:** rejeitado porque são efêmeros, difíceis de buscar por tema e não comunicam contexto para pessoas externas ao PR. Um novo membro não sabe que precisa ler o PR #47 para entender por que a home é a Lista.
- **Seção de "decisões" dentro das specs existentes:** rejeitado porque as specs descrevem o estado atual do produto, não o raciocínio das escolhas. Misturar spec e ADR torna ambos mais difíceis de manter — specs mudam com o produto, ADRs são imutáveis.
- **Nenhum registro formal (decisões em reunião e memória do time):** rejeitado porque o custo de ausência de registro já foi sentido durante a criação das specs, que têm inconsistências de vocabulário e ambiguidades que este conjunto de ADRs resolve.

## Referências
- [docs/visao.md](../visao.md) — referência primária que os ADRs complementam
- [docs/spec-produto.md](../spec-produto.md) — spec que gerou as inconsistências que ADRs resolvem
- [docs/adr/_template.md](./_template.md) — template canônico
- [docs/adr/README.md](./README.md) — índice navegável deste conjunto de ADRs
- [ADR-019](./ADR-019-faseamento.md) — outra ADR meta que define regras de processo
