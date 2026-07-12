import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { rotularDataCompra } from "@/shared/utils/data";

export type CompraResumo = {
  id: string;
  dataLabel: string;
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
    quantidadeItens: c._count.itens,
  }));
}
