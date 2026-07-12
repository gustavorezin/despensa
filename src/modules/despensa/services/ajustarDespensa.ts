import { z } from "zod";
import { DespensaRepository } from "@/modules/despensa/repository/DespensaRepository";
import { calcularConfianca } from "@/modules/despensa/domain/estimativa";

// Ajuste rápido (ADR-007). `valor` é o contrato do PRECISO: obrigatório nele e
// inaplicável aos demais (Tem/Pouco/Acabou não carregam quantidade).
export const ajustarDespensaSchema = z
  .object({
    itemId: z.string().min(1),
    tipo: z.enum(["TEM", "POUCO", "ACABOU", "PRECISO"]),
    valor: z.number().int().min(0).max(999).optional(),
  })
  .superRefine((entrada, ctx) => {
    if (entrada.tipo === "PRECISO" && entrada.valor === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["valor"],
        message: "Informe a quantidade para o ajuste preciso.",
      });
    }
    if (entrada.tipo !== "PRECISO" && entrada.valor !== undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["valor"],
        message: "Quantidade só se aplica ao ajuste preciso.",
      });
    }
  });

export type AjustarDespensaEntrada = z.infer<typeof ajustarDespensaSchema>;

/**
 * Registra um AjusteDespensa (registro de eventos / proxy de consumo, ADR-013)
 * e atualiza o DespensaItem. NÃO cria ListaItem — a integração com a Lista é do
 * Marco 3. A confiança é recalculada com o ajuste já como evento mais recente.
 */
export async function ajustarDespensa({
  casaId,
  entrada,
  hoje = new Date(),
}: {
  casaId: string;
  entrada: AjustarDespensaEntrada;
  hoje?: Date;
}) {
  const { itemId, tipo, valor } = ajustarDespensaSchema.parse(entrada);

  // Só se ajusta o que está na Despensa desta Casa. Valida ANTES de qualquer
  // escrita, para não gravar eventos incoerentes de itens de outra Casa.
  const atual = await DespensaRepository.obterPorItem({ casaId, itemId });
  if (!atual) {
    throw new Error("Item não está na Despensa desta Casa.");
  }
  const qtdAtual = Number(atual.qtdEstimada);

  await DespensaRepository.registrarAjuste({ casaId, itemId, tipo, valor });

  const novaQtd =
    tipo === "ACABOU"
      ? 0
      : tipo === "PRECISO"
        ? (valor ?? qtdAtual)
        : tipo === "POUCO"
          ? qtdAtual <= 1
            ? qtdAtual
            : Math.floor(qtdAtual / 2)
          : qtdAtual; // TEM: mantém

  // historicoItem agora enxerga o ajuste recém-gravado como evento mais recente,
  // então a confiança reflete a intenção do usuário (Tem→alta, Acabou→baixa...).
  const historico = await DespensaRepository.historicoItem({ casaId, itemId });
  const confianca = calcularConfianca(historico, hoje);

  await DespensaRepository.upsertItem({
    casaId,
    itemId,
    qtdEstimada: novaQtd,
    confianca,
    ultimaCompraEm: historico.ultimaCompraEm,
  });
}
