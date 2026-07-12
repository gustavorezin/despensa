import { prisma } from "@/lib/prisma";
import type { TipoAjuste } from "@/modules/despensa/domain/estimativa";

type LinhaHistorico = {
  numeroCompras: number;
  ultimaCompraEm: Date | null;
  ultimoAjuste: { tipo: TipoAjuste; em: Date } | null;
};

export const DespensaRepository = {
  /** Cria/atualiza a estimativa de um Item (1 DespensaItem por Item). */
  async upsertItem({
    casaId,
    itemId,
    qtdEstimada,
    confianca,
    ultimaCompraEm,
  }: {
    casaId: string;
    itemId: string;
    qtdEstimada: number;
    confianca: number;
    ultimaCompraEm: Date | null;
  }) {
    return prisma.despensaItem.upsert({
      where: { itemId },
      create: { casaId, itemId, qtdEstimada, confianca, ultimaCompraEm },
      update: { qtdEstimada, confianca, ultimaCompraEm },
      select: { id: true },
    });
  },

  async obterPorItem({ casaId, itemId }: { casaId: string; itemId: string }) {
    return prisma.despensaItem.findFirst({
      where: { casaId, itemId },
      select: { id: true, qtdEstimada: true },
    });
  },

  async registrarAjuste({
    casaId,
    itemId,
    tipo,
    valor,
  }: {
    casaId: string;
    itemId: string;
    tipo: TipoAjuste;
    valor?: number | null;
  }) {
    return prisma.ajusteDespensa.create({
      data: { casaId, itemId, tipo, valor: valor ?? null },
      select: { id: true },
    });
  },

  /** Histórico de proxies de um Item, para (re)calcular a confiança. */
  async historicoItem({
    casaId,
    itemId,
  }: {
    casaId: string;
    itemId: string;
  }): Promise<LinhaHistorico> {
    const [numeroCompras, ultimaCompra, ultimoAjuste] = await Promise.all([
      prisma.compraItem.count({ where: { itemId, compra: { casaId } } }),
      prisma.compra.findFirst({
        where: { casaId, itens: { some: { itemId } } },
        orderBy: { data: "desc" },
        select: { data: true },
      }),
      prisma.ajusteDespensa.findFirst({
        where: { casaId, itemId },
        orderBy: { em: "desc" },
        select: { tipo: true, em: true },
      }),
    ]);

    return {
      numeroCompras,
      ultimaCompraEm: ultimaCompra?.data ?? null,
      ultimoAjuste: ultimoAjuste
        ? { tipo: ultimoAjuste.tipo as TipoAjuste, em: ultimoAjuste.em }
        : null,
    };
  },

  /**
   * Todos os DespensaItens da Casa com o contexto necessário para recalcular a
   * confiança na leitura (nº de Compras e último ajuste, em consultas batelada).
   */
  async listarComHistorico({ casaId }: { casaId: string }) {
    const itens = await prisma.despensaItem.findMany({
      where: { casaId },
      select: {
        id: true,
        itemId: true,
        qtdEstimada: true,
        ultimaCompraEm: true,
        item: {
          select: {
            nomeCanonico: true,
            categoria: true,
            unidadePadrao: true,
          },
        },
      },
    });
    if (itens.length === 0) return [];

    const itemIds = itens.map((i) => i.itemId);

    const [contagens, ajustes] = await Promise.all([
      prisma.compraItem.groupBy({
        by: ["itemId"],
        where: { itemId: { in: itemIds }, compra: { casaId } },
        _count: { _all: true },
      }),
      prisma.ajusteDespensa.findMany({
        where: { casaId, itemId: { in: itemIds } },
        orderBy: { em: "desc" },
        select: { itemId: true, tipo: true, em: true },
      }),
    ]);

    const contagemPorItem = new Map(
      contagens.map((c) => [c.itemId, c._count._all]),
    );
    const ajustePorItem = new Map<string, { tipo: TipoAjuste; em: Date }>();
    for (const a of ajustes) {
      if (!ajustePorItem.has(a.itemId)) {
        ajustePorItem.set(a.itemId, { tipo: a.tipo as TipoAjuste, em: a.em });
      }
    }

    return itens.map((i) => ({
      id: i.id,
      itemId: i.itemId,
      nome: i.item.nomeCanonico,
      categoria: i.item.categoria,
      unidade: i.item.unidadePadrao,
      qtdEstimada: Number(i.qtdEstimada),
      historico: {
        numeroCompras: contagemPorItem.get(i.itemId) ?? 0,
        ultimaCompraEm: i.ultimaCompraEm,
        ultimoAjuste: ajustePorItem.get(i.itemId) ?? null,
      } satisfies LinhaHistorico,
    }));
  },
};
