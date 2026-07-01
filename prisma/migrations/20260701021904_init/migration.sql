-- CreateEnum
CREATE TYPE "PapelMorador" AS ENUM ('DONO', 'MEMBRO');

-- CreateEnum
CREATE TYPE "TipoAjuste" AS ENUM ('TEM', 'POUCO', 'ACABOU', 'PRECISO');

-- CreateEnum
CREATE TYPE "OrigemItem" AS ENUM ('SUGESTAO', 'MANUAL');

-- CreateEnum
CREATE TYPE "MotivoSugestao" AS ENUM ('PROVAVELMENTE_ACABANDO', 'RECORRENTE', 'MANUAL');

-- CreateEnum
CREATE TYPE "StatusListaItem" AS ENUM ('ATIVO', 'ACEITO', 'DISPENSADO', 'COMPRADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Casa" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Casa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Morador" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "papel" "PapelMorador" NOT NULL DEFAULT 'MEMBRO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Morador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "nomeCanonico" TEXT NOT NULL,
    "categoria" TEXT,
    "unidadePadrao" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApelidoItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "textoBruto" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApelidoItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Compra" (
    "id" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "valorTotal" DECIMAL(10,2),
    "criadaPorId" TEXT,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Compra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompraItem" (
    "id" TEXT NOT NULL,
    "compraId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "unidade" TEXT,
    "precoUnit" DECIMAL(10,2),

    CONSTRAINT "CompraItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DespensaItem" (
    "id" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "qtdEstimada" DECIMAL(10,3) NOT NULL,
    "confianca" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ultimaCompraEm" TIMESTAMP(3),
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DespensaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AjusteDespensa" (
    "id" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "tipo" "TipoAjuste" NOT NULL,
    "valor" DECIMAL(10,3),
    "em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AjusteDespensa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListaItem" (
    "id" TEXT NOT NULL,
    "casaId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "origem" "OrigemItem" NOT NULL,
    "motivo" "MotivoSugestao",
    "qtdSugerida" DECIMAL(10,3),
    "status" "StatusListaItem" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "Morador_casaId_idx" ON "Morador"("casaId");

-- CreateIndex
CREATE UNIQUE INDEX "Morador_usuarioId_casaId_key" ON "Morador"("usuarioId", "casaId");

-- CreateIndex
CREATE INDEX "Item_casaId_idx" ON "Item"("casaId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_casaId_nomeCanonico_key" ON "Item"("casaId", "nomeCanonico");

-- CreateIndex
CREATE INDEX "ApelidoItem_itemId_idx" ON "ApelidoItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ApelidoItem_itemId_textoBruto_key" ON "ApelidoItem"("itemId", "textoBruto");

-- CreateIndex
CREATE INDEX "Compra_casaId_data_idx" ON "Compra"("casaId", "data");

-- CreateIndex
CREATE INDEX "CompraItem_compraId_idx" ON "CompraItem"("compraId");

-- CreateIndex
CREATE INDEX "CompraItem_itemId_idx" ON "CompraItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "DespensaItem_itemId_key" ON "DespensaItem"("itemId");

-- CreateIndex
CREATE INDEX "DespensaItem_casaId_idx" ON "DespensaItem"("casaId");

-- CreateIndex
CREATE INDEX "AjusteDespensa_casaId_itemId_em_idx" ON "AjusteDespensa"("casaId", "itemId", "em");

-- CreateIndex
CREATE INDEX "ListaItem_casaId_status_idx" ON "ListaItem"("casaId", "status");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Morador" ADD CONSTRAINT "Morador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Morador" ADD CONSTRAINT "Morador_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApelidoItem" ADD CONSTRAINT "ApelidoItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_criadaPorId_fkey" FOREIGN KEY ("criadaPorId") REFERENCES "Morador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraItem" ADD CONSTRAINT "CompraItem_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraItem" ADD CONSTRAINT "CompraItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DespensaItem" ADD CONSTRAINT "DespensaItem_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DespensaItem" ADD CONSTRAINT "DespensaItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjusteDespensa" ADD CONSTRAINT "AjusteDespensa_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AjusteDespensa" ADD CONSTRAINT "AjusteDespensa_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaItem" ADD CONSTRAINT "ListaItem_casaId_fkey" FOREIGN KEY ("casaId") REFERENCES "Casa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListaItem" ADD CONSTRAINT "ListaItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
