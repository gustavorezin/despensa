# Design Specification

**Versão:** v0.1.0 — 2026-06-28

---

## 1. Objetivo

O aplicativo é um assistente inteligente de abastecimento doméstico — não um sistema de controle de estoque. A experiência deve transmitir a sensação de "alguém me ajudando a lembrar o que preciso comprar", não de "preciso alimentar um sistema para ele funcionar".

O design reforça esse posicionamento em cada tela: o app fala primeiro, propõe antes de pedir, e nunca impõe esforço desnecessário. O usuário decide; o assistente facilita.

---

## 2. Personalidade

- **Simples.** Cada tela tem um propósito. O que não contribui para esse propósito não está lá.
- **Moderna.** Padrões consolidados de mobile (Material Design, iOS HIG) como piso, não teto. O visual não envelhece rápido.
- **Organizada.** Informações têm hierarquia. O mais importante aparece primeiro, sem que o usuário precise procurar.
- **Confiável.** O app é honesto sobre o que sabe e o que não sabe. Estimativas incertas são sinalizadas, não escondidas.
- **Inteligente.** A IA é visível mas não invasiva. O usuário percebe que o app aprende, mas nunca sente que está sendo vigiado.

---

## 3. Diretrizes de UX

- Qualquer ação frequente deve ser executável em 2 toques ou menos.
- Fluxos curtos: nenhum fluxo principal ultrapassa 3 telas.
- Pouca digitação: autocomplete agressivo a partir do 2º caractere para Itens conhecidos; opções rápidas substituem campos numéricos onde possível.
- Interface limpa: sem informações decorativas. Cada elemento presente tem função.
- Informações por prioridade: o mais relevante para a decisão atual aparece primeiro. Detalhes ficam sob demanda.
- Estados vazios sempre com CTA: nenhuma tela pode estar branca ou com mensagem sem ação. (ver [ADR-012](./adr/ADR-012-estado-vazio-com-cta.md))
- Transparência sem ansiedade: incerteza é comunicada com semáforo visual, não com percentuais ou alarmes.

---

## 4. Mobile first

A experiência principal é mobile. O usuário usa o app na cozinha, em pé, com uma mão — às vezes com as mãos sujas ou o carrinho do mercado na outra. Desktop não é prioridade no roadmap previsível. Toda decisão de layout, tamanho de alvo de toque e densidade de informação parte do contexto mobile.

---

## 5. Navegação

### 5.1 Estrutura física [ADR-001]

Bottom tab bar com 4 abas mais FAB central persistente. Sem hamburger menu, sem breadcrumbs, sem drawer lateral.

Abas: **Lista** (home) | **Despensa** | [FAB "Registrar Compra"] | **Compras** | **Conta**

O FAB é persistente em todas as telas — registrar uma Compra deve estar a 1 toque independente de onde o usuário está. (ver [ADR-001](./adr/ADR-001-bottom-tab-mais-fab-central.md))

### 5.2 Padrões de transição por contexto

- **Push com back swipe** para telas de detalhe (detalhe de Item, detalhe de Compra).
- **Bottom sheet** para ações rápidas: ajustar Despensa, ver explicação de Sugestão.
- **Fullscreen modal** para Modo Mercado [F1] — sem bottom bar, sem FAB, contexto totalmente diferente. (ver [ADR-015](./adr/ADR-015-modo-mercado-na-fase-1.md))
- **Stack linear** para onboarding — sem tab bar, sem atalhos para outras áreas. (ver [ADR-009](./adr/ADR-009-onboarding-3-telas.md))

### 5.3 Hierarquia de telas [ADR-002]

Lista é a home. O app "fala primeiro": ao abrir, o usuário vê o que provavelmente precisa comprar — não um painel de métricas, não a Despensa, não um resumo genérico. Quem quer checar a Despensa acessa via aba com 1 toque extra; isso é consciente. (ver [ADR-002](./adr/ADR-002-home-eh-a-lista.md))

---

## 6. Telas principais

### 6.1 Lista (home) [ADR-002, ADR-003, ADR-006]

Tela inicial do app. Unifica Sugestões da IA e Itens adicionados manualmente em uma única superfície — o usuário não vê dois sistemas. (ver [ADR-003](./adr/ADR-003-lista-absorve-recomendacoes.md))

Os Itens são agrupados pelo motivo da Sugestão, em linguagem natural: "Provavelmente acabando", "Recorrentes", "Você adicionou". O grupo informa o porquê antes de o usuário precisar perguntar. Sugestões da IA carregam badge 🤖; Itens adicionados manualmente carregam badge ✋. (ver [ADR-006](./adr/ADR-006-sugestoes-agrupadas-por-motivo.md))

Botão "Adicionar item" sempre visível. [F1] Botão "Modo Mercado" entra na Fase 1.

