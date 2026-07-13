"use client";

import { BottomSheet } from "@/shared/ui/BottomSheet";
import { SeletorClassificacao } from "@/shared/ui/SeletorClassificacao";
import { IconeMais, IconeMenos } from "@/shared/ui/icones";
import type { ChipCompra } from "./FormularioCompra";

/**
 * Detalhes de um item da Compra (ADR-022): quantidade, unidade e categoria em
 * bottom sheet opcional — o caminho rápido de captura (ADR-005) segue intacto.
 */
export function DetalheItemSheet({
  chip,
  aoAlterar,
  aoFechar,
}: {
  chip: ChipCompra | null;
  aoAlterar: (mudancas: Partial<ChipCompra>) => void;
  aoFechar: () => void;
}) {
  return (
    <BottomSheet
      aberto={chip !== null}
      aoFechar={aoFechar}
      ariaLabel="Detalhes do item"
    >
      {chip && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="min-w-0 truncate text-[19px] font-extrabold text-tinta">
              {chip.nome}
            </h2>
            <div
              className="flex flex-none items-center rounded-[11px] bg-superficie"
              style={{
                border:
                  "1px solid color-mix(in srgb, var(--color-acento) 18%, #fff)",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  aoAlterar({ quantidade: Math.max(1, chip.quantidade - 1) })
                }
                aria-label="menos"
                className="flex h-9 w-9 items-center justify-center text-[#6e665d]"
              >
                <IconeMenos tamanho={15} />
              </button>
              <span className="min-w-[30px] text-center text-[15px] font-bold text-tinta">
                {chip.quantidade}
              </span>
              <button
                type="button"
                onClick={() => aoAlterar({ quantidade: chip.quantidade + 1 })}
                aria-label="mais"
                className="flex h-9 w-9 items-center justify-center text-[#6e665d]"
              >
                <IconeMais tamanho={15} />
              </button>
            </div>
          </div>

          <SeletorClassificacao
            unidade={chip.unidade}
            categoria={chip.categoria}
            aoAlterar={(m) =>
              aoAlterar({
                ...(m.unidade !== undefined && { unidade: m.unidade ?? undefined }),
                ...(m.categoria !== undefined && {
                  categoria: m.categoria ?? undefined,
                }),
              })
            }
          />

          <button
            type="button"
            onClick={aoFechar}
            className="mt-5 w-full rounded-2xl px-4 py-3.5 text-[15.5px] font-bold text-white"
            style={{ background: "var(--color-acento)" }}
          >
            Pronto
          </button>
        </>
      )}
    </BottomSheet>
  );
}
