# ADR-003: "Lista automática" e "recomendações" unificadas em Lista

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A spec-produto define "lista automática" e "recomendações" como dois requisitos funcionais distintos, o que sugere superfícies separadas. Na prática, do ponto de vista do usuário doméstico, ambos respondem à mesma pergunta: "o que preciso comprar?". Manter duas superfícies separadas criaria redundância, forçaria o usuário a checar dois lugares e tornaria as Sugestões da IA menos visíveis — enterradas em uma aba secundária.

## Decisão
Lista automática e recomendações da IA são exibidas na mesma tela (Lista), diferenciadas apenas visualmente por grupos com motivo explícito (ex.: "Provavelmente acabando", "Recorrentes"). Itens adicionados manualmente coexistem na mesma lista com um grupo próprio. O usuário não vê dois sistemas — vê uma Lista única.

## Consequências
**Positivas:**
- Experiência unificada: o usuário vai a um lugar para decidir o que comprar.
- Sugestões da IA ganham visibilidade máxima — estão na tela principal, não em submenu.
- Reduz carga cognitiva: menos conceitos para aprender.

**Negativas / trade-offs:**
- A Lista pode ficar longa e aparentemente bagunçada se os grupos não forem bem priorizados. Requer curadoria cuidadosa da ordenação por relevância.
- Misturar sugestões automáticas com itens manuais pode gerar confusão sobre "o que a IA gerou vs. o que eu adicionei". Mitiga-se com badge visual claro de Sugestão ([ADR-006](./ADR-006-sugestoes-agrupadas-por-motivo.md)).
- Se o usuário quiser ver apenas as Sugestões da IA (sem seus itens manuais), não há filtro fácil no MVP.

## Alternativas consideradas
- **Duas abas dentro da Lista ("Sugestões" | "Minha lista"):** rejeitado porque fragmenta a experiência e o usuário nunca sabe onde olhar primeiro ao entrar no app.
- **Aba separada "Recomendações" na bottom bar:** rejeitado porque ocupa slot de navegação primária e cria pressão para encher a aba com conteúdo, inflando a IA além do necessário no MVP.
- **Recomendações como notificação push apenas:** rejeitado porque torna o descobrimento passivo — o usuário que não tem notificações ativas nunca vê as Sugestões.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Lista automática, Recomendações
- [ADR-002](./ADR-002-home-eh-a-lista.md) — Lista como home
- [ADR-006](./ADR-006-sugestoes-agrupadas-por-motivo.md) — agrupamento por motivo dentro da Lista
- [ADR-011](./ADR-011-vocabulario-canonico.md) — vocabulário: "Lista" e "Sugestão"
