"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exigirCasa } from "@/shared/auth/sessao";
import { registrarCompra } from "@/modules/compra/services/registrarCompra";
import type { EntradaCompra } from "@/modules/compra/services/entradaCompra";

/**
 * Server Action do fluxo fundacional: valida (Zod, no service), persiste a
 * Compra, rederiva a Despensa e leva à Despensa (efeito imediato do registro).
 */
export async function registrarCompraAction(entrada: EntradaCompra) {
  const { casaId, usuarioId } = await exigirCasa();
  await registrarCompra({ casaId, usuarioId, entrada });
  revalidatePath("/compras");
  revalidatePath("/despensa");
  revalidatePath("/lista");
  redirect("/despensa");
}
