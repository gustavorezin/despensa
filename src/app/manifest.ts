import type { MetadataRoute } from "next";

// Manifest do PWA (Marco 4). O Next serve este arquivo em /manifest.webmanifest
// e injeta o <link rel="manifest"> automaticamente. Cores derivadas dos tokens
// de marca (globals.css): fundo creme, acento indigo.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Despensa",
    short_name: "Despensa",
    description: "Seu assistente de abastecimento doméstico.",
    lang: "pt-BR",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf8f3",
    theme_color: "#fbf8f3",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
