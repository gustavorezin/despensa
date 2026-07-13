import Link from "next/link";
import { signOut } from "@/auth";
import { exigirCasa, getSessao } from "@/shared/auth/sessao";
import { obterCasa } from "@/modules/casa/services/obterCasa";
import { IconeChevronDireita } from "@/shared/ui/icones";
import EditarNome from "./EditarNome";
import EditarNomeCasa from "./EditarNomeCasa";

// Conta: perfil, dados da Casa, dicas de uso (ADR-025) e sair. Notificações
// (adiadas — ADR-024) e Moradores (F5) aparecem como "Em breve" (§6.4).
export default async function ContaPage() {
  const { casaId } = await exigirCasa();
  const [sessao, casa] = await Promise.all([getSessao(), obterCasa({ casaId })]);

  const nome = sessao?.user?.name ?? "";
  const email = sessao?.user?.email ?? "";

  async function sair() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <>
      <h1 className="mb-4.5 text-[27px] font-extrabold tracking-tight text-tinta">
        Conta
      </h1>

      <EditarNome nomeAtual={nome} email={email} />

      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Sua Casa
      </div>
      <EditarNomeCasa nomeAtual={casa?.nome ?? ""} />

      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Configurações
      </div>
      <div className="overflow-hidden rounded-[18px] border border-borda bg-superficie">
        <Link
          href="/conta/dicas"
          className="flex items-center gap-3 p-4"
          style={{ borderBottom: "1px solid #f4efe8" }}
        >
          <span className="text-[18px]">💡</span>
          <span className="flex-1 text-[15px] font-semibold text-tinta">
            Dicas de uso
          </span>
          <span className="flex text-[#cfc7bb]">
            <IconeChevronDireita tamanho={17} />
          </span>
        </Link>
        {[
          { emoji: "🔔", label: "Notificações" },
          { emoji: "👥", label: "Moradores" },
        ].map((item, idx) => (
          <div
            key={item.label}
            className="flex items-center gap-3 p-4 opacity-55"
            style={{
              borderBottom: idx === 0 ? "1px solid #f4efe8" : "none",
            }}
          >
            <span className="text-[18px]">{item.emoji}</span>
            <span className="flex-1 text-[15px] font-semibold text-tinta">
              {item.label}
            </span>
            <span className="rounded-full bg-[#f4efe7] px-2.5 py-1 text-[11.5px] font-bold text-suave-2">
              Em breve
            </span>
          </div>
        ))}
      </div>

      <form action={sair}>
        <button
          type="submit"
          className="mt-6 w-full rounded-2xl border border-borda bg-superficie px-4 py-3.5 text-[15px] font-bold text-[#d7553b]"
        >
          Sair
        </button>
      </form>
    </>
  );
}
