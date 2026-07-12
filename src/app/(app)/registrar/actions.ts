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
 * Compra e volta ao histórico. Recálculo de aprendizado entra nos Marcos 2/3.
 */
export async function registrarCompraAction(entrada: RegistrarCompraEntrada) {
  const { casaId, usuarioId } = await exigirCasa();
  await registrarCompra({ casaId, usuarioId, entrada });
  revalidatePath("/compras");
  redirect("/compras");
}
