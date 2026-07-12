import { exigirCasa } from "@/shared/auth/sessao";
import { NavInferior } from "@/shared/ui/NavInferior";

// Shell autenticado: garante Casa ativa e monta a navegação persistente.
// A área de conteúdo rola sob a tab bar; o espaço inferior deixa passar o FAB.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirCasa();

  return (
    <div className="min-h-full">
      {/* Coluna estreita no mobile; no desktop solta o limite e ocupa a largura
          (sem layout desktop dedicado — só evita a margem enorme dos lados). */}
      <div className="mx-auto max-w-md px-4.5 pt-6 pb-32 md:max-w-3xl md:px-8">
        {children}
      </div>
      <NavInferior />
    </div>
  );
}
