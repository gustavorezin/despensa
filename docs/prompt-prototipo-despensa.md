# Prompt — Protótipo do app Despensa

> Copie tudo abaixo desta linha e envie para o agente de design.

---

Você é um designer de produto sênior. Seu trabalho é criar o **protótipo de alta fidelidade** do app mobile **Despensa** — um assistente inteligente de abastecimento doméstico.

---

## Contexto do produto

O Despensa **não é um sistema de estoque**. É um assistente que ajuda o usuário a lembrar o que precisa comprar. A sensação deve ser "alguém me ajudando", não "preciso alimentar um sistema".

O app fala primeiro, propõe antes de pedir, e nunca impõe esforço desnecessário. O usuário decide; o assistente facilita.

---

## Personalidade visual

- **Simples** — cada tela tem um propósito. O que não contribui não está lá.
- **Moderna** — Material Design e iOS HIG como piso, não teto. Visual que não envelhece rápido.
- **Organizada** — hierarquia clara. O mais importante aparece primeiro.
- **Confiável** — honesta sobre o que sabe e o que não sabe. Incerteza é sinalizada, não escondida.
- **Inteligente** — a IA é visível mas não invasiva.

Você tem **liberdade criativa total** para definir: paleta de cores, tipografia, sistema de ícones, espaçamento, elevação, animações e componentes. O único requisito é respeitar os padrões de UX descritos abaixo.

---

## Contexto de uso

Mobile first, obrigatório. O usuário usa o app **na cozinha, em pé, com uma mão** — às vezes com as mãos sujas ou o carrinho do mercado na outra. Desktop é fora do escopo.

Toda decisão de layout, tamanho de alvo de toque e densidade de informação parte desse contexto.

---

## Navegação global

**Bottom tab bar com 4 abas + FAB central persistente.** Sem hamburger menu, sem drawer lateral, sem breadcrumbs.

```
[ Lista ] [ Despensa ] [ ● FAB ] [ Compras ] [ Conta ]
```

- O FAB ("Registrar Compra") é **persistente em todas as telas** — registrar uma compra deve estar a 1 toque independente de onde o usuário está.
- O FAB é central, elevado acima da tab bar.
- **Lista** é a home. O app abre sempre na Lista.

---

## Telas a prototipar (Fase 0 — MVP)

Prototipe todas as telas abaixo em estado **preenchido** (com dados reais de exemplo) **e** no estado **vazio** (com frase contextual + CTA visível — nunca tela branca).

### 1. Lista (home)

- Tela inicial. O app "fala primeiro": o usuário vê o que provavelmente precisa comprar.
- Itens unificados em uma única superfície: sugestões da IA e itens adicionados manualmente aparecem juntos — o usuário **não vê dois sistemas separados**.
- Itens agrupados por **motivo da sugestão** em linguagem natural:
  - "Provavelmente acabando"
  - "Recorrentes"
  - "Você adicionou"
- Sugestões da IA carregam badge **🤖**; itens adicionados manualmente carregam badge **✋**.
- Cada sugestão da IA tem microcópia de 1 linha explicando o motivo: ex.: "compra a cada ~3 semanas" ou "estimativa indica pouco".
- Três ações por item: **aceitar**, **editar quantidade**, **dispensar**.
- Botão "Adicionar item" sempre visível.
- Toque no item ou no ícone ⓘ abre **bottom sheet** com explicação completa (nunca bloqueia o fluxo; aceitar/dispensar acessível dentro do próprio drawer).
- **Estado vazio (Dia 1):** frase contextual explicando que o app ainda está aprendendo + CTA para registrar a primeira Compra.

### 2. Despensa

- Itens agrupados por **categoria** (ex.: "Laticínios", "Grãos e cereais", "Limpeza").
- Cada item exibe quantidade estimada e badge de confiança **semáforo**:
  - 🟢 confiança alta
  - 🟡 confiança média
  - 🔴 confiança baixa
  - Texto qualitativo complementar: "~1 un", "aprox.", "?"
  - **Nunca percentual na UI.**
- Toque em qualquer item abre **bottom sheet de ajuste rápido** com 3 opções:
  - **Tem** — confirma a estimativa; eleva a confiança.
  - **Pouco** — reduz a quantidade; move o item para a Lista.
  - **Acabou** — zera o estoque; promove o item ao topo da Lista.
  - "Ajuste preciso" em progressive disclosure dentro do mesmo bottom sheet (seletor numérico).
  - A interação padrão é 2 toques: item → opção.
