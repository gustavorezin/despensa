import { exigirCasa } from "@/shared/auth/sessao";
import { obterCasa } from "@/modules/casa/services/obterCasa";
import { EstadoVazio } from "@/shared/ui/EstadoVazio";

// A Despensa se preenche a partir das Compras (Marco 2). No Marco 1 mostra o
// estado vazio com CTA, honesto sobre como ela ganha conteúdo.
export default async function DespensaPage() {
  const { casaId } = await exigirCasa();
  const casa = await obterCasa({ casaId });

  return (
    <>
      {casa && (
        <div className="text-[13px] font-semibold text-suave">{casa.nome}</div>
      )}
      <h1 className="text-[27px] font-extrabold tracking-tight text-tinta">
        Despensa
      </h1>

      <EstadoVazio
        emoji="🧺"
        titulo="Sua Despensa está vazia"
        descricao="Ela se preenche sozinha a partir das Compras que você registrar. Sem digitar item por item."
        ctaTexto="Registrar Compra"
        ctaHref="/registrar"
      />
    </>
  );
}
