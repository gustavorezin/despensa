import { itensParaMarcar, type ItemMarcavel } from "./itensParaMarcar";
import { agruparPorCategoria } from "@/modules/item/domain/categorias";

export type GrupoMercado = { categoria: string; itens: ItemMarcavel[] };

/**
 * Itens ativos da Lista agrupados por categoria para o Modo Mercado (ADR-015):
 * a ordem reflete a disposição de prateleiras, com "Sem categoria" por último.
 */
export async function itensDoMercado({
  casaId,
}: {
  casaId: string;
}): Promise<GrupoMercado[]> {
  const itens = await itensParaMarcar({ casaId });
  return agruparPorCategoria(itens);
}
