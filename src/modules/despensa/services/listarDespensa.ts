import { DespensaRepository } from "@/modules/despensa/repository/DespensaRepository";
import {
  calcularConfianca,
  nivelConfianca,
  textoQuantidade,
  gerarExplicacao,
  type NivelConfianca,
} from "@/modules/despensa/domain/estimativa";
import { rotularDataCompra } from "@/shared/utils/data";

export type LinhaDespensa = {
  id: string;
  itemId: string;
  nome: string;
  nivel: NivelConfianca;
  qtyText: string;
  explicacao: string;
  ultimaCompraLabel: string;
};

export type GrupoDespensa = { categoria: string; itens: LinhaDespensa[] };

// Categorias conhecidas primeiro; o resto alfabético; "Outros" por último.
const ORDEM_CATEGORIAS = [
  "Laticínios",
  "Grãos e cereais",
  "Hortifruti",
  "Padaria",
  "Carnes",
  "Bebidas",
  "Mercearia",
  "Limpeza",
  "Higiene",
];

function pesoCategoria(cat: string): number {
  const i = ORDEM_CATEGORIAS.indexOf(cat);
  if (i >= 0) return i;
  return cat === "Outros" ? 999 : 500;
}

/**
 * Despensa pronta para a tela: recalcula a confiança na leitura (a estimativa
 * decai naturalmente com o tempo), traduz em semáforo e agrupa por categoria.
 */
export async function listarDespensa({
  casaId,
  hoje = new Date(),
}: {
  casaId: string;
  hoje?: Date;
}): Promise<GrupoDespensa[]> {
  const linhas = await DespensaRepository.listarComHistorico({ casaId });

  const porCategoria = new Map<string, LinhaDespensa[]>();
  for (const l of linhas) {
    const nivel = nivelConfianca(calcularConfianca(l.historico, hoje));
    const linha: LinhaDespensa = {
      id: l.id,
      itemId: l.itemId,
      nome: l.nome,
      nivel,
      qtyText: textoQuantidade({
        qtd: l.qtdEstimada,
        unidade: l.unidade,
        nivel,
      }),
      explicacao: gerarExplicacao(l.historico, hoje),
      ultimaCompraLabel: l.historico.ultimaCompraEm
        ? rotularDataCompra(l.historico.ultimaCompraEm)
        : "—",
    };
    const categoria = l.categoria ?? "Outros";
    const grupo = porCategoria.get(categoria) ?? [];
    grupo.push(linha);
    porCategoria.set(categoria, grupo);
  }

  return [...porCategoria.entries()]
    .map(([categoria, itens]) => ({
      categoria,
      itens: itens.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    }))
    .sort((a, b) => pesoCategoria(a.categoria) - pesoCategoria(b.categoria));
}
