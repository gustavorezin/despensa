import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirCasa } from "@/shared/auth/sessao";
import { obterCompra } from "@/modules/compra/services/obterCompra";
import { comoUnidade } from "@/modules/item/domain/unidades";
import { comoCategoria } from "@/modules/item/domain/categorias";
import { IconeChevronEsquerda } from "@/shared/ui/icones";
import {
  FormularioCompra,
  type ChipCompra,
} from "../../../registrar/FormularioCompra";
import { editarCompraAction } from "../actions";

// Editar Compra (ADR-023): mesmo formulário do registro, pré-preenchido.
// Escopo por Casa: se o id não for da Casa, 404.
export default async function EditarCompraPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { casaId } = await exigirCasa();
  const compra = await obterCompra({ casaId, id });
  if (!compra) notFound();

  const itens: ChipCompra[] = compra.itens.map((it) => ({
    nome: it.nome,
    quantidade: Math.max(1, Math.round(it.quantidade)),
    unidade: comoUnidade(it.unidade),
    categoria: comoCategoria(it.categoria),
  }));

  return (
    <div className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-fundo">
      {/* Mesma coluna do shell: estreita no mobile, larga no desktop. */}
      <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col md:max-w-3xl">
        <div className="flex items-center gap-2.5 px-4.5 pb-2 pt-14">
          <Link
            href={`/compras/${compra.id}`}
            aria-label="Voltar"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#f4efe7] text-tinta"
          >
            <IconeChevronEsquerda tamanho={20} />
          </Link>
          <span className="text-[15px] font-bold text-suave">
            Editar Compra
          </span>
        </div>

        <FormularioCompra
          inicial={{
            descricao: compra.descricao ?? "",
            dataISO: compra.dataISO,
            itens,
          }}
          rotuloConfirmar="Salvar alterações"
          rotuloEnviando="Salvando…"
          aoConfirmar={editarCompraAction.bind(null, compra.id)}
        />
      </div>
    </div>
  );
}
