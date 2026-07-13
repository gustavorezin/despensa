import { ListaRepository } from "@/modules/lista/repository/ListaRepository";
import { comoUnidade, type Unidade } from "@/modules/item/domain/unidades";
import { comoCategoria, type Categoria } from "@/modules/item/domain/categorias";

export type ItemMarcavel = {
  nome: string;
  quantidade: number;
  unidade?: Unidade;
  categoria?: Categoria;
};

/**
 * Itens ativos da Lista prontos para pré-preencher a Compra na via "Marcar da
 * lista" (ADR-017): Sugestões + manuais viram chips com a mesma forma que o
 * formulário espera. A quantidade parte da sugerida (arredondada, mín. 1) e a
 * classificação vem do Item — tudo editável no formulário antes de confirmar.
 */
export async function itensParaMarcar({
  casaId,
}: {
  casaId: string;
}): Promise<ItemMarcavel[]> {
  const ativos = await ListaRepository.listarAtivos({ casaId });
  return ativos.map((a) => ({
    nome: a.item.nomeCanonico,
    quantidade: Math.max(1, Math.round(a.qtdSugerida != null ? Number(a.qtdSugerida) : 1)),
    unidade: comoUnidade(a.item.unidadePadrao),
    categoria: comoCategoria(a.item.categoria),
  }));
}
