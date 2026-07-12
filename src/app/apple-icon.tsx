import { ImageResponse } from "next/og";

// Ícone para a tela inicial do iOS. O Safari ignora SVG em apple-touch-icon,
// então geramos um PNG no build. Reusa o mesmo desenho de /public/icon.svg.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const marca = `
<svg width="180" height="180" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#4b44c7"/>
  <g fill="none" stroke="#ffffff" stroke-width="18" stroke-linejoin="round" stroke-linecap="round">
    <rect x="156" y="126" width="200" height="260" rx="24"/>
    <line x1="156" y1="256" x2="356" y2="256"/>
  </g>
  <g fill="#ffffff">
    <rect x="184" y="168" width="54" height="66" rx="13"/>
    <rect x="274" y="168" width="54" height="66" rx="13"/>
    <circle cx="210" cy="322" r="30"/>
    <circle cx="302" cy="322" r="30"/>
  </g>
</svg>`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      // Contexto Satori (ImageResponse), não DOM — next/image não se aplica aqui.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        width={180}
        height={180}
        src={`data:image/svg+xml;utf8,${encodeURIComponent(marca)}`}
        alt="Despensa"
      />
    ),
    size,
  );
}
