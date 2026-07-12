import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

// Testes de domínio puro (ver skill "testes-unitarios" e docs/spec-tecnica §2).
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
});
