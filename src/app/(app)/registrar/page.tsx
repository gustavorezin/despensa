"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarCompraAction } from "./actions";
import { FormularioCompra } from "./FormularioCompra";
import {
  IconeX,
  IconeChevronEsquerda,
  IconeChevronDireita,
} from "@/shared/ui/icones";

// Registrar Compra manual (ADR-005). Tela cheia sobre o shell: passo "como
// registrar" → formulário de Compra (busca + descrição/data + chips).
export default function RegistrarPage() {
  const router = useRouter();
  const [passo, setPasso] = useState<"escolher" | "manual">("escolher");

  function fechar() {
    if (passo === "manual") {
      setPasso("escolher");
    } else {
      router.push("/lista");
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-fundo">
      {/* Mesma coluna do shell: estreita no mobile, larga no desktop. */}
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col md:max-w-3xl">
      <div className="flex items-center gap-2.5 px-4.5 pb-2 pt-14">
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#f4efe7] text-tinta"
        >
          {passo === "manual" ? (
            <IconeChevronEsquerda tamanho={20} />
          ) : (
            <IconeX tamanho={18} />
          )}
        </button>
        <span className="text-[15px] font-bold text-suave">
          Registrar Compra
        </span>
      </div>

      {passo === "escolher" ? (
        <div className="px-5.5 pt-3.5">
          <h1 className="text-[26px] font-extrabold tracking-tight text-tinta">
            Como quer registrar?
          </h1>
          <p className="mb-5 mt-1 text-[14.5px] text-suave">
            Escolha a forma mais prática agora.
          </p>

          <button
            type="button"
            onClick={() => setPasso("manual")}
            className="flex w-full items-center gap-3.5 rounded-[18px] border-[1.5px] border-borda-forte bg-superficie p-4.5 text-left"
          >
            <span
              className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[14px] text-[22px]"
              style={{
                background: "color-mix(in srgb, var(--color-acento) 10%, #fff)",
              }}
            >
              ✍️
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-extrabold text-tinta">
                Manual
              </span>
              <span className="mt-px block text-[13px] text-suave">
                Buscar e adicionar itens
              </span>
            </span>
            <span className="flex text-[#cfc7bb]">
              <IconeChevronDireita tamanho={18} />
            </span>
          </button>

          <div className="mt-3 flex items-center gap-3.5 rounded-[18px] border-[1.5px] border-borda bg-superficie p-4.5 opacity-50">
            <span className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[14px] bg-[#f4efe7] text-[22px]">
              📷
            </span>
            <span className="flex-1">
              <span className="block text-[16px] font-extrabold text-tinta">
                Foto da nota
              </span>
              <span className="mt-px block text-[13px] text-suave">
                Escanear o cupom fiscal
              </span>
            </span>
            <span className="rounded-full bg-[#f4efe7] px-2.5 py-1 text-[11.5px] font-bold text-suave-2">
              Em breve
            </span>
          </div>
        </div>
      ) : (
        <FormularioCompra
          rotuloConfirmar="Registrar Compra"
          rotuloEnviando="Registrando…"
          aoConfirmar={registrarCompraAction}
        />
      )}
      </div>
    </div>
  );
}
