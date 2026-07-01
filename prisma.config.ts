import path from "node:path";
import { config as carregarEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

// A partir do Prisma 7, com um arquivo de config presente, o Prisma NÃO carrega
// os arquivos .env automaticamente — nós controlamos a ordem aqui.
//
// Mesma precedência do Next.js: .env.local (dev/segredos) vence .env (padrões).
// O dotenv não sobrescreve variáveis já definidas, então carregar .env.local
// PRIMEIRO garante sua prioridade. Em produção (Vercel/Neon) estes arquivos não
// existem e DATABASE_URL já vem do ambiente.
carregarEnv({ path: path.resolve(process.cwd(), ".env.local") });
carregarEnv({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
