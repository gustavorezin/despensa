import { describe, it, expect } from "vitest";
import { resolverCabecalho } from "@/modules/compra/domain/cabecalho";

// Data local fixa (11/07/2026, 15h) — independe do fuso da máquina de teste.
const hoje = new Date(2026, 6, 11, 15, 0, 0);

describe("resolverCabecalho", () => {
  it("dado uma entrada sem data, então a Compra é datada de hoje", () => {
    // Dado
    const entrada = {};

    // Quando
    const { data } = resolverCabecalho(entrada, hoje);

    // Então
    expect(data).toBe(hoje);
  });

  it("dado uma data retroativa, então é aceita ao meio-dia local (imune a fuso)", () => {
    // Dado
    const entrada = { data: "2026-07-01" };

    // Quando
    const { data } = resolverCabecalho(entrada, hoje);

    // Então
    expect(data.getFullYear()).toBe(2026);
    expect(data.getMonth()).toBe(6);
    expect(data.getDate()).toBe(1);
    expect(data.getHours()).toBe(12);
  });

  it("dado a data de hoje por extenso, então é aceita (fronteira do futuro)", () => {
    // Dado
    const entrada = { data: "2026-07-11" };

    // Quando
    const { data } = resolverCabecalho(entrada, hoje);

    // Então
    expect(data.getDate()).toBe(11);
  });

  it("dado uma data futura, então recusa (ADR-021)", () => {
    // Dado
    const entrada = { data: "2026-07-12" };

    // Quando / Então
    expect(() => resolverCabecalho(entrada, hoje)).toThrow(/futuro/);
  });

  it("dado descrição ausente ou vazia, então persiste null", () => {
    // Dado / Quando / Então
    expect(resolverCabecalho({}, hoje).descricao).toBeNull();
    expect(resolverCabecalho({ descricao: "" }, hoje).descricao).toBeNull();
  });

  it("dado descrição informada, então é preservada", () => {
    // Dado
    const entrada = { descricao: "Mercado Extra" };

    // Quando
    const { descricao } = resolverCabecalho(entrada, hoje);

    // Então
    expect(descricao).toBe("Mercado Extra");
  });
});
