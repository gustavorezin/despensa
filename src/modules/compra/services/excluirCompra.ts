import { prisma } from "@/lib/prisma";
import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { rederivarDespensa } from "@/modules/despensa/services/rederivarDespensa";
import { recalcularSugestoes } from "@/modules/lista/services/recalcularSugestoes";

/**
 * Caso de uso: excluir uma Compra — ADR-023. A Despensa é rederivada para os
 * Itens que a Compra continha (sem outra fonte, a estimativa some) e as
 * Sugestões são regeneradas. ListaItens marcados COMPRADOS não são revertidos
 * (consequência aceita no ADR-023).
 */
export async function excluirCompra({
  casaId,
  compraId,
}: {
  casaId: string;
  compraId: string;
}): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const { itemIds } = await CompraRepository.excluir({
      db: tx,
      casaId,
      id: compraId,
    });

    await rederivarDespensa({
      db: tx,
      casaId,
      itemIds: [...new Set(itemIds)],
    });
    await recalcularSugestoes({ db: tx, casaId });
  });
}
