import { getSessao } from "@/shared/auth/sessao";
import OnboardingCliente from "./OnboardingCliente";

// Server Component fino: lê o nome já conhecido da sessão (o Google traz do
// perfil OAuth; o login por email vem sem nome) e entrega ao cliente para
// pré-preencher o campo do passo 2.
export default async function OnboardingPage() {
  const sessao = await getSessao();
  return <OnboardingCliente nomeInicial={sessao?.user?.name ?? ""} />;
}
