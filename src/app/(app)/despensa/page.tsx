import { exigirCasa } from "@/shared/auth/sessao";
import { obterCasa } from "@/modules/casa/services/obterCasa";
import { listarDespensa } from "@/modules/despensa/services/listarDespensa";
import { EstadoVazio } from "@/shared/ui/EstadoVazio";
import { DespensaLista } from "./DespensaLista";

// A Despensa se preenche a partir das Compras (§4.3). Vazia → estado com CTA;
// com dados → itens por categoria com semáforo de confiança (ADR-004).
export default async function DespensaPage() {
  const { casaId } = await exigirCasa();
  const [casa, grupos] = await Promise.all([
    obterCasa({ casaId }),
    listarDespensa({ casaId }),
  ]);

  return (
    <>
      {casa && (
        <div className="text-[13px] font-semibold text-suave">{casa.nome}</div>
      )}
      <h1 className="text-[27px] font-extrabold tracking-tight text-tinta">
        Despensa
      </h1>

      {grupos.length === 0 ? (
        <EstadoVazio
          emoji="🧺"
          titulo="Sua Despensa está vazia"
          descricao="Ela se preenche sozinha a partir das Compras que você registrar. Sem digitar item por item."
          ctaTexto="Registrar Compra"
          ctaHref="/registrar"
        />
      ) : (
        <DespensaLista grupos={grupos} />
      )}
    </>
  );
}
