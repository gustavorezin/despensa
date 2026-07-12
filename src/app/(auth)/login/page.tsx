import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { getSessao } from "@/shared/auth/sessao";

// Entrada do app: Google (1 toque) ou link de acesso por email (Resend).
// Ambos os provedores são do F0 (spec-produto §4.1). Sem tab bar aqui.
export default async function LoginPage() {
  const sessao = await getSessao();
  if (sessao?.usuarioId) redirect("/");

  async function entrarComGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/" });
  }

  async function entrarComEmail(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    await signIn("resend", { email, redirectTo: "/" });
  }

  return (
    <main className="flex min-h-full flex-col justify-center px-8 py-16">
      <div className="mx-auto w-full max-w-sm">
        <div
          className="mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] text-[42px]"
          style={{
            background: "color-mix(in srgb, var(--color-acento) 12%, #fff)",
          }}
        >
          🤖
        </div>
        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-tinta">
          Despensa
        </h1>
        <p className="mt-3 max-w-[300px] text-[16px] leading-normal text-suave">
          Seu assistente de abastecimento da casa. Entre para começar.
        </p>

        <form action={entrarComGoogle} className="mt-9">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-borda-forte bg-superficie px-4 py-4 text-[16px] font-bold text-tinta"
          >
            <span className="text-[18px]">🇬</span>
            Continuar com Google
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-[13px] font-semibold text-suave-2">
          <span className="h-px flex-1 bg-borda-forte" />
          ou
          <span className="h-px flex-1 bg-borda-forte" />
        </div>

        <form action={entrarComEmail} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            required
            placeholder="seu@email.com"
            autoComplete="email"
            className="w-full rounded-2xl border-[1.5px] border-borda-forte bg-superficie px-4 py-4 text-[16px] font-medium text-tinta outline-none focus:border-acento"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-acento px-4 py-4 text-[16px] font-bold text-white"
            style={{
              boxShadow:
                "0 10px 22px color-mix(in srgb, var(--color-acento) 30%, transparent)",
            }}
          >
            Enviar link de acesso
          </button>
        </form>
      </div>
    </main>
  );
}
