"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registrarCompraAction } from "./actions";
import {
  IconeX,
  IconeChevronEsquerda,
  IconeChevronDireita,
  IconeLupa,
  IconeMais,
  IconeMenos,
} from "@/shared/ui/icones";

type ItemBusca = { id: string; nomeCanonico: string; categoria: string | null };
type Chip = { nome: string; quantidade: number };

// Registrar Compra manual (ADR-005). Tela cheia sobre o shell: passo "como
// registrar" → busca com autocomplete (2º caractere) → chips com quantidade.
export default function RegistrarPage() {
  const router = useRouter();
  const [passo, setPasso] = useState<"escolher" | "manual">("escolher");
  const [termo, setTermo] = useState("");
  const [sugestoes, setSugestoes] = useState<ItemBusca[]>([]);
  const [chips, setChips] = useState<Chip[]>([]);
  const [enviando, iniciar] = useTransition();

  // Autocomplete: busca nos Itens da Casa a partir do 2º caractere, com debounce.
  useEffect(() => {
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
        /* aborto ou rede — ignora */
      }
    }, 200);
    return () => {
      clearTimeout(t);
      controlador.abort();
    };
  }, [termo]);

  const jaAdicionado = (nome: string) =>
    chips.some((c) => c.nome.toLowerCase() === nome.toLowerCase());

  const sugestoesFiltradas = sugestoes.filter((s) => !jaAdicionado(s.nomeCanonico));
  const semResultados = termo.trim().length >= 2 && sugestoesFiltradas.length === 0;

  function adicionar(nome: string) {
    const limpo = nome.trim();
    if (!limpo || jaAdicionado(limpo)) {
      setTermo("");
      return;
    }
    setChips((cs) => [...cs, { nome: limpo, quantidade: 1 }]);
    setTermo("");
  }

  function ajustarQtd(nome: string, delta: number) {
    setChips((cs) =>
      cs.map((c) =>
        c.nome === nome
          ? { ...c, quantidade: Math.max(1, c.quantidade + delta) }
          : c,
      ),
    );
  }

  function remover(nome: string) {
    setChips((cs) => cs.filter((c) => c.nome !== nome));
  }

  function fechar() {
    if (passo === "manual") {
      setPasso("escolher");
      setTermo("");
    } else {
      router.push("/lista");
    }
  }

  function confirmar() {
    if (!chips.length) return;
    iniciar(() => {
      registrarCompraAction({ itens: chips });
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-fundo">
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
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="px-5.5 pt-2">
            <div className="flex items-center gap-2.5 rounded-[15px] border-[1.5px] border-borda-forte bg-superficie px-3.5 py-3 focus-within:border-acento">
              <span className="text-suave-2">
                <IconeLupa tamanho={19} />
              </span>
              <input
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar item para adicionar…"
                autoFocus
                className="flex-1 bg-transparent text-[16px] text-tinta outline-none"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5.5 pt-2">
            {sugestoesFiltradas.map((s) => (
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

            {chips.length > 0 ? (
              <>
                <div className="mb-2.5 mt-4.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
                  Nesta Compra · {chips.length}
                </div>
                <div className="flex flex-col gap-2 pb-2">
                  {chips.map((c) => (
                    <div
                      key={c.nome}
                      className="flex items-center gap-2.5 rounded-[14px] py-2 pl-3.5 pr-2.5"
                      style={{
                        background:
                          "color-mix(in srgb, var(--color-acento) 6%, #fff)",
                        border:
                          "1px solid color-mix(in srgb, var(--color-acento) 16%, #fff)",
                      }}
                    >
                      <span className="flex-1 text-[15px] font-bold text-tinta">
                        {c.nome}
                      </span>
                      <div
                        className="flex items-center rounded-[11px] bg-superficie"
                        style={{
                          border:
                            "1px solid color-mix(in srgb, var(--color-acento) 18%, #fff)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => ajustarQtd(c.nome, -1)}
                          aria-label="menos"
                          className="flex h-8 w-8 items-center justify-center text-[#6e665d]"
                        >
                          <IconeMenos tamanho={14} />
                        </button>
                        <span className="min-w-[26px] text-center text-[14px] font-bold text-tinta">
                          {c.quantidade}
                        </span>
                        <button
                          type="button"
                          onClick={() => ajustarQtd(c.nome, 1)}
                          aria-label="mais"
                          className="flex h-8 w-8 items-center justify-center text-[#6e665d]"
                        >
                          <IconeMais tamanho={14} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remover(c.nome)}
                        aria-label="Remover"
                        className="flex h-[30px] w-[30px] items-center justify-center text-suave-2"
                      >
                        <IconeX tamanho={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              !semResultados &&
              termo.trim().length < 2 && (
                <div className="px-2.5 py-8 text-center text-[13.5px] text-suave-2">
                  Busque acima e toque para adicionar itens à Compra.
                </div>
              )
            )}
          </div>

          <div className="border-t border-[#eee8df] bg-fundo px-5.5 pb-7 pt-3">
            <button
              type="button"
              onClick={confirmar}
              disabled={chips.length === 0 || enviando}
              className="w-full rounded-2xl px-4 py-4 text-[16px] font-bold text-white transition-colors"
              style={{
                background:
                  chips.length === 0 ? "#cfc7bb" : "var(--color-acento)",
              }}
            >
              {enviando
                ? "Registrando…"
                : chips.length > 0
                  ? `Registrar Compra · ${chips.length}`
                  : "Registrar Compra"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
