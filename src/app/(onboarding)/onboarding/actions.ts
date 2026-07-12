"use server";

import { redirect } from "next/navigation";
import { getSessao } from "@/shared/auth/sessao";
import { criarCasa } from "@/modules/casa/services/criarCasa";

/**
 * Conclui o onboarding (ADR-009): cria a Casa do usuário e segue para a Lista
 * ou direto ao registro da primeira Compra. Com sessão "database", o próximo
 * request já resolve a `casaId` no callback de sessão.
 */
export async function criarCasaAction(nome: string, irRegistrar: boolean) {
  const sessao = await getSessao();
  if (!sessao?.usuarioId) redirect("/login");

  await criarCasa({ usuarioId: sessao.usuarioId, nome });
  redirect(irRegistrar ? "/registrar" : "/lista");
}
