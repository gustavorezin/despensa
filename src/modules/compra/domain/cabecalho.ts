import { dataDeISOLocal, dataISOLocal } from "@/shared/utils/data";

/**
 * Resolve o cabeçalho da Compra a partir da entrada já validada: descrição
 * vazia vira null, data ausente vira `hoje`, data futura é proibida (ADR-021).
 * A comparação é por dia de calendário local ("YYYY-MM-DD" ordena lexicamente).
 */
export function resolverCabecalho(
  entrada: { descricao?: string; data?: string },
  hoje = new Date(),
): { descricao: string | null; data: Date } {
  if (entrada.data && entrada.data > dataISOLocal(hoje)) {
    throw new Error("A data da Compra não pode ser no futuro.");
  }
  return {
    descricao: entrada.descricao ? entrada.descricao : null,
    data: entrada.data ? dataDeISOLocal(entrada.data) : hoje,
  };
}
