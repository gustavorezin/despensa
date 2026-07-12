import { z } from "zod";
import { CasaRepository } from "@/modules/casa/repository/CasaRepository";

// O nome vem do onboarding (ADR-009). Curto e opcional na prática: se vier
// vazio, adotamos um rótulo neutro em vez de barrar o usuário.
const schema = z.object({
  usuarioId: z.string().min(1),
  nome: z
    .string()
    .trim()
    .max(40, "Nome muito longo.")
    .transform((v) => v || "Minha casa"),
});

/** Caso de uso: criar a Casa do usuário no onboarding. */
export async function criarCasa(entrada: { usuarioId: string; nome: string }) {
  const { usuarioId, nome } = schema.parse(entrada);
  return CasaRepository.criarComDono({ usuarioId, nome });
}
