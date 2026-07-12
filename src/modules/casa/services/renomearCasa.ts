import { z } from "zod";
import { CasaRepository } from "@/modules/casa/repository/CasaRepository";

// Renomear é edição explícita (tela de Conta): diferente do onboarding, aqui
// exigimos um nome não-vazio — não faz sentido "salvar" um nome em branco.
const schema = z.object({
  casaId: z.string().min(1),
  nome: z.string().trim().min(1, "Informe o nome da Casa.").max(40, "Nome muito longo."),
});

/** Caso de uso: alterar o nome da Casa ativa. */
export async function renomearCasa(entrada: { casaId: string; nome: string }) {
  const { casaId, nome } = schema.parse(entrada);
  return CasaRepository.renomear({ id: casaId, nome });
}
