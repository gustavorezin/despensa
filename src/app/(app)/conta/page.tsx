import { signOut } from "@/auth";
import { exigirCasa, getSessao } from "@/shared/auth/sessao";
import { obterCasa } from "@/modules/casa/services/obterCasa";

// Conta: perfil, dados da Casa e sair. Notificações (F1) e Moradores (F5)
// aparecem como "Em breve", desabilitados (spec-design §6.4).
export default async function ContaPage() {
  const { casaId } = await exigirCasa();
  const [sessao, casa] = await Promise.all([getSessao(), obterCasa({ casaId })]);

  const nome = sessao?.user?.name ?? "Você";
  const email = sessao?.user?.email ?? "";
  const inicial = nome.charAt(0).toUpperCase();

  async function sair() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <>
      <h1 className="mb-4.5 text-[27px] font-extrabold tracking-tight text-tinta">
        Conta
      </h1>

      <div className="flex items-center gap-3.5 rounded-[20px] border border-borda bg-superficie p-4.5">
        <span className="flex h-14 w-14 flex-none items-center justify-center rounded-[18px] bg-acento text-[23px] font-extrabold text-white">
          {inicial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-extrabold text-tinta">
            {nome}
          </span>
          {email && (
            <span className="mt-px block truncate text-[13.5px] text-suave">
              {email}
            </span>
          )}
        </span>
      </div>

      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Sua Casa
      </div>
      <div className="flex items-center gap-3 rounded-[18px] border border-borda bg-superficie p-4">
        <span
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-[19px]"
          style={{
            background: "color-mix(in srgb, var(--color-acento) 9%, #fff)",
          }}
        >
          🏠
        </span>
        <span className="flex-1">
          <span className="block text-[12px] font-semibold text-suave-2">
            Nome da Casa
          </span>
          <span className="mt-px block text-[15.5px] font-bold text-tinta">
            {casa?.nome ?? "Minha casa"}
          </span>
        </span>
      </div>

      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Configurações
      </div>
      <div className="overflow-hidden rounded-[18px] border border-borda bg-superficie">
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
