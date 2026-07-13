"use server";

import { revalidatePath } from "next/cache";
import { exigirCasa } from "@/shared/auth/sessao";
import {
  ajustarDespensa,
  type AjustarDespensaEntrada,
} from "@/modules/despensa/services/ajustarDespensa";
import {
  classificarItem,
  type ClassificarItemEntrada,
} from "@/modules/item/services/classificarItem";

/** Ajuste rápido da Despensa (Tem/Pouco/Acabou/Preciso) — ADR-007. */
export async function ajustarDespensaAction(entrada: AjustarDespensaEntrada) {
  const { casaId } = await exigirCasa();
  await ajustarDespensa({ casaId, entrada });
  revalidatePath("/despensa");
}

/** Unidade/categoria do Item editadas pela Despensa (ADR-022). */
export async function classificarItemAction(entrada: ClassificarItemEntrada) {
  const { casaId } = await exigirCasa();
  await classificarItem({ casaId, entrada });
  revalidatePath("/despensa");
  revalidatePath("/compras");
}
