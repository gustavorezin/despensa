import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { dataISOLocal, rotularDataCompra } from "@/shared/utils/data";

export type CompraDetalhe = {
  id: string;
  dataLabel: string;
  dataISO: string;
  descricao: string | null;
  itens: {
    id: string;
    itemId: string;
    nome: string;
    quantidade: number;
    unidade: string | null;
    categoria: string | null;
  }[];
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
    dataISO: dataISOLocal(compra.data),
    descricao: compra.descricao,
    itens: compra.itens.map((i) => ({
      id: i.id,
      itemId: i.itemId,
      nome: i.item.nomeCanonico,
      quantidade: Number(i.quantidade),
      unidade: i.unidade,
      categoria: i.item.categoria,
    })),
  };
}
