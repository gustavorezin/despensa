import { getSessao } from "@/shared/auth/sessao";
import { EstadoVazio } from "@/shared/ui/EstadoVazio";

// Lista é a home (ADR-002). As Sugestões do motor de aprendizado chegam no
// Marco 3; por ora, estado vazio honesto que convida a registrar a 1ª Compra.
export default async function ListaPage() {
  const sessao = await getSessao();
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
    </>
  );
}
