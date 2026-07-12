import { z } from "zod";
import { ItemRepository } from "@/modules/item/repository/ItemRepository";
import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { atualizarDespensaAposCompra } from "@/modules/despensa/services/atualizarDespensaAposCompra";

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
 * persiste Compra + CompraItem e dispara o recálculo da Despensa de forma
 * síncrona (§4.2/§4.3). O motor de aprendizado formal entra no Marco 3.
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

  const compraId = await CompraRepository.criarComItens({
    casaId,
    usuarioId,
    itens: linhas,
  });

  // Derivada de Compra: atualiza a estimativa de Despensa de cada Item (§4.3).
  await atualizarDespensaAposCompra({
    casaId,
    itens: linhas.map((l) => ({ itemId: l.itemId, quantidade: l.quantidade })),
  });

  return compraId;
}
