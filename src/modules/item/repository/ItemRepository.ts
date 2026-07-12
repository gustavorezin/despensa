import { prisma } from "@/lib/prisma";

/** Normalização simples de nome (ADR-005): colapsa espaços e capitaliza a 1ª letra. */
export function normalizarNome(bruto: string): string {
  const limpo = bruto.trim().replace(/\s+/g, " ");
  if (!limpo) return limpo;
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

export const ItemRepository = {
  /** Autocomplete: Itens da Casa cujo nome contém o termo (ADR-005). */
  async buscarPorTermo({ casaId, termo }: { casaId: string; termo: string }) {
    return prisma.item.findMany({
      where: {
        casaId,
        nomeCanonico: { contains: termo, mode: "insensitive" },
      },
      orderBy: { nomeCanonico: "asc" },
      take: 7,
      select: { id: true, nomeCanonico: true, categoria: true },
    });
  },

  /**
   * Resolve o Item canônico da Casa a partir de um texto: reaproveita o
   * existente ou cria um novo (registrando o texto bruto como ApelidoItem).
   */
  async acharOuCriar({ casaId, nome }: { casaId: string; nome: string }) {
    const nomeCanonico = normalizarNome(nome);

    const existente = await prisma.item.findUnique({
      where: { casaId_nomeCanonico: { casaId, nomeCanonico } },
      select: { id: true },
    });
    if (existente) return existente;

    return prisma.item.create({
      data: {
        casaId,
        nomeCanonico,
        apelidos: { create: { textoBruto: nome.trim() } },
      },
      select: { id: true },
    });
  },
};
