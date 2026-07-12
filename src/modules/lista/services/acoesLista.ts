import { z } from "zod";
import { ListaRepository } from "@/modules/lista/repository/ListaRepository";
import { ItemRepository } from "@/modules/item/repository/ItemRepository";

/** Aceitar uma Sugestão: passa a integrar a Lista do usuário (grupo "Você adicionou"). */
export async function aceitarItem({
  casaId,
  listaItemId,
}: {
  casaId: string;
  listaItemId: string;
}) {
  await ListaRepository.definirStatus({ casaId, id: listaItemId, status: "ACEITO" });
}

/**
 * Descartar da Lista. Numa Sugestão, vira DISPENSADO (sinal negativo que a
 * suprime até uma nova Compra); num item manual/aceito, remove de vez.
 */
export async function descartarItem({
  casaId,
  listaItemId,
}: {
  casaId: string;
  listaItemId: string;
}) {
  const item = await ListaRepository.obter({ casaId, id: listaItemId });
  if (!item) return;

  if (item.origem === "SUGESTAO" && item.status === "ATIVO") {
    await ListaRepository.definirStatus({ casaId, id: listaItemId, status: "DISPENSADO" });
  } else {
    await ListaRepository.remover({ casaId, id: listaItemId });
  }
}

export async function editarQtd({
  casaId,
  listaItemId,
  qtd,
}: {
  casaId: string;
  listaItemId: string;
  qtd: number;
}) {
  const quantidade = z.number().int().min(1).max(999).parse(qtd);
  await ListaRepository.atualizarQtd({ casaId, id: listaItemId, qtdSugerida: quantidade });
}

const adicionarSchema = z.object({
  nome: z.string().trim().min(1, "Item sem nome."),
  qtd: z.number().int().min(1).max(999).default(1),
});

/** Adicionar item manual à Lista (ADR-003): resolve/cria o Item e cria o ListaItem. */
export async function adicionarManual({
  casaId,
  entrada,
}: {
  casaId: string;
  entrada: { nome: string; qtd?: number };
}) {
  const { nome, qtd } = adicionarSchema.parse(entrada);
  const item = await ItemRepository.acharOuCriar({ casaId, nome });
  await ListaRepository.criarManual({ casaId, itemId: item.id, qtdSugerida: qtd });
}
