import Link from "next/link";

/*
  Estado vazio com CTA (ADR-012). Nenhuma tela do app pode ficar branca ou com
  mensagem sem ação. Usa a primeira pessoa do app quando faz sentido (spec-design §8).
*/
type EstadoVazioProps = {
  emoji: string;
  titulo: React.ReactNode;
  descricao: string;
  ctaTexto: string;
  ctaHref: string;
};

export function EstadoVazio({
  emoji,
  titulo,
  descricao,
  ctaTexto,
  ctaHref,
}: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-12 text-center">
      <div
        className="mb-6 flex h-27 w-27 items-center justify-center rounded-[32px] text-[52px]"
        style={{
          width: 108,
          height: 108,
          background: "color-mix(in srgb, var(--color-acento) 10%, #fff)",
        }}
      >
        {emoji}
      </div>
      <h2 className="mb-2 text-[21px] font-extrabold tracking-tight text-tinta">
        {titulo}
      </h2>
      <p className="mb-7 max-w-[280px] text-[15px] leading-normal text-suave">
        {descricao}
      </p>
      <Link
        href={ctaHref}
        className="w-full rounded-2xl bg-acento px-4 py-4 text-center text-[16px] font-bold text-white"
        style={{
          boxShadow:
            "0 10px 22px color-mix(in srgb, var(--color-acento) 30%, transparent)",
        }}
      >
        {ctaTexto}
      </Link>
    </div>
  );
}
