import { CasaRepository } from "@/modules/casa/repository/CasaRepository";

/** Dados da Casa ativa (nome exibido no cabeçalho da Despensa e na Conta). */
export async function obterCasa({ casaId }: { casaId: string }) {
  return CasaRepository.obterPorId({ id: casaId });
}
