import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirCasa } from "@/shared/auth/sessao";
import { obterCompra } from "@/modules/compra/services/obterCompra";
import { IconeChevronEsquerda } from "@/shared/ui/icones";
import { AcoesCompra } from "./AcoesCompra";

// Detalhe de uma Compra registrada. Escopo por Casa: se o id não for da Casa,
// 404 (nenhum vazamento entre tenants).
export default async function CompraDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { casaId } = await exigirCasa();
  const compra = await obterCompra({ casaId, id });
  if (!compra) notFound();

  return (
    <>
      <div className="flex items-center gap-2.5">
        <Link
          href="/compras"
          aria-label="Voltar"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#f4efe7] text-tinta"
        >
          <IconeChevronEsquerda tamanho={20} />
        </Link>
        <span className="flex-1 text-[15px] font-bold text-suave">
          Detalhe da Compra
        </span>
        <AcoesCompra compraId={compra.id} />
      </div>

      {/* A descrição identifica a Compra; a data vira apoio (ADR-021). */}
      <h1 className="mt-3 text-[25px] font-extrabold tracking-tight text-tinta">
        {compra.descricao ?? compra.dataLabel}
      </h1>
      <div className="mb-4 mt-0.5 text-[14px] font-semibold text-suave">
        {compra.descricao ? `${compra.dataLabel} · ` : ""}
        {compra.itens.length} {compra.itens.length === 1 ? "item" : "itens"}
      </div>

      <div className="overflow-hidden rounded-[18px] border border-borda bg-superficie">
        {compra.itens.map((it, idx) => (
          <div
            key={it.id}
            className="flex items-center gap-3 px-4 py-3.5"
            style={{
              borderBottom:
                idx === compra.itens.length - 1
                  ? "none"
                  : "1px solid #f4efe8",
            }}
          >
            <span className="h-[7px] w-[7px] flex-none rounded-full bg-[#d9d2c7]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold text-tinta">
                {it.nome}
              </span>
              {it.categoria && (
                <span className="mt-px block text-[12px] text-suave-2">
                  {it.categoria}
                </span>
              )}
            </span>
            <span className="text-[13px] font-bold text-suave">
              ×{it.quantidade}
              {it.unidade ? ` ${it.unidade}` : ""}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
