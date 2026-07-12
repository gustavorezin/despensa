"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exigirCasa } from "@/shared/auth/sessao";
import {
  registrarCompra,
  type RegistrarCompraEntrada,
} from "@/modules/compra/services/registrarCompra";

/**
 * Server Action do fluxo fundacional: valida (Zod, no service), persiste a
 * Compra, atualiza a Despensa e leva à Despensa (efeito imediato do registro).
 */
export async function registrarCompraAction(entrada: RegistrarCompraEntrada) {
  const { casaId, usuarioId } = await exigirCasa();
  await registrarCompra({ casaId, usuarioId, entrada });
  revalidatePath("/compras");
  revalidatePath("/despensa");
  redirect("/despensa");
}
