import { describe, it, expect } from "vitest";
import {
  CATEGORIAS,
  SEM_CATEGORIA,
  pesoCategoria,
} from "@/modules/item/domain/categorias";

describe("pesoCategoria", () => {
  it("dado categorias conhecidas, então ordenam pela posição da lista", () => {
    // Dado
    const primeira = CATEGORIAS[0];
    const ultima = CATEGORIAS[CATEGORIAS.length - 1];

    // Quando / Então
    expect(pesoCategoria(primeira)).toBeLessThan(pesoCategoria(ultima));
  });

  it("dado uma categoria desconhecida, então vem depois das conhecidas", () => {
    // Dado
    const desconhecida = "Utilidades";

    // Quando
    const peso = pesoCategoria(desconhecida);

    // Então
    for (const categoria of CATEGORIAS) {
      expect(peso).toBeGreaterThan(pesoCategoria(categoria));
    }
  });

  it("dado 'Sem categoria', então fica sempre por último", () => {
    // Dado
    const desconhecida = "Utilidades";

    // Quando
    const pesoSemCategoria = pesoCategoria(SEM_CATEGORIA);

    // Então
    expect(pesoSemCategoria).toBeGreaterThan(pesoCategoria(desconhecida));
  });
});
