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
