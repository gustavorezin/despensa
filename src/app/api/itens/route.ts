import { NextResponse } from "next/server";
import { getSessao } from "@/shared/auth/sessao";
import { buscarItens } from "@/modules/item/services/buscarItens";

/**
 * Leitura para o autocomplete do registro manual (ADR-005). Route Handler
 * (não Server Action) por ser leitura consumida pelo cliente — ver §1 da spec.
 * GET /api/itens?termo=arr
 */
export async function GET(req: Request) {
  const sessao = await getSessao();
  if (!sessao?.casaId) {
    return NextResponse.json({ itens: [] }, { status: 401 });
  }

  const termo = new URL(req.url).searchParams.get("termo") ?? "";
  const itens = await buscarItens({ casaId: sessao.casaId, termo });
  return NextResponse.json({ itens });
}
