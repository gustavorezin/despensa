import Link from "next/link";

// Tela pós-envio do link de acesso (magic link via Resend). Substitui a página
// verifyRequest padrão do Auth.js, seguindo o visual do login.
export default async function VerificarEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <main className="flex min-h-full flex-col justify-center px-8 py-16">
      <div className="mx-auto w-full max-w-sm md:max-w-3xl">
        <div
          className="mb-7 flex h-20 w-20 items-center justify-center rounded-[28px] text-[42px]"
          style={{
            background: "color-mix(in srgb, var(--color-acento) 12%, #fff)",
          }}
        >
          📬
        </div>
        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight text-tinta">
          Verifique seu
          <br />
          e-mail
        </h1>
        <p className="mt-3 max-w-[320px] text-[16px] leading-normal text-suave">
          Enviamos um link de acesso
          {email ? (
            <>
              {" "}
              para <span className="font-bold text-tinta">{email}</span>
            </>
          ) : null}
          . Abra o e-mail e toque no link para entrar.
        </p>

        <div className="mt-8 rounded-2xl border border-borda bg-superficie p-4 text-[14px] leading-normal text-suave">
          Não chegou? Confira a caixa de spam ou volte e tente novamente com
          outro e-mail.
        </div>

        <Link
          href="/login"
          className="mt-6 block w-full rounded-2xl border border-borda-forte bg-superficie px-4 py-4 text-center text-[16px] font-bold text-tinta"
        >
          Voltar ao login
        </Link>
      </div>
    </main>
  );
}
