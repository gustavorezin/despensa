import type { SVGProps } from "react";

/*
  Ícones de traço (stroke) do app, extraídos do protótipo de alta fidelidade.
  Todos herdam `currentColor`, então a cor vem do `text-*` do elemento pai.
*/

type IconeProps = SVGProps<SVGSVGElement> & { tamanho?: number };

function base(tamanho: number, props: SVGProps<SVGSVGElement>) {
  return {
    width: tamanho,
    height: tamanho,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    ...props,
  };
}

export function IconeLista({ tamanho = 23, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={1.9}>
      <path d="M9 6h11M9 12h11M9 18h11" strokeLinecap="round" />
      <circle cx="4.6" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4.6" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="4.6" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconeDespensa({ tamanho = 23, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={1.9}>
      <path d="M4 8l8-3.2L20 8v8.4L12 19.8 4 16.4z" strokeLinejoin="round" />
      <path d="M4 8l8 3 8-3M12 11v8.8" strokeLinejoin="round" />
    </svg>
  );
}

export function IconeSacola({ tamanho = 23, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={1.9}>
      <path d="M6.5 8h11l-1 11.5H7.5z" strokeLinejoin="round" />
      <path d="M9.3 8a2.7 2.7 0 0 1 5.4 0" strokeLinecap="round" />
    </svg>
  );
}

export function IconeUsuario({ tamanho = 23, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={1.9}>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" strokeLinecap="round" />
    </svg>
  );
}

export function IconeMais({ tamanho = 24, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={2.4} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconeMenos({ tamanho = 24, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={2.4} strokeLinecap="round">
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconeX({ tamanho = 20, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={2.2} strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconeCheck({ tamanho = 18, ...props }: IconeProps) {
  return (
    <svg
      {...base(tamanho, props)}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function IconeChevronDireita({ tamanho = 18, ...props }: IconeProps) {
  return (
    <svg
      {...base(tamanho, props)}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconeChevronEsquerda({ tamanho = 20, ...props }: IconeProps) {
  return (
    <svg
      {...base(tamanho, props)}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconeLupa({ tamanho = 19, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={2} strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconeInfo({ tamanho = 17, ...props }: IconeProps) {
  return (
    <svg {...base(tamanho, props)} strokeWidth={1.9}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11.2v5" strokeLinecap="round" />
      <circle cx="12" cy="7.7" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}
