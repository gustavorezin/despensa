import { prisma } from "@/lib/prisma";

/*
  Acesso a dados de Casa. Único lugar (junto aos demais repositórios) que
  conhece Prisma. Ver spec-tecnica §2.4.
*/
export const CasaRepository = {
  /**
   * Cria a Casa e vincula o usuário como Morador DONO, numa transação —
   * as duas escritas nascem juntas ou nenhuma nasce.
   */
  async criarComDono({ usuarioId, nome }: { usuarioId: string; nome: string }) {
    return prisma.$transaction(async (tx) => {
      const casa = await tx.casa.create({ data: { nome } });
      await tx.morador.create({
        data: { usuarioId, casaId: casa.id, papel: "DONO" },
      });
      return casa;
    });
  },

  async obterPorId({ id }: { id: string }) {
    return prisma.casa.findUnique({
      where: { id },
      select: { id: true, nome: true },
    });
  },
};
