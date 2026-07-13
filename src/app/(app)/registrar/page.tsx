import { exigirCasa } from "@/shared/auth/sessao";
import { itensParaMarcar } from "@/modules/lista/services/itensParaMarcar";
import { RegistrarConteudo } from "./RegistrarConteudo";

// Registrar Compra (ADR-005/ADR-017). Carrega os Itens ativos da Lista para
// habilitar a via "Marcar da lista" (disponível só com ≥1 Item).
export default async function RegistrarPage() {
  const { casaId } = await exigirCasa();
  const itensDaLista = await itensParaMarcar({ casaId });

  return <RegistrarConteudo itensDaLista={itensDaLista} />;
}
