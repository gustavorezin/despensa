"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import {
  IconeMais,
  IconeMenos,
  IconeCheck,
  IconeX,
  IconeInfo,
  IconeLupa,
} from "@/shared/ui/icones";
import type { GrupoLista, LinhaLista } from "@/modules/lista/services/montarLista";
import {
  aceitarAction,
  descartarAction,
  editarQtdAction,
  adicionarItemAction,
} from "./actions";

type ItemBusca = { id: string; nomeCanonico: string; categoria: string | null };

export function ListaConteudo({ grupos }: { grupos: GrupoLista[] }) {
  const [sheet, setSheet] = useState<LinhaLista | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState<ItemBusca[]>([]);
  const [qtdLocal, setQtdLocal] = useState<Record<string, number>>({});
  const [, iniciar] = useTransition();

  // Autocomplete do "Adicionar item" (mesmo padrão do registro, ADR-005).
  useEffect(() => {
    if (!addOpen) return;
    const q = termo.trim();
    const controlador = new AbortController();
    const t = setTimeout(async () => {
      if (q.length < 2) {
        setSugestoes([]);
        return;
      }
      try {
        const res = await fetch(`/api/itens?termo=${encodeURIComponent(q)}`, {
          signal: controlador.signal,
        });
        const dados = await res.json();
        setSugestoes(dados.itens ?? []);
      } catch {
        /* aborto/rede — ignora */
      }
    }, 200);
    return () => {
      clearTimeout(t);
      controlador.abort();
    };
  }, [termo, addOpen]);

  const semResultados = termo.trim().length >= 2 && sugestoes.length === 0;
  const temSugestao = grupos.some((g) => g.itens.some((i) => i.ehSugestao));

  function qtdDe(linha: LinhaLista) {
    return qtdLocal[linha.listaItemId] ?? linha.qtd;
  }

  function mudarQtd(linha: LinhaLista, delta: number) {
    const nova = Math.max(1, qtdDe(linha) + delta);
    setQtdLocal((m) => ({ ...m, [linha.listaItemId]: nova }));
    iniciar(() => {
      editarQtdAction(linha.listaItemId, nova);
    });
  }

  function aceitar(id: string) {
    setSheet(null);
    iniciar(() => {
      aceitarAction(id);
    });
  }

  function descartar(id: string) {
    setSheet(null);
    iniciar(() => {
      descartarAction(id);
    });
  }

  function adicionar(nome: string) {
    const limpo = nome.trim();
    if (!limpo) return;
    setAddOpen(false);
    setTermo("");
    setSugestoes([]);
    iniciar(() => {
      adicionarItemAction(limpo);
    });
  }

  return (
    <>
      {temSugestao && (
        <div
          className="mt-3.5 mb-1 flex items-start gap-2.5 rounded-2xl px-3.5 py-3"
          style={{
            background: "color-mix(in srgb, var(--color-acento) 7%, #fff)",
            border: "1px solid color-mix(in srgb, var(--color-acento) 16%, #fff)",
          }}
        >
          <span className="text-[18px] leading-tight">🤖</span>
          <span className="text-[13.5px] font-semibold leading-snug text-[#544d8f]">
            Separei o que provavelmente está faltando. Você confirma.
          </span>
        </div>
      )}

      {grupos.map((grupo) => (
        <div key={grupo.chave} className="mt-5">
          <div className="mb-2.5 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
            {grupo.titulo}
          </div>
          <div className="flex flex-col gap-2.5">
            {grupo.itens.map((linha) => (
              <div
                key={linha.listaItemId}
                className="rounded-[18px] border border-borda bg-superficie p-3.5"
              >
                <div className="flex items-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => linha.ehSugestao && setSheet(linha)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-[15.5px] font-bold text-tinta">
                        {linha.nome}
                      </span>
                      <span className="text-[12.5px] leading-none">
                        {linha.badge}
                      </span>
                    </span>
                  </button>
                  {linha.ehSugestao && (
                    <button
                      type="button"
                      onClick={() => aceitar(linha.listaItemId)}
                      aria-label="Aceitar"
                      className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] bg-acento text-white"
                    >
                      <IconeCheck tamanho={17} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => descartar(linha.listaItemId)}
                    aria-label="Descartar"
                    className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] bg-[#f6f1ea] text-suave-2"
                  >
                    <IconeX tamanho={15} />
                  </button>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    {linha.ehSugestao ? (
                      <button
                        type="button"
                        onClick={() => setSheet(linha)}
                        className="flex items-center gap-1.5 text-left text-suave"
                      >
                        <span className="text-[12.5px] font-medium leading-snug text-suave">
                          {linha.resumo}
                        </span>
                        <span className="flex text-[#c3bbaf]">
                          <IconeInfo tamanho={14} />
                        </span>
                      </button>
                    ) : (
                      <span className="text-[12px] font-semibold text-[#b4aba0]">
                        Adicionado por você
                      </span>
                    )}
                  </div>
                  <div className="flex flex-none items-center rounded-xl bg-[#f6f1ea]">
                    <button
                      type="button"
                      onClick={() => mudarQtd(linha, -1)}
                      aria-label="menos"
                      className="flex h-[34px] w-[34px] items-center justify-center text-[#6e665d]"
                    >
                      <IconeMenos tamanho={15} />
                    </button>
                    <span className="min-w-[64px] text-center text-[13.5px] font-bold text-tinta">
                      {qtdDe(linha)} {linha.qtyText.split(" ").slice(1).join(" ")}
                    </span>
                    <button
                      type="button"
                      onClick={() => mudarQtd(linha, 1)}
                      aria-label="mais"
                      className="flex h-[34px] w-[34px] items-center justify-center text-[#6e665d]"
                    >
                      <IconeMais tamanho={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-superficie px-4 py-4 text-[15px] font-bold text-acento"
        style={{
          border: "1.5px dashed color-mix(in srgb, var(--color-acento) 35%, #fff)",
        }}
      >
        <IconeMais tamanho={17} strokeWidth={2.4} />
        Adicionar item
      </button>

      {/* Saída para o mercado (ADR-015): executar a compra por prateleira. */}
      <Link
        href="/mercado"
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-2xl border border-borda bg-superficie px-4 py-4 text-[15px] font-bold text-acento"
      >
        <span className="text-[17px]">🛒</span>
        Modo Mercado
      </Link>

      {/* Explicação da Sugestão (ADR-008): ações no próprio drawer */}
      <BottomSheet
        aberto={sheet !== null}
        aoFechar={() => setSheet(null)}
        ariaLabel={sheet ? `${sheet.nome} — sugestão` : undefined}
      >
        {sheet && (
          <>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[22px] font-extrabold tracking-tight text-tinta">
                {sheet.nome}
              </span>
              <span className="text-[16px]">{sheet.badge}</span>
            </div>
            <div
              className="mb-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12.5px] font-bold text-acento"
              style={{
                background: "color-mix(in srgb, var(--color-acento) 9%, #fff)",
              }}
            >
              Sugestão · {sheet.resumo}
            </div>
            <p className="mb-5 text-[15.5px] leading-relaxed text-[#544e45]">
              {sheet.explicacao}
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => descartar(sheet.listaItemId)}
                className="flex-1 rounded-[15px] bg-[#f4efe7] px-4 py-4 text-[15.5px] font-bold text-[#6e665d]"
              >
                Dispensar
              </button>
              <button
                type="button"
                onClick={() => aceitar(sheet.listaItemId)}
                className="flex-[1.4] rounded-[15px] bg-acento px-4 py-4 text-[15.5px] font-bold text-white"
              >
                Aceitar
              </button>
            </div>
          </>
        )}
      </BottomSheet>

      {/* Adicionar item manual (ADR-003) */}
      <BottomSheet
        aberto={addOpen}
        aoFechar={() => {
          setAddOpen(false);
          setTermo("");
          setSugestoes([]);
        }}
        ariaLabel="Adicionar item"
      >
        <h2 className="mb-3.5 text-[20px] font-extrabold tracking-tight text-tinta">
          Adicionar item
        </h2>
        <div className="flex items-center gap-2.5 rounded-[15px] border-[1.5px] border-borda-forte bg-superficie px-3.5 py-3 focus-within:border-acento">
          <span className="text-suave-2">
            <IconeLupa tamanho={19} />
          </span>
          <input
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar item…"
            autoFocus
            className="flex-1 bg-transparent text-[16px] text-tinta outline-none"
          />
        </div>
        <div className="mt-3 max-h-[46vh] overflow-y-auto">
          {termo.trim().length < 2 && (
            <div className="py-6 text-center text-[13.5px] text-suave-2">
              Digite ao menos 2 letras para buscar.
            </div>
          )}
          {sugestoes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => adicionar(s.nomeCanonico)}
              className="mb-2 flex w-full items-center justify-between gap-2.5 rounded-[14px] border border-borda bg-superficie p-3.5 text-left"
            >
              <span>
                <span className="block text-[15px] font-bold text-tinta">
                  {s.nomeCanonico}
                </span>
                {s.categoria && (
                  <span className="mt-px block text-[12px] text-suave-2">
                    {s.categoria}
                  </span>
                )}
              </span>
              <span className="flex text-acento">
                <IconeMais tamanho={20} strokeWidth={2.3} />
              </span>
            </button>
          ))}
          {semResultados && (
            <button
              type="button"
              onClick={() => adicionar(termo)}
              className="flex w-full items-center gap-2.5 rounded-[14px] bg-superficie p-3.5 text-left text-[14.5px] font-bold text-acento"
              style={{
                border:
                  "1.5px dashed color-mix(in srgb, var(--color-acento) 32%, #fff)",
              }}
            >
              <IconeMais tamanho={18} strokeWidth={2.3} />
              Adicionar “{termo.trim()}”
            </button>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
