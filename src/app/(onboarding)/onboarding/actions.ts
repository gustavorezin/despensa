"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessao } from "@/shared/auth/sessao";
import { criarCasa } from "@/modules/casa/services/criarCasa";
import { prisma } from "@/lib/prisma";

// Nome da pessoa: curto e opcional na action (o "obrigatório" é validado na UI
// do passo 2). Se vier vazio — ex.: "Pular" no login por email — não gravamos,
// e o usuário pode informar depois na tela de Conta.
const nomeUsuarioSchema = z.string().trim().max(40);

/**
 * Conclui o onboarding (ADR-009): grava o nome do usuário (quando informado),
 * cria a Casa e segue para a Lista ou direto ao registro da primeira Compra.
 * Com sessão "database", o próximo request já resolve a `casaId` no callback.
 */
export async function criarCasaAction(
  nomeUsuario: string,
  nomeCasa: string,
  irRegistrar: boolean,
) {
  const sessao = await getSessao();
  if (!sessao?.usuarioId) redirect("/login");

  const nome = nomeUsuarioSchema.parse(nomeUsuario);
  if (nome) {
    await prisma.user.update({
      where: { id: sessao.usuarioId },
      data: { name: nome },
    });
  }

  await criarCasa({ usuarioId: sessao.usuarioId, nome: nomeCasa });
  redirect(irRegistrar ? "/registrar" : "/lista");
}
