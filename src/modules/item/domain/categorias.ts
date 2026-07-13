/*
  Categorias de Item — lista fixa do domínio (ADR-022). Fixa (e não texto livre)
  para o agrupamento da Despensa e do Modo Mercado não fragmentar em variações
  de grafia. A ordem da lista é a ordem de exibição das prateleiras.
*/

export const CATEGORIAS = [
  "Laticínios",
  "Grãos e cereais",
  "Hortifruti",
  "Padaria",
  "Carnes",
  "Congelados",
  "Bebidas",
  "Mercearia",
  "Limpeza",
  "Higiene",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

/** Grupo dos Itens sem categoria definida (ADR-022). */
export const SEM_CATEGORIA = "Sem categoria";

/**
 * Peso de ordenação de uma categoria: conhecidas na ordem da lista,
 * desconhecidas depois, "Sem categoria" sempre por último.
 */
export function pesoCategoria(categoria: string): number {
  const i = (CATEGORIAS as readonly string[]).indexOf(categoria);
  if (i >= 0) return i;
  return categoria === SEM_CATEGORIA ? 999 : 500;
}

/** Interpreta um valor persistido como Categoria da lista fixa (ou nada). */
export function comoCategoria(
  valor: string | null | undefined,
): Categoria | undefined {
  return (CATEGORIAS as readonly string[]).includes(valor ?? "")
    ? (valor as Categoria)
    : undefined;
}