Estado vazio no Dia 1: frase contextual + CTA para registrar a primeira Compra. (ver [ADR-012](./adr/ADR-012-estado-vazio-com-cta.md))

### 6.2 Despensa [ADR-004, ADR-007]

Itens agrupados por categoria. Cada Item exibe quantidade estimada e badge de confiança: 🟢 (confiança alta), 🟡 (confiança média), 🔴 (confiança baixa). Nenhum percentual aparece na interface. (ver [ADR-004](./adr/ADR-004-confianca-como-semaforo.md))

Toque em qualquer Item abre o bottom sheet de ajuste rápido. Tap longo ou ícone ⓘ abre explicação textual do estado da estimativa. (ver [ADR-007](./adr/ADR-007-ajuste-de-despensa-3-opcoes.md))

Estado vazio: frase explicando que a Despensa se preenche a partir de Compras registradas + CTA para registrar a primeira Compra.

### 6.3 Compras (histórico + registrar) [ADR-005, ADR-014, ADR-017]

Histórico cronológico de Compras registradas. Cada entrada mostra data e resumo de Itens. FAB "Registrar Compra" sempre visível via estrutura global.

Ao tocar no FAB, a tela "Como quer registrar?" apresenta as vias disponíveis por fase:

- **F0:** "Manual" (autocomplete agressivo, chips com qty editável). (ver [ADR-005](./adr/ADR-005-captura-manual-com-autocomplete.md))
- **[F1]** Acrescenta "Marcar da lista" quando a Lista tem ao menos 1 Item. (ver [ADR-017](./adr/ADR-017-marcar-da-lista-na-fase-1.md))
- **[F3]** Acrescenta "Foto da nota". (ver [ADR-014](./adr/ADR-014-foto-da-nota-na-fase-3.md))

Estado vazio: frase + CTA para registrar a primeira Compra.

### 6.4 Conta

Perfil do usuário, dados da Casa (nome coletado no onboarding). Link para preferências de Notificações [F1] e Moradores [F5]. Opção de sair. (ver [ADR-009](./adr/ADR-009-onboarding-3-telas.md), [ADR-010](./adr/ADR-010-multi-morador-fora-do-mvp.md))

### 6.5 Modo Mercado [F1, ADR-015]

Fullscreen modal sem tab bar e sem FAB. Ativado por botão explícito na Lista.

Dentro do Modo Mercado, os Itens são reorganizados por categoria de produto — refletindo a lógica de prateleiras, não o motivo da Sugestão. Cada Item tem check de área grande para facilitar o toque com polegar em movimento. Progresso da lista visível (ex.: "6 de 12 marcados").

Ao finalizar, CTA "Registrar Compra" é pré-preenchido com os Itens marcados, integrando com o fluxo "Marcar da lista" da Fase 1. (ver [ADR-015](./adr/ADR-015-modo-mercado-na-fase-1.md), [ADR-017](./adr/ADR-017-marcar-da-lista-na-fase-1.md))

---

## 7. Padrões transversais

### 7.1 Sugestão da IA [ADR-006, ADR-008]

Toda Sugestão carrega badge 🤖 e microcópia curta que explica o motivo em uma linha ("compra a cada ~3 semanas" ou "estimativa indica pouco"). Três ações sempre disponíveis: aceitar, editar quantidade, dispensar. Toque no Item ou no ícone ⓘ abre bottom sheet com explicação completa. A explicação nunca bloqueia a ação — aceitar/dispensar é acessível dentro do próprio drawer. (ver [ADR-008](./adr/ADR-008-explicacao-em-tap-to-expand.md))

[F1] Swipe para dispensar uma Sugestão diretamente na Lista, sem abrir o drawer.

### 7.2 Confiança visual da estimativa [ADR-004]

Semáforo 🟢/🟡/🔴 ao lado de cada Item na Despensa. Texto qualitativo complementa: "~1 un", "aprox.", "?". Nunca percentagem na UI. Tap longo ou ícone ⓘ abre explicação textual ("Última Compra há 45 dias — estimativa com pouco histórico"). (ver [ADR-004](./adr/ADR-004-confianca-como-semaforo.md))

### 7.3 Estado vazio [ADR-012]

Toda tela com lista vazia tem: uma frase contextual explicando por que está vazia e um CTA principal visível orientado ao próximo passo de maior valor. Nunca tela branca, nunca mensagem sem ação. (ver [ADR-012](./adr/ADR-012-estado-vazio-com-cta.md))

### 7.4 Ajuste rápido de Despensa [ADR-007]

Bottom sheet com 3 opções predefinidas:

- **Tem** — confirma a estimativa atual; eleva a confiança do Item.
- **Pouco** — reduz a quantidade estimada; move o Item para a Lista.
- **Acabou** — zera o estoque; promove o Item ao topo da Lista.

