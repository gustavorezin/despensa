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
      <div className="mx-auto max-w-md px-4.5 pt-6 pb-32">{children}</div>
      <NavInferior />
    </div>
  );
}
