import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { HistoricoAprendizado } from "@/modules/learning/domain/motor";
import type { TipoAjuste } from "@/modules/despensa/domain/estimativa";

/*
  Carrega o histórico de proxies (Compras + ajustes) por Item para alimentar o
  motor de aprendizado. Reduz em memória — volume F0 é pequeno (§8). O motor
  nunca toca no banco; recebe estes dados e devolve Sugestões (§5.1).
*/
export const AprendizadoRepository = {
  async historicos({
    db = prisma,
    casaId,
  }: {
    db?: Prisma.TransactionClient;
    casaId: string;
  }): Promise<Map<string, HistoricoAprendizado>> {
    const [compras, ajustes] = await Promise.all([
      db.compra.findMany({
        where: { casaId },
        select: { data: true, itens: { select: { itemId: true } } },
      }),
      db.ajusteDespensa.findMany({
        where: { casaId },
        orderBy: { em: "desc" },
        select: { itemId: true, tipo: true, em: true },
      }),
    ]);

    // datas de Compra por Item (uma vez por Compra, mesmo com linha duplicada)
    const datasPorItem = new Map<string, Date[]>();
    for (const compra of compras) {
      const itemIds = new Set(compra.itens.map((i) => i.itemId));
      for (const itemId of itemIds) {
        const lista = datasPorItem.get(itemId) ?? [];
        lista.push(compra.data);
        datasPorItem.set(itemId, lista);
      }
    }

    const ajustePorItem = new Map<string, { tipo: TipoAjuste; em: Date }>();
    for (const a of ajustes) {
      if (!ajustePorItem.has(a.itemId)) {
        ajustePorItem.set(a.itemId, { tipo: a.tipo as TipoAjuste, em: a.em });
      }
    }

    const resultado = new Map<string, HistoricoAprendizado>();
    for (const [itemId, datas] of datasPorItem) {
      datas.sort((a, b) => a.getTime() - b.getTime());
      resultado.set(itemId, {
        numeroCompras: datas.length,
        primeiraCompraEm: datas[0],
        ultimaCompraEm: datas[datas.length - 1],
        ultimoAjuste: ajustePorItem.get(itemId) ?? null,
      });
    }
    return resultado;
  },
};