"Ajuste preciso" é progressive disclosure: disponível dentro do mesmo bottom sheet, abre seletor numérico para quem precisa de granularidade. A interação padrão é 2 toques (Item → opção). (ver [ADR-007](./adr/ADR-007-ajuste-de-despensa-3-opcoes.md))

### 7.5 Explicações da IA [ADR-008]

Linguagem natural, doméstica: "você compra a cada ~3 semanas" em vez de "frequência de compra: 21 dias". Acessíveis em 1 toque, via bottom sheet. Nunca bloqueiam a interface nem interrompem o fluxo de varredura da Lista. O drawer sempre expõe as ações (aceitar, dispensar) junto com a explicação. (ver [ADR-008](./adr/ADR-008-explicacao-em-tap-to-expand.md))

### 7.6 Notificações [F1, ADR-016]

Máximo 1 notificação push por dia por Casa. Conteúdo contextual que entrega valor no próprio banner (ex.: "Sua lista parece pronta — 8 sugestões te esperando."). Deep-link direto para a Lista; o usuário chega à ação com 1 toque. Tom não-acusatório: o silêncio da notificação é informativo — se não chegou notificação, não há nada urgente. Configurável em Conta. (ver [ADR-016](./adr/ADR-016-notificacoes-1-por-dia.md))

### 7.7 Captura por foto da nota [F3, ADR-014]

Fluxo: foto → IA processa → tela de revisão com Itens agrupados em "Identificados" (aceitos por padrão) e "Precisam confirmar" (em destaque âmbar no topo). O usuário revisa e confirma antes de qualquer dado ser gravado. Itens reconhecidos não exigem ação extra; pendências exigem atenção explícita. (ver [ADR-014](./adr/ADR-014-foto-da-nota-na-fase-3.md))

### 7.8 Offline [F4, ADR-018]

Banner discreto no topo quando sem conexão — sem alarme, sem bloqueio. Registrar Compra manual e ajustar Despensa funcionam offline; as ações são enfileiradas e sincronizadas automaticamente quando a conexão é restaurada. [F3] Foto da nota fica em fila offline. Conflitos de sincronização são resolvidos por "último a sincronizar vence" com log visível. (ver [ADR-018](./adr/ADR-018-offline-na-fase-4.md))

---

## 8. Comunicação e linguagem

- Linguagem simples, doméstica, sem termos técnicos. O usuário não vê "inventário", "normalização" ou percentuais de confiança. (ver [ADR-011](./adr/ADR-011-vocabulario-canonico.md))
- Toda Sugestão explica o motivo em uma linha — antes de o usuário precisar perguntar.
- Mensagens da IA são não-acusatórias. Exemplo: "Provavelmente acabou: arroz. Já comprou?" em vez de "Você esqueceu de registrar o arroz".
- CTAs são orientados a ação, não a confirmação: "Registrar Compra", "Ajustar Despensa", "Adicionar à Lista".
- Estados vazios usam a primeira pessoa do app ("Ainda estou aprendendo seus hábitos") — reforça o posicionamento de assistente.
- Toda microcópia em português brasileiro.

---

## 9. Fluxos prioritários

| Fluxo | Fase | ADRs |
|---|---|---|
| Registrar Compra manual | F0 | 005, 013 |
| Ajustar Despensa | F0 | 007 |
| Modo Mercado | F1 | 015, 017 |
| Registrar por foto da nota | F3 | 014 |

**Registrar Compra manual** é o fluxo fundacional: sem ele não há dados, sem dados não há aprendizado, sem aprendizado não há Sugestões. O design o privilegia em visibilidade (FAB persistente) e velocidade (autocomplete a partir do 2º caractere).

**Ajustar Despensa** é o fluxo de recalibração: o usuário percebeu que o app não sabe o que está na prateleira e corrige isso em 2 toques. Essa ação alimenta tanto a confiança do semáforo quanto o aprendizado por proxies.

**Modo Mercado** é o fluxo de execução no supermercado: transforma a Lista planejada em um checklist por corredor, com checks grandes e sem distrações de interface. Ao sair, o registro da Compra vem pré-preenchido.

**Registrar por foto da nota** é o fluxo de captura de alta velocidade: elimina a maior parte da digitação para Compras grandes, com revisão obrigatória para garantir dados corretos antes de confirmar.

---

## 10. Faseamento da experiência [ADR-019]

Cada fase entrega valor sozinha — o usuário da Fase 0 tem um produto completo, não um produto incompleto esperando a Fase 1. Recursos novos entram dentro das 4 áreas existentes (Lista, Despensa, Compras, Conta); nenhuma fase nova cria abas novas. (ver [ADR-019](./adr/ADR-019-faseamento.md))

