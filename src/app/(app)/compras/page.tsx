import Link from "next/link";
import { exigirCasa } from "@/shared/auth/sessao";
import { listarCompras } from "@/modules/compra/services/listarCompras";
import { EstadoVazio } from "@/shared/ui/EstadoVazio";
import { IconeSacola, IconeChevronDireita } from "@/shared/ui/icones";

// Histórico cronológico de Compras (spec-design §6.3). Fonte primária de dados
// de aprendizado; por isso o registro é privilegiado no FAB persistente.
export default async function ComprasPage() {
  const { casaId } = await exigirCasa();
  const compras = await listarCompras({ casaId });

  return (
    <>
      <div className="text-[13px] font-semibold text-suave">Histórico</div>
      <h1 className="text-[27px] font-extrabold tracking-tight text-tinta">
        Compras
      </h1>

      {compras.length === 0 ? (
        <EstadoVazio
          emoji="🛒"
          titulo="Nenhuma Compra ainda"
          descricao="Registre uma Compra e eu começo a aprender seus hábitos para te ajudar na Lista."
          ctaTexto="Registrar Compra"
          ctaHref="/registrar"
        />
      ) : (
        <div className="mt-5 flex flex-col gap-2.5">
          {compras.map((c) => (
            <Link
              key={c.id}
              href={`/compras/${c.id}`}
              className="flex items-center gap-3 rounded-[18px] border border-borda bg-superficie p-4"
            >
              <span
                className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] text-acento"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-acento) 9%, #fff)",
                }}
              >
                <IconeSacola tamanho={22} />
              </span>
              <span className="min-w-0 flex-1">
                {/* A descrição identifica a Compra; a data vira apoio (ADR-021). */}
                <span className="block truncate text-[15.5px] font-bold text-tinta">
                  {c.descricao ?? c.dataLabel}
                </span>
                <span className="mt-px block truncate text-[13px] text-suave">
                  {c.descricao ? `${c.dataLabel} · ` : ""}
                  {c.quantidadeItens}{" "}
                  {c.quantidadeItens === 1 ? "item" : "itens"}
                </span>
              </span>
              <span className="flex text-[#cfc7bb]">
                <IconeChevronDireita tamanho={18} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
