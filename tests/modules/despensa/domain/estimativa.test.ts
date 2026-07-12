import { describe, it, expect } from "vitest";
import {
  calcularConfianca,
  nivelConfianca,
  textoQuantidade,
  gerarExplicacao,
  diasDesde,
  type HistoricoItem,
} from "@/modules/despensa/domain/estimativa";

const hoje = new Date("2026-07-11T12:00:00Z");
const diasAtras = (n: number) =>
  new Date(hoje.getTime() - n * 86_400_000);

function historico(over: Partial<HistoricoItem> = {}): HistoricoItem {
  return {
    numeroCompras: 1,
    ultimaCompraEm: diasAtras(2),
    ultimoAjuste: null,
    ...over,
  };
}

describe("diasDesde", () => {
  it("conta os dias de calendário decorridos", () => {
    expect(diasDesde(diasAtras(18), hoje)).toBe(18);
  });

  it("nunca é negativo para datas no futuro", () => {
    expect(diasDesde(diasAtras(-5), hoje)).toBe(0);
  });
});

describe("calcularConfianca + nivelConfianca", () => {
  it("dá confiança alta a um Item comprado há poucos dias", () => {
    // Preparar
    const h = historico({ numeroCompras: 1, ultimaCompraEm: diasAtras(1) });

    // Agir
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Verificar
    expect(nivel).toBe("alta");
  });

  it("cai para média conforme a última compra envelhece", () => {
    const h = historico({ ultimaCompraEm: diasAtras(18) });
    expect(nivelConfianca(calcularConfianca(h, hoje))).toBe("media");
  });

  it("dá confiança baixa quando a última compra é muito antiga", () => {
    const h = historico({ ultimaCompraEm: diasAtras(60) });
    expect(nivelConfianca(calcularConfianca(h, hoje))).toBe("baixa");
  });

  it("trata Item sem nenhuma Compra como baixa confiança", () => {
    const h = historico({ numeroCompras: 0, ultimaCompraEm: null });
    expect(nivelConfianca(calcularConfianca(h, hoje))).toBe("baixa");
  });

  it("mantém a pontuação dentro de 0..1", () => {
    const h = historico({ numeroCompras: 9, ultimaCompraEm: diasAtras(0) });
    const p = calcularConfianca(h, hoje);
    expect(p).toBeGreaterThanOrEqual(0);
    expect(p).toBeLessThanOrEqual(1);
  });
});

describe("calcularConfianca — ajuste manual domina", () => {
  it("'Tem' eleva a confiança mesmo com compra antiga", () => {
    const h = historico({
      ultimaCompraEm: diasAtras(50),
      ultimoAjuste: { tipo: "TEM", em: diasAtras(1) },
    });
    expect(nivelConfianca(calcularConfianca(h, hoje))).toBe("alta");
  });

  it("'Acabou' derruba a confiança mesmo com compra recente", () => {
    const h = historico({
      ultimaCompraEm: diasAtras(1),
      ultimoAjuste: { tipo: "ACABOU", em: diasAtras(0) },
    });
    expect(nivelConfianca(calcularConfianca(h, hoje))).toBe("baixa");
  });

  it("ignora um ajuste mais antigo que a última Compra", () => {
    // Preparar: comprou depois de ter marcado 'Acabou' → a compra manda
    const h = historico({
      numeroCompras: 2,
      ultimaCompraEm: diasAtras(1),
      ultimoAjuste: { tipo: "ACABOU", em: diasAtras(10) },
    });

    // Agir + Verificar
    expect(nivelConfianca(calcularConfianca(h, hoje))).toBe("alta");
  });
});

describe("textoQuantidade", () => {
  it("mostra 'acabou' quando a quantidade é zero", () => {
    expect(textoQuantidade({ qtd: 0, unidade: "un", nivel: "baixa" })).toBe(
      "acabou",
    );
  });

  it("mostra a quantidade aproximada quando a confiança é alta", () => {
    expect(textoQuantidade({ qtd: 2, unidade: "pacote", nivel: "alta" })).toBe(
      "~2 pacote",
    );
  });

  it("usa 'un' como unidade padrão", () => {
    expect(textoQuantidade({ qtd: 1, unidade: null, nivel: "alta" })).toBe(
      "~1 un",
    );
  });

  it("esconde o número sob incerteza (média → 'aprox.', baixa → '?')", () => {
    expect(textoQuantidade({ qtd: 3, unidade: "un", nivel: "media" })).toBe(
      "aprox.",
    );
    expect(textoQuantidade({ qtd: 3, unidade: "un", nivel: "baixa" })).toBe("?");
  });
});

describe("gerarExplicacao", () => {
  it("explica pouco histórico na primeira Compra", () => {
    const h = historico({ numeroCompras: 1, ultimaCompraEm: diasAtras(18) });
    expect(gerarExplicacao(h, hoje)).toContain("pouco histórico");
  });

  it("reflete o ajuste 'Acabou' quando é o evento mais recente", () => {
    const h = historico({
      ultimoAjuste: { tipo: "ACABOU", em: diasAtras(0) },
    });
    expect(gerarExplicacao(h, hoje)).toContain("acabou");
  });

  it("cita o tempo desde a última compra para Item recorrente", () => {
    const h = historico({ numeroCompras: 4, ultimaCompraEm: diasAtras(10) });
    expect(gerarExplicacao(h, hoje)).toContain("10 dias");
  });
});
