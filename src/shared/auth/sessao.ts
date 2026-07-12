import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Sessão do Auth.js já enriquecida com `usuarioId` e `casaId`
 * (ver callback em src/auth.ts e tipos em src/types/next-auth.d.ts).
 */
export async function getSessao() {
  return auth();
}

/**
 * Guarda de rota para o shell autenticado: garante que há sessão e Casa ativa.
 * - Sem sessão → volta ao login.
 * - Sessão sem Casa → vai ao onboarding criar a Casa.
 * Retorna o contexto multi-tenant usado por todos os repositórios.
 */
export async function exigirCasa(): Promise<{
  usuarioId: string;
  casaId: string;
}> {
  const sessao = await auth();
  if (!sessao?.usuarioId) redirect("/login");
  if (!sessao.casaId) redirect("/onboarding");
  return { usuarioId: sessao.usuarioId, casaId: sessao.casaId };
}
