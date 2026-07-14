import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { DespensaRepository } from "@/modules/despensa/repository/DespensaRepository";
import {
  calcularConfianca,
  rederivarQtdEstimada,
} from "@/modules/aprendizado/domain/estimativa";

/**
 * Rederiva o DespensaItem de cada Item afetado por uma mudança nas Compras —
 * registro (inclusive retroativo), edição ou exclusão (§4.3, ADR-023). Lê o
 * histórico persistido já dentro da transação (recebe `db`), então é atômico
 * com a escrita que o disparou. As iterações são sequenciais de propósito —
 * dentro de uma transação as consultas compartilham a mesma conexão.
 */
export async function rederivarDespensa({
  db = prisma,
  casaId,
  itemIds,
  hoje = new Date(),
}: {
  db?: Prisma.TransactionClient;
  casaId: string;
  itemIds: string[];
  hoje?: Date;
}) {
  for (const itemId of itemIds) {
    const historico = await DespensaRepository.historicoItem({
      db,
      casaId,
      itemId,
    });
    const atual = await DespensaRepository.obterPorItem({ db, casaId, itemId });
    const qtdEstimada = rederivarQtdEstimada(
      historico,
      atual ? Number(atual.qtdEstimada) : null,
    );

    // Sem nenhuma fonte, a estimativa some — Despensa é dado derivado (§3).
    if (qtdEstimada === null) {
      await DespensaRepository.removerItem({ db, casaId, itemId });
      continue;
    }

    await DespensaRepository.upsertItem({
      db,
      casaId,
      itemId,
      qtdEstimada,
      confianca: calcularConfianca(historico, hoje),
      ultimaCompraEm: historico.ultimaCompraEm,
    });
  }
}
