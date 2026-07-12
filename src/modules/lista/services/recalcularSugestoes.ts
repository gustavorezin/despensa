import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AprendizadoRepository } from "@/modules/learning/repository/AprendizadoRepository";
import { gerarSugestao } from "@/modules/learning/domain/motor";
import { ListaRepository } from "@/modules/lista/repository/ListaRepository";

/**
 * Recalcula as Sugestões da Casa (§4.5). Disparado após cada Compra e cada
 * Ajuste, dentro da transação. Estratégia determinística: apaga as Sugestões
 * ATIVAS e regenera pelo motor, respeitando decisões do usuário (aceitos e
 * manuais bloqueiam; descartes suprimem até uma nova Compra).
 */
export async function recalcularSugestoes({
  db = prisma,
  casaId,
  hoje = new Date(),
}: {
  db?: Prisma.TransactionClient;
  casaId: string;
  hoje?: Date;
}) {
  await ListaRepository.apagarSugestoesAtivas({ db, casaId });

  const [historicos, { bloqueados, dispensados }] = await Promise.all([
    AprendizadoRepository.historicos({ db, casaId }),
    ListaRepository.bloqueadosEDispensados({ db, casaId }),
  ]);

  for (const [itemId, historico] of historicos) {
    if (bloqueados.has(itemId)) continue;

    // Descarte vigente: o usuário dispensou e ainda não comprou de novo.
    const descartadoEm = dispensados.get(itemId);
    if (
      descartadoEm &&
      historico.ultimaCompraEm &&
      descartadoEm.getTime() >= historico.ultimaCompraEm.getTime()
    ) {
      continue;
    }

    const sugestao = gerarSugestao(historico, hoje);
    if (!sugestao) continue;

    await ListaRepository.criarSugestao({
      db,
      casaId,
      itemId,
      motivo: sugestao.motivo,
      qtdSugerida: sugestao.qtdSugerida,
    });
  }
}
