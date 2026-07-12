import { DespensaRepository } from "@/modules/despensa/repository/DespensaRepository";
import { calcularConfianca } from "@/modules/despensa/domain/estimativa";

/**
 * Recalcula o DespensaItem de cada Item recém-comprado (§4.3). Chamado de forma
 * síncrona no caso de uso de registrar Compra. Estoque F0 ≈ o que se comprou
 * na última Compra (sem modelo de consumo); confiança vem do domínio.
 */
export async function atualizarDespensaAposCompra({
  casaId,
  itens,
  hoje = new Date(),
}: {
  casaId: string;
  itens: { itemId: string; quantidade: number }[];
  hoje?: Date;
}) {
  for (const linha of itens) {
    const historico = await DespensaRepository.historicoItem({
      casaId,
      itemId: linha.itemId,
    });
    const confianca = calcularConfianca(historico, hoje);
    await DespensaRepository.upsertItem({
      casaId,
      itemId: linha.itemId,
      qtdEstimada: linha.quantidade,
      confianca,
      ultimaCompraEm: historico.ultimaCompraEm,
    });
  }
}
