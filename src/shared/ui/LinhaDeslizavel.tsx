"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { IconeX } from "./icones";

const LIMIAR = 80; // px de arrasto para a esquerda que confirmam o dispensar

/**
 * Envolve uma linha e permite dispensá-la arrastando para a esquerda (ADR-013,
 * spec-design §7.1). Sem dependência de gesto: usa Pointer Events, trava a
 * direção (rolagem vertical continua nativa) e suprime o clique após um swipe
 * real, para não disparar os botões internos da linha.
 */
export function LinhaDeslizavel({
  aoDispensar,
  rotulo = "Dispensar",
  className = "",
  style,
  children,
}: {
  aoDispensar: () => void;
  rotulo?: string;
  /** Aplicadas à camada da frente (o card em si): borda, fundo, padding. */
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const [dx, setDx] = useState(0);
  const [transicao, setTransicao] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const g = useRef({ x0: 0, y0: 0, dir: "" as "" | "h" | "v", swipe: false, dx: 0 });

  function aoBaixar(e: PointerEvent<HTMLDivElement>) {
    if (saindo) return;
    g.current = { x0: e.clientX, y0: e.clientY, dir: "", swipe: false, dx: 0 };
    setTransicao(false);
  }

  function aoMover(e: PointerEvent<HTMLDivElement>) {
    if (saindo) return;
    const st = g.current;
    const ddx = e.clientX - st.x0;
    const ddy = e.clientY - st.y0;
    if (st.dir === "") {
      if (Math.abs(ddx) < 8 && Math.abs(ddy) < 8) return;
      st.dir = Math.abs(ddx) > Math.abs(ddy) ? "h" : "v";
      if (st.dir === "h") e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (st.dir === "h") {
      e.preventDefault();
      st.swipe = true;
      st.dx = Math.min(0, ddx);
      setDx(st.dx);
    }
  }

  function aoSoltar() {
    if (saindo) return;
    const st = g.current;
    setTransicao(true);
    if (st.dir === "h" && st.dx <= -LIMIAR) {
      setSaindo(true);
      window.setTimeout(aoDispensar, 220);
    } else {
      setDx(0);
    }
  }

  function aoClicarCapturando(e: React.MouseEvent) {
    if (g.current.swipe) {
      e.preventDefault();
      e.stopPropagation();
      g.current.swipe = false;
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[18px]">
      {/* Fundo revelado ao arrastar — tom quente discreto, sem alarme. */}
      <div
        className="absolute inset-0 flex items-center justify-end gap-1.5 pr-5"
        style={{
          background: "color-mix(in srgb, #d7553b 10%, #fff)",
          color: "#c2503a",
        }}
        aria-hidden
      >
        <IconeX tamanho={16} />
        <span className="text-[13px] font-bold">{rotulo}</span>
      </div>

      <div
        className={`relative touch-pan-y ${className}`}
        style={{
          ...style,
          transform: saindo ? "translateX(-110%)" : `translateX(${dx}px)`,
          opacity: saindo ? 0 : 1,
          transition: transicao
            ? "transform .22s ease, opacity .22s ease"
            : "none",
        }}
        onPointerDown={aoBaixar}
        onPointerMove={aoMover}
        onPointerUp={aoSoltar}
        onPointerCancel={aoSoltar}
        onClickCapture={aoClicarCapturando}
      >
        {children}
      </div>
    </div>
  );
}
