"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { excluirCompraAction } from "./actions";

/**
 * Ações do detalhe da Compra (ADR-023): editar leva ao formulário
 * pré-preenchido; excluir confirma em bottom sheet antes de gravar.
 */
export function AcoesCompra({ compraId }: { compraId: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, iniciar] = useTransition();

  function excluir() {
    iniciar(async () => {
      await excluirCompraAction(compraId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/compras/${compraId}/editar`}
        className="rounded-xl bg-[#f4efe7] px-3.5 py-2 text-[13.5px] font-bold text-tinta"
      >
        Editar
      </Link>
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="rounded-xl px-3.5 py-2 text-[13.5px] font-bold text-white"
        style={{ background: "#c2452f" }}
      >
        Excluir
      </button>

      <BottomSheet
        aberto={confirmando}
        aoFechar={() => setConfirmando(false)}
        ariaLabel="Excluir Compra"
      >
        <h2 className="text-[19px] font-extrabold text-tinta">
          Excluir esta Compra?
        </h2>
        <p className="mb-5 mt-1.5 text-[14.5px] text-suave">
          Vou recalcular sua Despensa e as Sugestões sem os itens dela. Essa
          ação não pode ser desfeita.
        </p>
        <button
          type="button"
          onClick={excluir}
          disabled={excluindo}
          className="w-full rounded-2xl px-4 py-3.5 text-[15.5px] font-bold text-white"
          style={{ background: "#c2452f", opacity: excluindo ? 0.7 : 1 }}
        >
          {excluindo ? "Excluindo…" : "Excluir Compra"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          className="mt-2 w-full rounded-2xl bg-[#f4efe7] px-4 py-3.5 text-[15.5px] font-bold text-tinta"
        >
          Cancelar
        </button>
      </BottomSheet>
    </div>
  );
}
