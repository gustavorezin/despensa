# ADR-014: Foto da nota fiscal e OCR ficam na Fase 3, não no MVP

- **Status:** Aceito
- **Data:** 2026-06-28
- **Fase do produto:** 0 (decisão) / 3 (rollout)
- **Decisor(es):** Gustavo Rezin Durigon

## Contexto
A spec-produto prevê captura via nota fiscal "futuramente". A spec-design pede poucos toques e pouca digitação — e foto da nota é a resposta mais óbvia para esse problema, pois registrar 15 itens manualmente leva ~60 toques versus 3 toques com foto. A pressão para incluir foto no MVP é real. O problema é que foto da nota exige câmera, OCR, IA de normalização de itens (nomes abreviados de NF-e como "REQ DESN UHT" → "Leite Desnatado"), tela de revisão de itens identificados, e lógica de aprendizado de correções manuais. Cada um desses componentes tem chance de falhar — e falha silenciosa em OCR é péssima UX.

## Decisão
Foto da nota fiscal, OCR e revisão de itens identificados entram na Fase 3, não no MVP. A tela de captura de Compra ([ADR-005](./ADR-005-captura-manual-com-autocomplete.md)) é arquitetada desde a Fase 0 para acomodar a opção "Foto da nota" sem redesenho, mas a opção fica oculta até a Fase 3.

## Consequências
**Positivas:**
- MVP entregue sem dependência de OCR, câmera ou IA de normalização — pilhas tecnológicas críticas que podem atrasar semanas.
- A Fase 0 valida se o usuário realmente usa o app antes de investir em foto — reduz risco de construir funcionalidade cara para produto sem retenção.
- A arquitetura de tela extensível ([ADR-005](./ADR-005-captura-manual-com-autocomplete.md)) garante que Fase 3 não exige redesign.

**Negativas / trade-offs:**
- No período entre MVP e Fase 3, o atrito de registro permanece alto (~20 toques para 5 itens) — risco de abandono por usuários com muitos itens por Compra.
- Usuários que descobrem o app por resenhas que mencionam "foto da nota" (feature futura) podem se decepcionar ao não encontrá-la no MVP.
- Normalização de itens de NF-e é um problema difícil: "OLEO SOJA 900ML" pode virar "Óleo de Soja" ou "Azeite" dependendo do contexto — erros de normalização minam a confiança construída durante as Fases 0–2.

## Alternativas consideradas
- **Foto da nota no MVP sem OCR (usuário identifica os itens manualmente após a foto):** rejeitado porque se o usuário ainda precisa digitar os itens, a foto não reduz atrito — adiciona complexidade sem benefício real.
- **Integração com NF-e por QR Code (ao invés de foto):** considerado como alternativa mais confiável (dado estruturado), mas rejeitado para o MVP porque nem todos os mercados emitem NF-e por QR, e a integração com SEFAZ adiciona dependência de infraestrutura governamental.
- **Foto da nota na Fase 1 (antecipação):** rejeitado porque a Fase 1 tem prioridades mais impactantes para retenção (Modo Mercado, notificações, marcar da lista) — foto resolve atrito de registro, não retenção pós-primeira semana.

## Referências
- [docs/spec-produto.md](../spec-produto.md) — Compras: futuramente via nota fiscal; IA: interpretar notas
- [ADR-005](./ADR-005-captura-manual-com-autocomplete.md) — captura manual como alternativa do MVP
- [ADR-013](./ADR-013-aprendizado-por-proxies.md) — aprendizado funciona com dados manuais
- [ADR-017](./ADR-017-marcar-da-lista-na-fase-1.md) — terceira via de registro que reduz atrito antes da Fase 3
