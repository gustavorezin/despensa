"use client";

import { useState, useTransition } from "react";
import { criarCasaAction } from "./actions";

// Onboarding em stack linear de 3 telas (ADR-009). "Pular" é opção legítima
// de primeiro nível: mesmo pulando, criamos a Casa (o app precisa dela).
export default function OnboardingPage() {
  const [passo, setPasso] = useState(1);
  const [nome, setNome] = useState("");
  const [enviando, iniciar] = useTransition();

  function finalizar(irRegistrar: boolean) {
    iniciar(() => {
      criarCasaAction(nome, irRegistrar);
    });
  }

  const dotAtivo = "var(--color-acento)";
  const dotInativo = "#e2dbd0";

  return (
    <main className="flex min-h-full flex-col">
      <div className="flex justify-end px-6 pt-14">
        <button
          type="button"
          onClick={() => finalizar(false)}
          disabled={enviando}
          className="px-1 py-1.5 text-[14px] font-semibold text-suave disabled:opacity-50"
        >
          Pular
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-center px-8">
        {passo === 1 && (
          <div>
            <div
              className="mb-8 flex items-center justify-center rounded-[36px] text-[62px]"
              style={{
                width: 128,
                height: 128,
                background: "color-mix(in srgb, var(--color-acento) 12%, #fff)",
              }}
            >
              🤖
            </div>
            <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight text-tinta">
              Bem-vindo à
              <br />
              Despensa
            </h1>
            <p className="mt-4 max-w-[300px] text-[16.5px] leading-normal text-suave">
              Seu assistente de abastecimento da casa. Eu lembro o que
              provavelmente está faltando — você só confirma.
            </p>
          </div>
        )}

        {passo === 2 && (
          <div>
            <div className="text-[13px] font-bold uppercase tracking-wide text-acento">
              Passo 2 de 3
            </div>
            <h1 className="mt-2.5 text-[30px] font-extrabold leading-tight tracking-tight text-tinta">
              Como se chama
              <br />
              sua Casa?
            </h1>
            <p className="mt-1.5 mb-5 text-[15px] text-suave">
              Pode dar um apelido — é só pra deixar pessoal.
            </p>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Ap. 42"
              maxLength={40}
              className="w-full rounded-2xl border-[1.5px] border-borda-forte bg-superficie px-4.5 py-4 text-[18px] font-semibold text-tinta outline-none focus:border-acento"
            />
            <div className="mt-3.5 flex gap-2">
              {["Ap. 42", "Casa da família"].map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setNome(ex)}
                  className="rounded-full bg-[#f4efe7] px-3.5 py-2 text-[13.5px] font-semibold text-[#6e665d]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {passo === 3 && (
          <div>
            <div
              className="mb-7 flex items-center justify-center rounded-[36px] text-[60px]"
              style={{
                width: 128,
                height: 128,
                background: "color-mix(in srgb, var(--color-acento) 12%, #fff)",
              }}
            >
              🧺
            </div>
            <div className="text-[13px] font-bold uppercase tracking-wide text-acento">
              Passo 3 de 3
            </div>
            <h1 className="mt-2.5 text-[30px] font-extrabold leading-tight tracking-tight text-tinta">
              Eu aprendo com
              <br />
              suas Compras
            </h1>
            <p className="mt-2.5 max-w-[300px] text-[16px] leading-normal text-suave">
              A cada Compra registrada, fico melhor em prever o que está
              acabando. Quer registrar a primeira agora?
            </p>
          </div>
        )}
      </div>

      <div className="px-8 pb-11">
        <div className="mb-6 flex justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className="h-2 w-2 rounded-full"
              style={{ background: passo === n ? dotAtivo : dotInativo }}
            />
          ))}
        </div>

        {passo < 3 ? (
          <button
            type="button"
            onClick={() => setPasso((p) => Math.min(3, p + 1))}
            className="w-full rounded-[18px] bg-acento px-4 py-[17px] text-[17px] font-bold text-white"
            style={{
              boxShadow:
                "0 10px 22px color-mix(in srgb, var(--color-acento) 32%, transparent)",
            }}
          >
            {passo === 1 ? "Começar" : "Continuar"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => finalizar(true)}
              disabled={enviando}
              className="w-full rounded-[18px] bg-acento px-4 py-[17px] text-[17px] font-bold text-white disabled:opacity-60"
              style={{
                boxShadow:
                  "0 10px 22px color-mix(in srgb, var(--color-acento) 32%, transparent)",
              }}
            >
              {enviando ? "Criando sua Casa…" : "Registrar primeira Compra"}
            </button>
            <button
              type="button"
              onClick={() => finalizar(false)}
              disabled={enviando}
              className="w-full pt-4 text-[15px] font-semibold text-suave disabled:opacity-50"
            >
              Fazer isso depois
            </button>
          </>
        )}
      </div>
    </main>
  );
}