- Tap longo ou ícone ⓘ abre explicação textual da estimativa: ex.: "Última compra há 45 dias — estimativa com pouco histórico".
- **Estado vazio:** frase explicando que a Despensa se preenche a partir de Compras registradas + CTA para registrar a primeira Compra.

### 3. Compras (histórico)

- Histórico cronológico de compras registradas.
- Cada entrada mostra data e resumo de itens (ex.: "12 itens — Supermercado Extra").
- FAB "Registrar Compra" sempre visível via estrutura global.
- Ao tocar no FAB, tela **"Como quer registrar?"** com a via disponível na Fase 0:
  - **Manual** — autocomplete agressivo a partir do 2º caractere + chips com quantidade editável.
- **Estado vazio:** frase + CTA para registrar a primeira Compra.

### 4. Fluxo de registro manual (modal/stack)

Ativado pelo FAB. Tela de entrada de itens com:
- Campo de busca com autocomplete a partir do 2º caractere.
- Chips de itens adicionados com quantidade editável inline.
- CTA de confirmação.

### 5. Conta

- Perfil do usuário e dados da Casa (nome).
- Links para configurações futuras (Notificações, Moradores) visíveis mas desabilitados/marcados como "Em breve".
- Opção de sair.

### 6. Onboarding (3 telas, stack linear)

Sem tab bar, sem atalhos para outras áreas. "Pular" é opção de primeiro nível (não escondida).

- **Tela 1:** Boas-vindas. Nome do app + proposta de valor em 1 frase. Botão "Começar" e link "Pular".
- **Tela 2:** Nome da casa. Campo de texto simples ("Como se chama sua casa?"). Ex.: "Ap. 42", "Casa da família". Botão "Continuar".
- **Tela 3:** Primeira compra. Explica que o app aprende a partir das compras registradas. CTA para registrar a primeira compra agora ou fazer isso depois.

---

## Vocabulário canônico (use exatamente estes termos na UI)

| Termo correto | Termos proibidos |
|---|---|
| Lista | lista de compras, to-do, fila |
| Despensa | estoque, inventário, armário |
| Item | produto, artigo |
| Compra | pedido, nota, transação |
| Casa | família, grupo, conta |
| Sugestão | recomendação, alerta, aviso |

---

## Linguagem e microcópia

- Linguagem simples, doméstica, sem termos técnicos.
- Mensagens da IA são não-acusatórias. Ex.: "Provavelmente acabou: arroz. Já comprou?" em vez de "Você esqueceu de registrar o arroz".
- CTAs orientados a ação: "Registrar Compra", "Ajustar Despensa", "Adicionar à Lista".
- Estados vazios em primeira pessoa do app: "Ainda estou aprendendo seus hábitos."
- Toda microcópia em **português brasileiro**.

---

## Regras de interação

- Qualquer ação frequente em **2 toques ou menos**.
- Nenhum fluxo principal ultrapassa **3 telas**.
- Pouca digitação: autocomplete agressivo, opções rápidas substituem campos numéricos onde possível.
- Nenhuma tela pode estar branca ou com mensagem sem ação (estados vazios sempre com CTA).
- Incerteza comunicada com semáforo visual — nunca percentuais ou alarmes.

---

## Transições

| Contexto | Padrão |
|---|---|
| Telas de detalhe (item, compra) | Push com back swipe |
| Ações rápidas (ajuste despensa, explicação de sugestão) | Bottom sheet |
| Onboarding | Stack linear (sem tab bar) |

---

## Entregável esperado

Protótipo navegável de alta fidelidade cobrindo:

1. Todas as 5 telas principais (Lista, Despensa, Compras, Conta + fluxo de registro)
2. Onboarding completo (3 telas)
3. Estados preenchidos e estados vazios de cada tela
4. Bottom sheets: ajuste de despensa, explicação de sugestão da IA
5. Fluxo de registro manual (autocomplete + chips)
6. Navegação funcional entre todas as telas

O protótipo deve ser navegável — qualquer revisor deve conseguir percorrer os fluxos principais sem instruções adicionais.
