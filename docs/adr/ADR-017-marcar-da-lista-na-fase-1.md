# ADR-017: "Marcar da lista" como 3ª via de registro — Fase 1

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 1
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
No MVP, registrar uma Compra exige digitar cada Item manualmente ([ADR-005](./ADR-005-captura-manual-com-autocomplete.md)). Conforme o usuário usa o app, a Lista começa a antecipar exatamente o que ele vai comprar — muitas vezes todos os Itens da Compra real já estão na Lista como Sugestões. Nesse cenário maduro, pedir ao usuário que redigite os Itens que ele já viu na Lista é redundância pura: ele acabou de marcar os Itens no Modo Mercado ([ADR-015](./ADR-015-modo-mercado-na-fase-1.md)) e agora precisa redigitar os mesmos Itens no fluxo de registro.

## Decisão
Na Fase 1, a tela de "Como quer registrar?" ganha uma segunda opção: **"Marcar da lista"**. Essa via usa os Itens já presentes na Lista como base e permite confirmar a Compra com os Itens pré-selecionados, editando quantidades se necessário. Disponível quando a Lista tem ao menos 1 Item. Complementa — não substitui — a via manual ([ADR-005](./ADR-005-captura-manual-com-autocomplete.md)).

## Consequências
**Positivas:**
- Para usuários com Lista madura, o registro de Compra cai de ~20 toques para ~5 toques — melhoria de atrito mais impactante da Fase 1.
- Cria um loop positivo: quanto mais o usuário usa a Lista, mais valiosa fica a via "Marcar da lista", incentivando engajamento contínuo.
- Integra naturalmente com Modo Mercado: o usuário marca os Itens no mercado e confirma ao sair, sem redigitar nada.
- Sinaliza maturidade do produto para o usuário: "o app já sabe o que comprei antes de eu dizer".

**Negativas / trade-offs:**
- Só entrega valor quando a Lista tem Sugestões precisas — nos primeiros meses de uso, a Lista pode ter muitos erros e "Marcar da lista" vira mais trabalho de correção do que digitação direta.
- Itens comprados que não estavam na Lista precisam ser adicionados manualmente de qualquer forma — a via "Marcar da lista" nunca cobre 100% de uma Compra com Itens novos.
- Aumenta a complexidade da tela de registro (3 opções na Fase 1+F3): precisa de UX cuidadosa para não sobrecarregar usuários novos com escolhas desnecessárias.

## Alternativas consideradas
- **"Marcar da lista" como fluxo padrão (substitui manual):** rejeitado porque dependeria de uma Lista sempre precisa — no início, a Lista tem poucas Sugestões e muitas lacunas; tornar isso padrão frustraria novos usuários.
- **"Marcar da lista" na Fase 0 (MVP):** rejeitado porque no MVP a Lista ainda não tem Sugestões maduras suficientes para tornar essa via valiosa; adicionaria complexidade sem benefício imediato.
- **Confirmar a Lista inteira como Compra com 1 toque (sem seleção):** rejeitado porque o usuário pode não ter comprado todos os Itens sugeridos; importar a Lista inteira como Compra introduziria dados incorretos na Despensa.

## Referências
- [docs/spec-design.md](../spec-design.md) — Poucos toques, registrar compra extremamente rápido
- [ADR-005](./ADR-005-captura-manual-com-autocomplete.md) — via manual que "Marcar da lista" complementa
- [ADR-014](./ADR-014-foto-da-nota-na-fase-3.md) — foto da nota como terceira via futura (Fase 3)
- [ADR-015](./ADR-015-modo-mercado-na-fase-1.md) — Modo Mercado que alimenta os Itens marcados
