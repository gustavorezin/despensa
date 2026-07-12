"use client";

// Bottom sheet reutilizável (spec-design §5.2): backdrop + painel slide-up que
// fecha ao tocar fora. Usado no ajuste/estimativa da Despensa e, no Marco 3, na
// explicação de Sugestão.
export function BottomSheet({
  aberto,
  aoFechar,
  children,
}: {
  aberto: boolean;
  aoFechar: () => void;
  children: React.ReactNode;
}) {
  if (!aberto) return null;

  return (
    <>
      <div
        onClick={aoFechar}
        className="fixed inset-0 z-40"
        style={{
          background: "rgba(35,28,20,.42)",
          animation: "despensa-fade-in .18s ease",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md bg-fundo px-5.5 pb-7 pt-2.5"
        style={{
          borderRadius: "28px 28px 0 0",
          animation: "despensa-slide-up .24s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div className="mx-auto mb-4 h-[5px] w-10 rounded-full bg-[#e2dbd0]" />
        {children}
      </div>
    </>
  );
}
