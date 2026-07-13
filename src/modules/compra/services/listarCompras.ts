import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { rotularDataCompra } from "@/shared/utils/data";

export type CompraResumo = {
  id: string;
  dataLabel: string;
  descricao: string | null;
  quantidadeItens: number;
};

/** Histórico de Compras da Casa, pronto para renderizar. */
export async function listarCompras({
  casaId,
}: {
  casaId: string;
}): Promise<CompraResumo[]> {
  const compras = await CompraRepository.listarPorCasa({ casaId });
  return compras.map((c) => ({
    id: c.id,
    dataLabel: rotularDataCompra(c.data),
    descricao: c.descricao,
    quantidadeItens: c._count.itens,
  }));
}
