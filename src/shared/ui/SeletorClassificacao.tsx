"use client";

import { UNIDADES, type Unidade } from "@/modules/item/domain/unidades";
import { CATEGORIAS, type Categoria } from "@/modules/item/domain/categorias";

/**
 * Chips de unidade e categoria do Item (ADR-022), com toggle: tocar numa opção
 * marcada desmarca (`null` no callback = limpar). Usado no registro de Compra
 * e na edição do Item pela Despensa.
 */
export function SeletorClassificacao({
  unidade,
  categoria,
  aoAlterar,
}: {
  unidade?: Unidade;
  categoria?: Categoria;
  aoAlterar: (mudancas: {
    unidade?: Unidade | null;
    categoria?: Categoria | null;
  }) => void;
}) {
  const estiloChip = (ativa: boolean) =>
    ativa
      ? {
          background: "var(--color-acento)",
          borderColor: "var(--color-acento)",
          color: "#fff",
        }
      : {
          background: "var(--color-superficie, #fff)",
          borderColor: "var(--color-borda, #e7e0d6)",
          color: "var(--color-tinta, #2b241c)",
        };

  return (
    <>
      <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Unidade
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {UNIDADES.map((u) => {
          const ativa = unidade === u;
          return (
            <button
              key={u}
              type="button"
              aria-pressed={ativa}
              onClick={() => aoAlterar({ unidade: ativa ? null : u })}
              className="rounded-full border px-3.5 py-2 text-[13.5px] font-bold transition-colors"
              style={estiloChip(ativa)}
            >
              {u}
            </button>
          );
        })}
      </div>

      <div className="mb-1.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Categoria
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((cat) => {
          const ativa = categoria === cat;
          return (
            <button
              key={cat}
              type="button"
              aria-pressed={ativa}
              onClick={() => aoAlterar({ categoria: ativa ? null : cat })}
              className="rounded-full border px-3.5 py-2 text-[13.5px] font-bold transition-colors"
              style={estiloChip(ativa)}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </>
  );
}