| Recurso de design | Fase de entrada |
|---|---|
| Bottom tab + FAB central | F0 |
| Lista com grupos por motivo | F0 |
| Semáforo de confiança na Despensa | F0 |
| Ajuste rápido (Tem / Pouco / Acabou) | F0 |
| Explicações em tap-to-expand | F0 |
| Estados vazios com CTA | F0 |
| Onboarding 3 telas | F0 |
| Botão "Modo Mercado" na Lista | F1 |
| Modo Mercado (fullscreen modal) | F1 |
| "Marcar da lista" no fluxo de registro | F1 |
| Notificações push (máx. 1/dia) | F1 |
| Swipe para dispensar Sugestão | F1 |
| "Foto da nota" no fluxo de registro | F3 |
| Tela de revisão de Itens da nota | F3 |
| Offline para registro e ajuste | F4 |
| Banner de conectividade | F4 |
| Moradores em Conta (convite) | F5 |

---

## 11. Liberdade criativa

Este documento define o contrato de UX — padrões de navegação, comportamento de telas, linguagem e padrões transversais. O agente de design tem liberdade para definir cores, tipografia, espaçamento, sistema de ícones, elevação, animações e componentes específicos, desde que os princípios acima sejam respeitados.

Mudanças que alterem decisões já tomadas (estrutura de navegação, padrão de bottom sheet, agrupamento por motivo, semáforo de confiança, etc.) exigem novo ADR ou a supersedência do ADR existente. Nenhuma alteração de princípio acontece só no design — ela precisa ser documentada. (ver [ADR-020](./adr/ADR-020-adocao-de-adrs.md))

---

## 12. Decisões de design e rastreabilidade

| Decisão de design | ADR |
|---|---|
| Bottom tab bar com 4 abas + FAB central persistente | [ADR-001](./adr/ADR-001-bottom-tab-mais-fab-central.md) |
| Lista é a home; app abre sempre na Lista | [ADR-002](./adr/ADR-002-home-eh-a-lista.md) |
| Sugestões e Itens manuais na mesma superfície (Lista unificada) | [ADR-003](./adr/ADR-003-lista-absorve-recomendacoes.md) |
| Confiança da estimativa como semáforo 🟢/🟡/🔴, sem percentual | [ADR-004](./adr/ADR-004-confianca-como-semaforo.md) |
| Autocomplete agressivo a partir do 2º caractere no registro manual | [ADR-005](./adr/ADR-005-captura-manual-com-autocomplete.md) |
| Grupos na Lista por motivo da Sugestão (não por categoria) | [ADR-006](./adr/ADR-006-sugestoes-agrupadas-por-motivo.md) |
| Bottom sheet de ajuste com Tem / Pouco / Acabou + Ajuste preciso | [ADR-007](./adr/ADR-007-ajuste-de-despensa-3-opcoes.md) |
| Explicações da IA em tap-to-expand (bottom sheet, nunca inline) | [ADR-008](./adr/ADR-008-explicacao-em-tap-to-expand.md) |
| Onboarding em 3 telas; "pular" é opção legítima de primeiro nível | [ADR-009](./adr/ADR-009-onboarding-3-telas.md) |
| Moradores em Conta só na F5; Casa como container desde F0 | [ADR-010](./adr/ADR-010-multi-morador-fora-do-mvp.md) |
| Vocabulário canônico: Lista, Despensa, Item, Compra, Casa, Sugestão | [ADR-011](./adr/ADR-011-vocabulario-canonico.md) |
| Todo estado vazio tem frase contextual + CTA visível | [ADR-012](./adr/ADR-012-estado-vazio-com-cta.md) |
| Aprendizado por proxies implícitos; sem registro de consumo obrigatório | [ADR-013](./adr/ADR-013-aprendizado-por-proxies.md) |
| "Foto da nota" entra no fluxo de registro na F3 | [ADR-014](./adr/ADR-014-foto-da-nota-na-fase-3.md) |
| Modo Mercado: fullscreen modal, agrupamento por categoria, F1 | [ADR-015](./adr/ADR-015-modo-mercado-na-fase-1.md) |
| Notificações push: máx. 1/dia, deep-link para Lista, F1 | [ADR-016](./adr/ADR-016-notificacoes-1-por-dia.md) |
| "Marcar da lista" como 2ª via de registro na F1 | [ADR-017](./adr/ADR-017-marcar-da-lista-na-fase-1.md) |
| Offline para registro e ajuste, com fila de sync, F4 | [ADR-018](./adr/ADR-018-offline-na-fase-4.md) |
| Cada fase entrega valor sozinha; recursos novos entram nas 4 abas existentes | [ADR-019](./adr/ADR-019-faseamento.md) |
| Toda decisão de UX não-trivial documentada como ADR imutável | [ADR-020](./adr/ADR-020-adocao-de-adrs.md) |
