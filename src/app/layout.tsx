import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Despensa",
  description: "Seu assistente de abastecimento doméstico.",
  applicationName: "Despensa",
  // Declarar `icons` manualmente sobrescreve as convenções de arquivo, então o
  // apple-touch-icon (gerado por apple-icon.tsx) precisa ser listado aqui também.
  icons: {
    icon: "/icon.svg",
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  // Instalável como PWA em standalone; barra de status combina com o fundo.
  appleWebApp: {
    capable: true,
    title: "Despensa",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Sem `maximumScale`: travar o zoom prejudica acessibilidade (WCAG 1.4.4).
  themeColor: "#fbf8f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      {/* Extensões de navegador injetam atributos no <body> (ex.: cz-shortcut-listen),
          causando aviso de hydration inofensivo — suprimimos só neste nível. */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
