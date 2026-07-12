import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DespensaRepository } from "@/modules/despensa/repository/DespensaRepository";
import { calcularConfianca } from "@/modules/despensa/domain/estimativa";

/**
 * Recalcula o DespensaItem de cada Item recém-comprado (§4.3). Roda dentro da
 * mesma transação da Compra (recebe `db`), então é atômico com ela. As
 * iterações são sequenciais de propósito — dentro de uma transação as consultas
 * compartilham a mesma conexão. Estoque F0 ≈ o que se comprou na última Compra;
 * a confiança vem do domínio.
 */
export async function atualizarDespensaAposCompra({
  db = prisma,
  casaId,
  itens,
  hoje = new Date(),
}: {
  db?: Prisma.TransactionClient;
  casaId: string;
  itens: { itemId: string; quantidade: number }[];
  hoje?: Date;
}) {
  for (const linha of itens) {
    const historico = await DespensaRepository.historicoItem({
      db,
      casaId,
      itemId: linha.itemId,
    });
    const confianca = calcularConfianca(historico, hoje);
    await DespensaRepository.upsertItem({
      db,
      casaId,
      itemId: linha.itemId,
      qtdEstimada: linha.quantidade,
      confianca,
      ultimaCompraEm: historico.ultimaCompraEm,
    });
  }
}
