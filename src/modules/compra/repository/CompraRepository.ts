import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LinhaResolvida = {
  itemId: string;
  quantidade: number;
  unidade?: string | null;
};

export const CompraRepository = {
  /**
   * Cria a Compra e suas linhas. Resolve o Morador autor (criadaPorId). Aceita
   * um cliente de transação (`db`) para que a Compra e a derivação da Despensa
   * nasçam atomicamente no caso de uso (§4.2/§4.3).
   */
  async criarComItens({
    db = prisma,
    casaId,
    usuarioId,
    descricao = null,
    data = new Date(),
    itens,
  }: {
    db?: Prisma.TransactionClient;
    casaId: string;
    usuarioId: string;
    descricao?: string | null;
    data?: Date;
    itens: LinhaResolvida[];
  }) {
    const morador = await db.morador.findUnique({
      where: { usuarioId_casaId: { usuarioId, casaId } },
      select: { id: true },
    });
    const compra = await db.compra.create({
      data: {
        casaId,
        data,
        descricao,
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
  },

  /**
   * Substitui o cabeçalho e as linhas de uma Compra da Casa (troca total das
   * linhas — sem diff; o volume é minúsculo). Devolve os itemIds antigos para
   * a rederivação da Despensa cobrir também os removidos (ADR-023).
   */
  async atualizarComItens({
    db = prisma,
    casaId,
    compraId,
    descricao,
    data,
    itens,
  }: {
    db?: Prisma.TransactionClient;
    casaId: string;
    compraId: string;
    descricao: string | null;
    data: Date;
    itens: LinhaResolvida[];
  }): Promise<{ itemIdsAntigos: string[] }> {
    // Guard multi-tenant: só edita Compra da própria Casa.
    const compra = await db.compra.findFirst({
      where: { id: compraId, casaId },
      select: { id: true, itens: { select: { itemId: true } } },
    });
    if (!compra) throw new Error("Compra não encontrada.");

    await db.compraItem.deleteMany({ where: { compraId } });
    await db.compra.update({
      where: { id: compraId },
      data: {
        descricao,
        data,
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

    return { itemIdsAntigos: compra.itens.map((l) => l.itemId) };
  },

  /**
   * Exclui uma Compra da Casa (cascade apaga as linhas). Devolve os itemIds
   * afetados para a rederivação da Despensa (ADR-023).
   */
  async excluir({
    db = prisma,
    casaId,
    id,
  }: {
    db?: Prisma.TransactionClient;
    casaId: string;
    id: string;
  }): Promise<{ itemIds: string[] }> {
    const compra = await db.compra.findFirst({
      where: { id, casaId },
      select: { id: true, itens: { select: { itemId: true } } },
    });
    if (!compra) throw new Error("Compra não encontrada.");

    await db.compra.delete({ where: { id }, select: { id: true } });

    return { itemIds: compra.itens.map((l) => l.itemId) };
  },

  /** Histórico da Casa, mais recente primeiro, com a contagem de itens. */
  async listarPorCasa({ casaId }: { casaId: string }) {
    return prisma.compra.findMany({
      where: { casaId },
      orderBy: [{ data: "desc" }, { criadaEm: "desc" }],
      select: {
        id: true,
        data: true,
        descricao: true,
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
        descricao: true,
        itens: {
          orderBy: { item: { nomeCanonico: "asc" } },
          select: {
            id: true,
            itemId: true,
            quantidade: true,
            unidade: true,
            item: { select: { nomeCanonico: true, categoria: true } },
          },
        },
      },
    });
  },
};
