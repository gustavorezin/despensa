import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ItemRepository } from "@/modules/item/repository/ItemRepository";
import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { atualizarDespensaAposCompra } from "@/modules/despensa/services/atualizarDespensaAposCompra";
import { ListaRepository } from "@/modules/lista/repository/ListaRepository";
import { recalcularSugestoes } from "@/modules/lista/services/recalcularSugestoes";

// Contrato do fluxo fundacional (ADR-005). Uma Compra tem ao menos 1 item;
// cada linha tem um nome (texto do autocomplete/livre) e uma quantidade.
export const registrarCompraSchema = z.object({
  itens: z
    .array(
      z.object({
        nome: z.string().trim().min(1, "Item sem nome."),
        quantidade: z.number().int().min(1).max(999),
        unidade: z.string().trim().max(12).optional(),
      }),
    )
    .min(1, "Adicione ao menos um item."),
});

export type RegistrarCompraEntrada = z.infer<typeof registrarCompraSchema>;

/**
 * Caso de uso: registrar uma Compra manual. Resolve/cria cada Item da Casa,
 * persiste Compra + CompraItem, deriva a Despensa e recalcula as Sugestões —
 * tudo na mesma transação (§4.2/§4.3/§4.5). Itens comprados saem da Lista.
 */
export async function registrarCompra({
  casaId,
  usuarioId,
  entrada,
}: {
  casaId: string;
  usuarioId: string;
  entrada: RegistrarCompraEntrada;
}) {
  const { itens } = registrarCompraSchema.parse(entrada);

  const linhas = await Promise.all(
    itens.map(async (linha) => {
      const item = await ItemRepository.acharOuCriar({
        casaId,
        nome: linha.nome,
      });
      return {
        itemId: item.id,
        quantidade: linha.quantidade,
        unidade: linha.unidade,
      };
    }),
  );

  // Compra + derivação da Despensa nascem na MESMA transação: ou as duas
  // acontecem, ou nenhuma (§4.2/§4.3). Evita Compra persistida com Despensa
  // desatualizada e o risco de reenvio/duplicação num passo pós-commit.
  return prisma.$transaction(async (tx) => {
    const compraId = await CompraRepository.criarComItens({
      db: tx,
      casaId,
      usuarioId,
      itens: linhas,
    });

    const itemIds = linhas.map((l) => l.itemId);

    await atualizarDespensaAposCompra({
      db: tx,
      casaId,
      itens: linhas.map((l) => ({ itemId: l.itemId, quantidade: l.quantidade })),
    });

    // Itens comprados saem da Lista; em seguida o motor regenera as Sugestões.
    await ListaRepository.marcarComprados({ db: tx, casaId, itemIds });
    await recalcularSugestoes({ db: tx, casaId });

    return compraId;
  });
}
