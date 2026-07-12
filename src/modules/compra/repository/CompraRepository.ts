import { prisma } from "@/lib/prisma";

type LinhaResolvida = {
  itemId: string;
  quantidade: number;
  unidade?: string | null;
};

export const CompraRepository = {
  /**
   * Cria a Compra e suas linhas numa transação. Resolve o Morador autor
   * (criadaPorId) dentro da mesma transação — prepara F5 sem exigi-lo agora.
   */
  async criarComItens({
    casaId,
    usuarioId,
    itens,
  }: {
    casaId: string;
    usuarioId: string;
    itens: LinhaResolvida[];
  }) {
    return prisma.$transaction(async (tx) => {
      const morador = await tx.morador.findUnique({
        where: { usuarioId_casaId: { usuarioId, casaId } },
        select: { id: true },
      });
      const compra = await tx.compra.create({
        data: {
          casaId,
          data: new Date(),
          criadaPorId: morador?.id ?? null,
          itens: {
            create: itens.map((i) => ({
              itemId: i.itemId,
              quantidade: i.quantidade,
              unidade: i.unidade ?? null,
            })),
          },
        },
        select: { id: true },
      });
      return compra.id;
    });
  },

  /** Histórico da Casa, mais recente primeiro, com a contagem de itens. */
  async listarPorCasa({ casaId }: { casaId: string }) {
    return prisma.compra.findMany({
      where: { casaId },
      orderBy: { data: "desc" },
      select: {
        id: true,
        data: true,
        _count: { select: { itens: true } },
      },
    });
  },

  /** Detalhe de uma Compra da Casa (nulo se não pertencer à Casa). */
  async obterPorId({ casaId, id }: { casaId: string; id: string }) {
    return prisma.compra.findFirst({
      where: { id, casaId },
      select: {
        id: true,
        data: true,
        itens: {
          orderBy: { item: { nomeCanonico: "asc" } },
          select: {
            id: true,
            quantidade: true,
            unidade: true,
            item: { select: { nomeCanonico: true } },
          },
        },
      },
    });
  },
};
