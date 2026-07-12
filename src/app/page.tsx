import { redirect } from "next/navigation";
import { getSessao } from "@/shared/auth/sessao";

// Ponto de entrada: encaminha conforme o estado da sessão.
// Sem login → /login; logado sem Casa → /onboarding; pronto → /lista (home, ADR-002).
export default async function Home() {
  const sessao = await getSessao();
  if (!sessao?.usuarioId) redirect("/login");
  if (!sessao.casaId) redirect("/onboarding");
  redirect("/lista");
}
