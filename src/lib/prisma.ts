import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// No Prisma 7, o PrismaClient conecta ao banco por um driver adapter.
// O `pg` fala Postgres puro, então serve tanto para o banco local (Docker)
// quanto para o Neon em produção — a troca é só a env DATABASE_URL.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL não definida (ver .env.local / .env.example).");
}

const adapter = new PrismaPg({ connectionString });

// Singleton: em dev o hot-reload do Next.js reavalia os módulos e criaria
// várias conexões; reaproveitamos a instância no globalThis.
const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalParaPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
