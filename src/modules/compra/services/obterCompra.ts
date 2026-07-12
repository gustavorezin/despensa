import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { rotularDataCompra } from "@/shared/utils/data";

export type CompraDetalhe = {
  id: string;
  dataLabel: string;
  itens: { id: string; nome: string; quantidade: number; unidade: string | null }[];
};

/** Detalhe de uma Compra da Casa; `null` se não existir ou não for da Casa. */
export async function obterCompra({
  casaId,
  id,
}: {
  casaId: string;
  id: string;
}): Promise<CompraDetalhe | null> {
  const compra = await CompraRepository.obterPorId({ casaId, id });
  if (!compra) return null;

  return {
    id: compra.id,
    dataLabel: rotularDataCompra(compra.data),
    itens: compra.itens.map((i) => ({
      id: i.id,
      nome: i.item.nomeCanonico,
      quantidade: Number(i.quantidade),
      unidade: i.unidade,
    })),
  };
}
