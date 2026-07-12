---
name: testes-unitarios
description: Padrões para escrever testes unitários neste projeto (Vitest, domínio puro). Use ao criar ou editar arquivos *.test.ts, ao adicionar lógica de domínio testável, ou quando pedirem "testes unitários"/"cobrir com testes".
---

# Testes unitários — padrões do projeto Despensa

Guia de como escrever testes unitários aqui. Segue as convenções do repositório
(`CLAUDE.md`, ADR-011) e a arquitetura em camadas (`docs/spec-tecnica.md §2`).

## O que testar (e o que não)

- **Teste apenas o domínio puro**: funções sem I/O em `src/modules/*/domain/`
  (cálculos, regras, transformações). É onde vive a lógica que merece testes rápidos e determinísticos.
- **NÃO teste** aqui camadas com efeito colateral: `repository/` (Prisma), `services/`
  (orquestração + banco), Server Actions, componentes React. Elas se validam por
  verificação de ponta a ponta / integração, não por unit test.
- Se uma regra importante está presa dentro de um service, **extraia-a para `domain/`**
  como função pura e teste-a lá — não monte mocks de Prisma para alcançá-la.

## Estrutura e localização

- Framework: **Vitest** (`npm run test` executa; `npm run test:watch` observa).
- Arquivos em **`tests/`** na raiz, **espelhando o caminho de `src/`**:
  `src/modules/despensa/domain/estimativa.ts` → `tests/modules/despensa/domain/estimativa.test.ts`.
- Importe pelo alias `@/` (ex.: `import { calcularConfianca } from "@/modules/despensa/domain/estimativa"`).

## Convenções de escrita

- **Português** nos `describe`/`it` e nas variáveis (ADR-011). `describe` nomeia a unidade
  (a função/regra); `it` descreve o **comportamento observável**, não a implementação.
  - Bom: `it("marca confiança baixa quando a última compra é antiga", ...)`
  - Evite: `it("retorna 0.3", ...)`
- **Um comportamento por teste.** Prefira vários testes pequenos a um teste com muitos asserts.
- **Preparar → Agir → Verificar** (AAA), separados por linha em branco:

  ```ts
  it("eleva a confiança quando o usuário confirma 'Tem'", () => {
    // Preparar
    const historico = { numeroCompras: 1, ultimaCompraEm: dias(hoje, -40), ultimoAjuste: "TEM" };

    // Agir
    const pontuacao = calcularConfianca(historico, hoje);

    // Verificar
    expect(nivelConfianca(pontuacao)).toBe("alta");
  });
  ```

- **Cubra as bordas**, não só o caminho feliz: limiares (o valor exato onde 🟡 vira 🟢),
  entradas vazias/nulas, extremos (0, negativos se possível, datas muito antigas).

## Determinismo (obrigatório)

- O domínio **não** pode ler o relógio nem gerar aleatório: nada de `Date.now()`,
  `new Date()` sem argumento, `Math.random()`. O "agora" é **injetado como parâmetro**
  (ex.: `calcularConfianca(historico, hoje)`), então o teste controla o tempo.
- Fixe um `const hoje = new Date("2026-07-11T12:00:00Z")` no teste e derive as demais datas dele.
- Sem dependência de fuso/locale nos asserts; se a função formata data/locale, teste o
  contrato observável, não a string exata dependente de ambiente.

## Checklist antes de concluir

- [ ] Testes no lugar certo (`tests/` espelhando `src/`), nomes em português.
- [ ] Cada limiar/branch da função tem ao menos um teste.
- [ ] Nenhum acesso a relógio/rede/banco dentro do que é testado.
- [ ] `npm run test` verde.
