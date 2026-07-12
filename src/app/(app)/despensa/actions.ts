"use server";

import { revalidatePath } from "next/cache";
import { exigirCasa } from "@/shared/auth/sessao";
import {
  ajustarDespensa,
  type AjustarDespensaEntrada,
} from "@/modules/despensa/services/ajustarDespensa";

/** Ajuste rápido da Despensa (Tem/Pouco/Acabou/Preciso) — ADR-007. */
export async function ajustarDespensaAction(entrada: AjustarDespensaEntrada) {
  const { casaId } = await exigirCasa();
  await ajustarDespensa({ casaId, entrada });
  revalidatePath("/despensa");
}
