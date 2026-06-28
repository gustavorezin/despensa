# ADR-018: Offline com fila de sync — Fase 4

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 4
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
O MVP opera online only — assume conexão de internet disponível. A decisão de design mais crítica do produto é o uso no supermercado ([ADR-015](./ADR-015-modo-mercado-na-fase-1.md)), e supermercados têm sinal de celular frequentemente ruim ou inexistente em áreas cobertas. Se o app falha ao carregar a Lista ou ao marcar um Item porque não tem conexão, o usuário abandona o app e usa papel. A spec-produto não menciona requisitos de offline, mas a realidade de uso exige que a funcionalidade mais crítica (registrar Compra e ajustar Despensa) funcione sem internet.

## Decisão
Na Fase 4, o app suporta **offline** para as duas ações mais críticas: registrar Compra manual e ajustar Despensa. As ações são enfileiradas localmente e sincronizadas automaticamente quando a conexão é restaurada. Um indicador visual discreto mostra o estado de conectividade. Conflitos de sincronização (quando dois dispositivos editam o mesmo Item offline) são resolvidos por "último a sincronizar vence" com log visível.

## Consequências
**Positivas:**
- Elimina o principal ponto de falha em campo — o usuário no mercado sem sinal pode marcar Itens normalmente.
- Dados críticos não são perdidos se o app fechar durante sincronização — a fila persiste.
- O indicador visual de "sincronizando" / "sem conexão" mantém transparência sem alarmar o usuário.

**Negativas / trade-offs:**
- "Último a sincronizar vence" é uma política de conflito simples mas potencialmente destrutiva no contexto multi-morador ([ADR-010](./ADR-010-multi-morador-fora-do-mvp.md)) — dois moradores editando o mesmo Item offline podem perder dados um do outro.
- A fila de sync exige armazenamento local estruturado — aumenta complexidade de estado do cliente e superfície de bugs de sincronização.
- Offline limitado a registro e ajuste significa que visualizar a Lista offline (Itens que estavam no servidor antes da perda de conexão) depende de cache — que precisa ser gerenciado separadamente.
- Implementar offline corretamente é um dos projetos de engenharia mais subestimados; Fase 4 é o momento certo, mas a janela pode pressionar o cronograma se as Fases 1–3 atrasarem.

## Alternativas consideradas
- **Offline completo desde o MVP:** rejeitado porque adiciona meses de engenharia antes de validar qualquer hipótese de produto — fila de sync, resolução de conflitos e gerenciamento de cache local são projetos independentes de grande porte.
- **Cache somente leitura (ver a Lista offline, sem registrar):** considerado como versão mais simples, mas rejeitado como solução final porque a ação de registrar Compra no mercado é exatamente o caso de uso crítico de offline — cache read-only não resolve o problema principal.
- **Mensagem de erro explícita sem offline (ex.: "Sem conexão — tente novamente"):** é o comportamento do MVP e aceitável a curto prazo, mas inaceitável como estado permanente do produto maduro.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Princípio de baixo atrito
- [ADR-005](./ADR-005-captura-manual-com-autocomplete.md) — registro de Compra como ação a ser preservada offline
- [ADR-007](./ADR-007-ajuste-de-despensa-3-opcoes.md) — ajuste de Despensa como segunda ação crítica offline
- [ADR-010](./ADR-010-multi-morador-fora-do-mvp.md) — conflito de sync relevante quando multi-morador entra na Fase 5
- [ADR-015](./ADR-015-modo-mercado-na-fase-1.md) — Modo Mercado: contexto de uso que mais sofre sem offline
