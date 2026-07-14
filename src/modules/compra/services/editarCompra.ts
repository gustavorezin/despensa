import { prisma } from "@/lib/prisma";
import { ItemRepository } from "@/modules/item/repository/ItemRepository";
import { CompraRepository } from "@/modules/compra/repository/CompraRepository";
import { rederivarDespensa } from "@/modules/despensa/services/rederivarDespensa";
import { ListaRepository } from "@/modules/lista/repository/ListaRepository";
import { recalcularSugestoes } from "@/modules/lista/services/recalcularSugestoes";
import { resolverCabecalho } from "@/modules/compra/domain/cabecalho";
import {
  entradaCompraSchema,
  type EntradaCompra,
} from "@/modules/compra/services/entradaCompra";

/**
 * Caso de uso: editar uma Compra existente (descrição, data, itens) — ADR-023.
 * As linhas são trocadas por inteiro e a Despensa é rederivada para a união
 * dos Itens antigos e novos (um Item removido da Compra também precisa
 * recalcular). Sugestões são regeneradas na mesma transação.
 */
export async function editarCompra({
  casaId,
  compraId,
  entrada,
}: {
  casaId: string;
  compraId: string;
  entrada: EntradaCompra;
}): Promise<void> {
  const dados = entradaCompraSchema.parse(entrada);
  const { descricao, data } = resolverCabecalho(dados);

  // Fora da transação, espelhando registrarCompra (mesmo trade-off aceito).
  const linhas = await Promise.all(
    dados.itens.map(async (linha) => {
      const item = await ItemRepository.acharOuCriar({
        casaId,
        nome: linha.nome,
      });
      return {
        itemId: item.id,
        quantidade: linha.quantidade,
        unidade: linha.unidade,
        categoria: linha.categoria,
      };
    }),
  );

  await prisma.$transaction(async (tx) => {
    const { itemIdsAntigos } = await CompraRepository.atualizarComItens({
      db: tx,
      casaId,
      compraId,
      descricao,
      data,
      itens: linhas,
    });

    // Classificação informada no chip sobrescreve a do Item (ADR-022).
    for (const linha of linhas) {
      await ItemRepository.atualizarClassificacao({
        db: tx,
        casaId,
        itemId: linha.itemId,
        categoria: linha.categoria,
        unidadePadrao: linha.unidade,
      });
    }

    const itemIdsNovos = [...new Set(linhas.map((l) => l.itemId))];
    const afetados = [...new Set([...itemIdsAntigos, ...itemIdsNovos])];

    await rederivarDespensa({ db: tx, casaId, itemIds: afetados });

    // Item adicionado na edição sai da Lista, coerente com o registro.
    await ListaRepository.marcarComprados({
      db: tx,
      casaId,
      itemIds: itemIdsNovos,
    });
    await recalcularSugestoes({ db: tx, casaId });
  });
}
