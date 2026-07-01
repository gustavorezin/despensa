import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Auth.js (NextAuth v5). Dois provedores do F0: Google e email (magic link
// via Resend). O PrismaAdapter grava usuários/sessões no Postgres, então a
// estratégia de sessão é "database" (usa a tabela Session + VerificationToken).
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Confia no host da requisição. Na Vercel isso é automático; declaramos aqui
  // para o app também rodar em produção self-hosted e na verificação local.
  trustHost: true,
  session: { strategy: "database" },
  providers: [
    Google,
    Resend({ from: process.env.AUTH_EMAIL_FROM }),
  ],
  callbacks: {
    // Enriquece a sessão com o usuário e a Casa ativa. A criação de Casa é do
    // onboarding (Marco 1); aqui fica a plumbing: resolve a primeira Casa em
    // que o usuário é Morador, ou null enquanto ainda não há nenhuma.
    async session({ session, user }) {
      const morador = await prisma.morador.findFirst({
        where: { usuarioId: user.id },
        orderBy: { criadoEm: "asc" },
        select: { casaId: true },
      });
      session.usuarioId = user.id;
      session.casaId = morador?.casaId ?? null;
      return session;
    },
  },
});
