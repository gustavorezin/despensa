import type { DefaultSession } from "next-auth";

// Campos extras que o callback `session` (src/auth.ts) injeta na sessão.
declare module "next-auth" {
  interface Session {
    usuarioId: string;
    casaId: string | null;
    user: DefaultSession["user"];
  }
}
