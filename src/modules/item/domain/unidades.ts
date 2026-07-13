/*
  Unidades de medida de Item — lista fixa do domínio (ADR-022). A quantidade
  segue inteira na captura; a unidade é o rótulo que dá sentido a ela
  ("2 kg", "1 pct").
*/

export const UNIDADES = ["un", "kg", "g", "L", "mL", "pct"] as const;

export type Unidade = (typeof UNIDADES)[number];

/** Interpreta um valor persistido como Unidade da lista fixa (ou nada). */
export function comoUnidade(
  valor: string | null | undefined,
): Unidade | undefined {
  return (UNIDADES as readonly string[]).includes(valor ?? "")
    ? (valor as Unidade)
    : undefined;
}
