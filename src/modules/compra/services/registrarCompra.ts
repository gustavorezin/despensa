import { z } from "zod";
import { ItemRepository } from "@/modules/item/repository/ItemRepository";
import { CompraRepository } from "@/modules/compra/repository/CompraRepository";

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
 * Caso de uso: registrar uma Compra manual. Resolve/cria cada Item da Casa e
 * persiste Compra + CompraItem. Ver spec-tecnica §4.2.
 *
 * (O recálculo de aprendizado e a atualização da Despensa entram nos Marcos 2/3.)
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

  return CompraRepository.criarComItens({ casaId, usuarioId, itens: linhas });
}
