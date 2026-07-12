"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirCasa, getSessao } from "@/shared/auth/sessao";
import { renomearCasa } from "@/modules/casa/services/renomearCasa";
import { prisma } from "@/lib/prisma";

// Nome exibido no perfil. Diferente do onboarding, aqui é edição explícita:
// exigimos algo não-vazio (não faz sentido "salvar" um nome em branco).
const schema = z.string().trim().min(1, "Informe seu nome.").max(40);

/** Atualiza o nome do usuário logado (tela de Conta). */
export async function atualizarNomeUsuario(nome: string) {
  const sessao = await getSessao();
  if (!sessao?.usuarioId) redirect("/login");

  const valor = schema.parse(nome);
  await prisma.user.update({
    where: { id: sessao.usuarioId },
    data: { name: valor },
  });

  // Sessão "database": o card lê User do banco a cada request.
  revalidatePath("/conta");
}

/** Atualiza o nome da Casa ativa (tela de Conta). */
export async function atualizarNomeCasa(nome: string) {
  const { casaId } = await exigirCasa();
  await renomearCasa({ casaId, nome });
  revalidatePath("/conta");
}
