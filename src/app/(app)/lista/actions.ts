"use server";

import { revalidatePath } from "next/cache";
import { exigirCasa } from "@/shared/auth/sessao";
import {
  aceitarItem,
  descartarItem,
  editarQtd,
  adicionarManual,
} from "@/modules/lista/services/acoesLista";

// Ações da Lista (ADR-003/008). Todas revalidam a home após mutar.
export async function aceitarAction(listaItemId: string) {
  const { casaId } = await exigirCasa();
  await aceitarItem({ casaId, listaItemId });
  revalidatePath("/lista");
}

export async function descartarAction(listaItemId: string) {
  const { casaId } = await exigirCasa();
  await descartarItem({ casaId, listaItemId });
  revalidatePath("/lista");
}

export async function editarQtdAction(listaItemId: string, qtd: number) {
  const { casaId } = await exigirCasa();
  await editarQtd({ casaId, listaItemId, qtd });
  revalidatePath("/lista");
}

export async function adicionarItemAction(nome: string, qtd?: number) {
  const { casaId } = await exigirCasa();
  await adicionarManual({ casaId, entrada: { nome, qtd } });
  revalidatePath("/lista");
}
