import { redirect } from "next/navigation";
import { exigirCasa } from "@/shared/auth/sessao";
import { itensDoMercado } from "@/modules/lista/services/itensDoMercado";
import { ModoMercado } from "./ModoMercado";

// Modo Mercado (ADR-015): fullscreen que reorganiza os Itens ativos da Lista
// por categoria. Sem Itens ativos, não há o que marcar → volta para a Lista.
export default async function MercadoPage() {
  const { casaId } = await exigirCasa();
  const grupos = await itensDoMercado({ casaId });
  if (grupos.length === 0) redirect("/lista");

  return <ModoMercado grupos={grupos} />;
}
