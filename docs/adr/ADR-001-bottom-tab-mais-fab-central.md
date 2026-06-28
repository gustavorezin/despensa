# ADR-001: Bottom tab + FAB central como navegação primária

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (MVP)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
O aplicativo tem quatro áreas funcionais distintas (Lista, Despensa, Compras, Conta) mais uma ação primária frequente e urgente — registrar uma Compra. A spec-design exige poucos toques para qualquer ação e acesso rápido às funcionalidades principais. Uma navegação que force o usuário a navegar até uma tela específica para registrar uma Compra contradiz o princípio de baixo atrito. Ao mesmo tempo, colocar "Registrar" como mais uma aba dilui sua importância e torna a ação menos óbvia.

## Decisão
Adotamos bottom tab bar com quatro abas (Lista, Despensa, Compras, Conta) mais um FAB central persistente que aciona diretamente o fluxo de registro de Compra. Essa estrutura existe desde a Fase 0 e não muda em fases posteriores.

## Consequências
**Positivas:**
- Registrar uma Compra está sempre a 1 toque, independente de onde o usuário está.
- As quatro áreas principais são igualmente acessíveis sem hierarquia implícita indesejada.
- Padrão consolidado no ecossistema mobile (Material Design, iOS HIG) — curva de aprendizado zero.
- A estrutura de navegação acomoda recursos das Fases 1–5 sem redesenho: Modo Mercado entra dentro da Lista, multi-morador entra dentro de Conta.

**Negativas / trade-offs:**
- FAB central ocupa espaço visual permanente — não pode ser contextualizado por tela.
- Em telas onde "registrar Compra" não faz sentido imediato (ex.: Conta), o FAB persiste mesmo assim, criando leve ruído visual.
- Cinco itens na bottom bar (4 abas + FAB) está no limite superior recomendado pelo HIG; adicionar uma sexta área futura exigiria revisão da navegação.

## Alternativas consideradas
- **Drawer lateral (hamburger):** rejeitado porque esconde a navegação principal, aumenta toques para trocar de área e contraria a diretriz de interface limpa da spec-design.
- **Cinco abas sem FAB (registro como aba):** rejeitado porque equaliza "registrar Compra" às outras abas, perdendo a sinalização de que é a ação primária mais frequente.
- **FAB flutuante só na Lista:** rejeitado porque registrar uma Compra deve ser possível de qualquer contexto — o usuário chega do mercado e quer registrar imediatamente, sem precisar trocar de aba primeiro.

## Referências
- [docs/spec-design.md](../spec-design.md) — Navegação, Fluxos Prioritários
- [ADR-002](./ADR-002-home-eh-a-lista.md) — define qual aba é a home
- [ADR-015](./ADR-015-modo-mercado-na-fase-1.md) — Modo Mercado como fullscreen modal dentro da Lista
