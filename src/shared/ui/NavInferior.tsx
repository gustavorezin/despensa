"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconeLista,
  IconeDespensa,
  IconeSacola,
  IconeUsuario,
  IconeMais,
} from "@/shared/ui/icones";

// Bottom tab (4 abas) + FAB central persistente (ADR-001). O FAB fica a 1 toque
// de qualquer aba para registrar uma Compra (fluxo fundacional).
const abas = [
  { href: "/lista", label: "Lista", Icone: IconeLista },
  { href: "/despensa", label: "Despensa", Icone: IconeDespensa },
  { href: "/compras", label: "Compras", Icone: IconeSacola },
  { href: "/conta", label: "Conta", Icone: IconeUsuario },
] as const;

function Aba({
  href,
  label,
  Icone,
  ativo,
}: {
  href: string;
  label: string;
  Icone: (typeof abas)[number]["Icone"];
  ativo: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center gap-1"
      style={{ color: ativo ? "var(--color-acento)" : "#a89f94" }}
    >
      <Icone tamanho={23} />
      <span className="text-[10.5px] font-bold">{label}</span>
    </Link>
  );
}

export function NavInferior() {
  const pathname = usePathname();
  const ativa = (href: string) => pathname.startsWith(href);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-10 flex items-start border-t border-[#eee8df] px-1.5 pt-3"
        style={{
          height: "calc(90px + env(safe-area-inset-bottom))",
          paddingBottom: "env(safe-area-inset-bottom)",
          background: "rgba(251,248,243,.92)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Aba {...abas[0]} ativo={ativa("/lista")} />
        <Aba {...abas[1]} ativo={ativa("/despensa")} />
        <div className="w-16 flex-none" />
        <Aba {...abas[2]} ativo={ativa("/compras")} />
        <Aba {...abas[3]} ativo={ativa("/conta")} />
      </nav>

      <Link
        href="/registrar"
        aria-label="Registrar Compra"
        className="fixed left-1/2 z-20 flex h-[62px] w-[62px] -translate-x-1/2 items-center justify-center rounded-[22px] border-4 text-white"
        style={{
          bottom: "calc(42px + env(safe-area-inset-bottom))",
          background: "var(--color-acento)",
          borderColor: "var(--color-fundo)",
          boxShadow:
            "0 12px 26px color-mix(in srgb, var(--color-acento) 42%, transparent)",
        }}
      >
        <IconeMais tamanho={27} strokeWidth={2.6} />
      </Link>
    </>
  );
}
