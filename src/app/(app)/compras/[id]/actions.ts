"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { exigirCasa } from "@/shared/auth/sessao";
import { editarCompra } from "@/modules/compra/services/editarCompra";
import { excluirCompra } from "@/modules/compra/services/excluirCompra";
import type { EntradaCompra } from "@/modules/compra/services/entradaCompra";

// Toda escrita em Compra mexe em dados derivados (Despensa e Sugestões,
// ADR-023), então as três superfícies são revalidadas juntas.
function revalidarSuperficies() {
  revalidatePath("/compras");
  revalidatePath("/despensa");
  revalidatePath("/lista");
}

export async function editarCompraAction(
  compraId: string,
  entrada: EntradaCompra,
) {
  const { casaId } = await exigirCasa();
  await editarCompra({ casaId, compraId, entrada });
  revalidarSuperficies();
  redirect(`/compras/${compraId}`);
}

export async function excluirCompraAction(compraId: string) {
  const { casaId } = await exigirCasa();
  await excluirCompra({ casaId, compraId });
  revalidarSuperficies();
  redirect("/compras");
}
