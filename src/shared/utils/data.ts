/**
 * Data local como "YYYY-MM-DD". Não usar `toISOString()`: em UTC-3, às 22h
 * ela viraria o dia seguinte.
 */
export function dataISOLocal(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** Constrói a data ao meio-dia local — imune a shift de fuso na serialização. */
export function dataDeISOLocal(iso: string): Date {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return new Date(ano, mes - 1, dia, 12, 0, 0);
}

/** Rótulo amigável e doméstico para a data de uma Compra (spec-design §8). */
export function rotularDataCompra(data: Date): string {
  const hoje = new Date();
  const inicio = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dias = Math.round((inicio(hoje) - inicio(data)) / 86_400_000);

  if (dias <= 0) return "Hoje";
  if (dias === 1) return "Ontem";
  if (dias < 7) return `Há ${dias} dias`;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(data);
}
