import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ItemRepository } from "@/modules/item/repository/ItemRepository";
import { CATEGORIAS } from "@/modules/item/domain/categorias";
import { UNIDADES } from "@/modules/item/domain/unidades";

// Classificação avulsa de um Item (ADR-022), fora do registro de Compra —
// ex.: pela Despensa. `null` limpa o campo; ausente não mexe.
const classificarItemSchema = z.object({
  itemId: z.string().min(1),
  categoria: z.enum(CATEGORIAS).nullable().optional(),
  unidadePadrao: z.enum(UNIDADES).nullable().optional(),
});

export type ClassificarItemEntrada = z.infer<typeof classificarItemSchema>;

export async function classificarItem({
  casaId,
  entrada,
}: {
  casaId: string;
  entrada: ClassificarItemEntrada;
}): Promise<void> {
  const dados = classificarItemSchema.parse(entrada);

  // Guard multi-tenant: só classifica Item da própria Casa.
  const item = await prisma.item.findFirst({
    where: { id: dados.itemId, casaId },
    select: { id: true },
  });
  if (!item) throw new Error("Item não encontrado.");

  await ItemRepository.atualizarClassificacao({
    itemId: dados.itemId,
    categoria: dados.categoria,
    unidadePadrao: dados.unidadePadrao,
  });
}
