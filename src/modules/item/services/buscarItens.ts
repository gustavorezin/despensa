import { ItemRepository } from "@/modules/item/repository/ItemRepository";

/**
 * Caso de uso do autocomplete de registro manual (ADR-005): só busca a partir
 * do 2º caractere; abaixo disso não há consulta.
 */
export async function buscarItens({
  casaId,
  termo,
}: {
  casaId: string;
  termo: string;
}) {
  const limpo = termo.trim();
  if (limpo.length < 2) return [];
  return ItemRepository.buscarPorTermo({ casaId, termo: limpo });
}
