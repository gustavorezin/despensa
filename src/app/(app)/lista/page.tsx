import { exigirCasa, getSessao } from "@/shared/auth/sessao";
import { montarLista } from "@/modules/lista/services/montarLista";
import { EstadoVazio } from "@/shared/ui/EstadoVazio";
import { ListaConteudo } from "./ListaConteudo";

// Lista é a home (ADR-002): unifica Sugestões do motor + itens manuais,
// agrupadas por motivo (ADR-003/006). Vazia → estado com CTA (ADR-012).
export default async function ListaPage() {
  const { casaId } = await exigirCasa();
  const [sessao, grupos] = await Promise.all([getSessao(), montarLista({ casaId })]);
  const primeiroNome = sessao?.user?.name?.split(" ")[0];

  return (
    <>
      {primeiroNome && (
        <div className="text-[13px] font-semibold text-suave">
          Olá, {primeiroNome}
        </div>
      )}
      <h1 className="text-[27px] font-extrabold tracking-tight text-tinta">
        Lista
      </h1>

      {grupos.length === 0 ? (
        <EstadoVazio
          emoji="🤖"
          titulo={
            <>
              Ainda estou aprendendo
              <br />
              seus hábitos
            </>
          }
          descricao="Registre sua primeira Compra e eu começo a sugerir o que provavelmente está faltando."
          ctaTexto="Registrar Compra"
          ctaHref="/registrar"
        />
      ) : (
        <ListaConteudo grupos={grupos} />
      )}
    </>
  );
}
