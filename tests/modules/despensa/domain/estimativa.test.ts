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
const diasAtras = (n: number) => new Date(hoje.getTime() - n * 86_400_000);

function historico(over: Partial<HistoricoItem> = {}): HistoricoItem {
  return {
    numeroCompras: 1,
    ultimaCompraEm: diasAtras(2),
    ultimoAjuste: null,
    ...over,
  };
}

describe("diasDesde", () => {
  it("dado uma data no passado, então conta os dias de calendário decorridos", () => {
    // Dado
    const data = diasAtras(18);

    // Quando
    const dias = diasDesde(data, hoje);

    // Então
    expect(dias).toBe(18);
  });

  it("dado uma data no futuro, então nunca retorna negativo", () => {
    // Dado
    const data = diasAtras(-5);

    // Quando
    const dias = diasDesde(data, hoje);

    // Então
    expect(dias).toBe(0);
  });
});

describe("calcularConfianca + nivelConfianca", () => {
  it("dado uma compra há poucos dias, então a confiança é alta", () => {
    // Dado
    const h = historico({ numeroCompras: 1, ultimaCompraEm: diasAtras(1) });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("alta");
  });

  it("dado que a última compra envelhece, então a confiança cai para média", () => {
    // Dado
    const h = historico({ ultimaCompraEm: diasAtras(18) });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("media");
  });

  it("dado uma compra muito antiga, então a confiança é baixa", () => {
    // Dado
    const h = historico({ ultimaCompraEm: diasAtras(60) });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("baixa");
  });

  it("dado um item sem nenhuma compra, então a confiança é baixa", () => {
    // Dado
    const h = historico({ numeroCompras: 0, ultimaCompraEm: null });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("baixa");
  });

  it("dado muitas compras recentes, então a pontuação permanece dentro de 0..1", () => {
    // Dado
    const h = historico({ numeroCompras: 9, ultimaCompraEm: diasAtras(0) });

    // Quando
    const pontuacao = calcularConfianca(h, hoje);

    // Então
    expect(pontuacao).toBeGreaterThanOrEqual(0);
    expect(pontuacao).toBeLessThanOrEqual(1);
  });
});

describe("nivelConfianca — limiares do semáforo", () => {
  it("dado a pontuação exatamente em 0.66, então o nível é alto", () => {
    // Dado / Quando / Então (fronteira alta ↔ média)
    expect(nivelConfianca(0.66)).toBe("alta");
    expect(nivelConfianca(0.659)).toBe("media");
  });

  it("dado a pontuação exatamente em 0.4, então o nível é médio", () => {
    // Dado / Quando / Então (fronteira média ↔ baixa)
    expect(nivelConfianca(0.4)).toBe("media");
    expect(nivelConfianca(0.399)).toBe("baixa");
  });
});

describe("calcularConfianca — fronteiras de recência", () => {
  // numeroCompras = 1 isola a recência (bônus de histórico = 0).
  it("dado a última compra há 7 dias, então ainda é alta; no 8º dia, cai para média", () => {
    // Dado
    const noLimite = historico({ numeroCompras: 1, ultimaCompraEm: diasAtras(7) });
    const passouDoLimite = historico({
      numeroCompras: 1,
      ultimaCompraEm: diasAtras(8),
    });

    // Quando + Então
    expect(nivelConfianca(calcularConfianca(noLimite, hoje))).toBe("alta");
    expect(nivelConfianca(calcularConfianca(passouDoLimite, hoje))).toBe(
      "media",
    );
  });

  it("dado a última compra há 45 dias, então é média; no 46º dia, cai para baixa", () => {
    // Dado
    const noLimite = historico({
      numeroCompras: 1,
      ultimaCompraEm: diasAtras(45),
    });
    const passouDoLimite = historico({
      numeroCompras: 1,
      ultimaCompraEm: diasAtras(46),
    });

    // Quando + Então
    expect(nivelConfianca(calcularConfianca(noLimite, hoje))).toBe("media");
    expect(nivelConfianca(calcularConfianca(passouDoLimite, hoje))).toBe(
      "baixa",
    );
  });
});

describe("calcularConfianca — o ajuste manual mais recente domina", () => {
  it("dado 'Tem' após uma compra antiga, então a confiança é alta", () => {
    // Dado
    const h = historico({
      ultimaCompraEm: diasAtras(50),
      ultimoAjuste: { tipo: "TEM", em: diasAtras(1) },
    });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("alta");
  });

  it("dado 'Acabou' após uma compra recente, então a confiança é baixa", () => {
    // Dado
    const h = historico({
      ultimaCompraEm: diasAtras(1),
      ultimoAjuste: { tipo: "ACABOU", em: diasAtras(0) },
    });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("baixa");
  });

  it("dado um ajuste mais antigo que a última compra, então a compra prevalece", () => {
    // Dado: comprou depois de ter marcado 'Acabou' → a compra é o evento mais recente
    const h = historico({
      numeroCompras: 2,
      ultimaCompraEm: diasAtras(1),
      ultimoAjuste: { tipo: "ACABOU", em: diasAtras(10) },
    });

    // Quando
    const nivel = nivelConfianca(calcularConfianca(h, hoje));

    // Então
    expect(nivel).toBe("alta");
  });
});

describe("textoQuantidade", () => {
  it("dado quantidade zero, então mostra 'acabou'", () => {
    // Dado
    const entrada = { qtd: 0, unidade: "un", nivel: "baixa" as const };

    // Quando
    const texto = textoQuantidade(entrada);

    // Então
    expect(texto).toBe("acabou");
  });

  it("dado confiança alta, então mostra a quantidade aproximada com a unidade", () => {
    // Dado
    const entrada = { qtd: 2, unidade: "pacote", nivel: "alta" as const };

    // Quando
    const texto = textoQuantidade(entrada);

    // Então
    expect(texto).toBe("~2 pacote");
  });

  it("dado uma unidade ausente, então usa 'un' como padrão", () => {
    // Dado
    const entrada = { qtd: 1, unidade: null, nivel: "alta" as const };

    // Quando
    const texto = textoQuantidade(entrada);

    // Então
    expect(texto).toBe("~1 un");
  });

  it("dado incerteza, então esconde o número (média → 'aprox.', baixa → '?')", () => {
    // Dado / Quando / Então
    expect(textoQuantidade({ qtd: 3, unidade: "un", nivel: "media" })).toBe(
      "aprox.",
    );
    expect(textoQuantidade({ qtd: 3, unidade: "un", nivel: "baixa" })).toBe("?");
  });
});

describe("gerarExplicacao", () => {
  it("dado pouco histórico na primeira compra, então cita o histórico curto", () => {
    // Dado
    const h = historico({ numeroCompras: 1, ultimaCompraEm: diasAtras(18) });

    // Quando
    const texto = gerarExplicacao(h, hoje);

    // Então
    expect(texto).toContain("pouco histórico");
  });

  it("dado 'Acabou' como evento mais recente, então a explicação reflete o ajuste", () => {
    // Dado
    const h = historico({ ultimoAjuste: { tipo: "ACABOU", em: diasAtras(0) } });

    // Quando
    const texto = gerarExplicacao(h, hoje);

    // Então
    expect(texto).toContain("acabou");
  });

  it("dado um item recorrente, então cita o tempo desde a última compra", () => {
    // Dado
    const h = historico({ numeroCompras: 4, ultimaCompraEm: diasAtras(10) });

    // Quando
    const texto = gerarExplicacao(h, hoje);

    // Então
    expect(texto).toContain("10 dias");
  });
});
