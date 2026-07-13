import Link from "next/link";
import { IconeChevronEsquerda } from "@/shared/ui/icones";

// Dicas de uso (ADR-025): página estática, conteúdo puro — sem tour guiado,
// sem estado de leitura. Primeira pessoa do app, tom doméstico (spec-design §8).

const PASSOS: { numero: string; titulo: string; texto: string }[] = [
  {
    numero: "1",
    titulo: "Você registra a Compra",
    texto:
      "Chegou do mercado? Toque no botão verde e adicione o que comprou. É a única coisa que eu realmente preciso de você — leva 1 ou 2 minutos.",
  },
  {
    numero: "2",
    titulo: "Eu estimo sua Despensa",
    texto:
      "A partir das Compras, calculo o que provavelmente ainda tem na sua casa. É uma estimativa, não uma contagem — e eu sou honesto sobre a minha certeza.",
  },
  {
    numero: "3",
    titulo: "A Lista sugere o que está acabando",
    texto:
      "Conforme o tempo passa e você registra mais, aprendo o ritmo de cada item e sugiro a reposição na hora certa — sempre com o motivo explicado.",
  },
];

const SEMAFORO: { cor: string; rotulo: string; texto: string }[] = [
  {
    cor: "#2E9E6B",
    rotulo: "Verde — tenho",
    texto: "Estimativa confiável: compra recente ou você confirmou com “Tem”.",
  },
  {
    cor: "#E0A11A",
    rotulo: "Amarelo — talvez",
    texto: "Já faz um tempo desde a última compra; posso estar desatualizado.",
  },
  {
    cor: "#D7553B",
    rotulo: "Vermelho — no fim",
    texto:
      "Pouco histórico ou muito tempo sem sinal. Um toque seu me recalibra.",
  },
];

const TELAS: {
  emoji: string;
  titulo: string;
  oQueE: string;
  facaIsso: string[];
}[] = [
  {
    emoji: "✍️",
    titulo: "Registrar",
    oQueE: "O coração do app — cada Compra registrada me deixa mais esperto.",
    facaIsso: [
      "Busque o item e toque para adicionar; a partir da 2ª letra eu completo.",
      "Toque no nome do item no chip para definir unidade e categoria. É opcional, mas organiza a Despensa por prateleira.",
      "Esqueceu de registrar no dia? Troque a data da Compra para quando ela aconteceu — a cronologia certa melhora o aprendizado.",
      "Dê um nome à Compra (“Mercado Extra”, “churrasco de sábado”) para reconhecê-la depois no histórico.",
    ],
  },
  {
    emoji: "🥫",
    titulo: "Despensa",
    oQueE:
      "Minha estimativa do que tem na sua casa, agrupada por categoria, com o semáforo de confiança ao lado.",
    facaIsso: [
      "Notou diferença da prateleira real? Toque no item e use Tem, Pouco ou Acabou — 2 toques e eu me recalibro.",
      "“Tem” também é informação: confirma minha estimativa e sobe a confiança.",
      "No mesmo painel dá para ajustar a unidade e a categoria do item.",
    ],
  },
  {
    emoji: "📝",
    titulo: "Lista",
    oQueE:
      "Suas compras futuras: minhas Sugestões (🤖) e o que você adicionou (✋), agrupadas pelo motivo.",
    facaIsso: [
      "Toque no ⓘ para ver por que sugeri — nunca é caixa-preta.",
      "Sugestão que não faz sentido? Dispense sem dó: isso também me ensina.",
      "Aceite ou edite a quantidade do que você vai comprar de verdade.",
    ],
  },
  {
    emoji: "🧾",
    titulo: "Compras",
    oQueE: "Seu histórico — a memória que alimenta todo o aprendizado.",
    facaIsso: [
      "Errou item, quantidade ou data? Abra a Compra e edite; eu recalculo a Despensa e as Sugestões sozinho.",
      "Compra duplicada ou de teste? Exclua — os dados derivados se ajustam.",
    ],
  },
];

const NAO_PRECISA: string[] = [
  "Registrar consumo no dia a dia (“usei 2 ovos hoje”) — eu deduzo pelo ritmo das Compras.",
  "Contar o que tem na prateleira — estimativa útil vale mais que precisão perfeita.",
  "Categorizar tudo — item sem categoria funciona normalmente, só fica no grupo “Sem categoria”.",
  "Registrar no momento exato — dá para lançar depois com a data certa.",
];

export default function DicasPage() {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <Link
          href="/conta"
          aria-label="Voltar"
          className="flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#f4efe7] text-tinta"
        >
          <IconeChevronEsquerda tamanho={20} />
        </Link>
        <span className="text-[15px] font-bold text-suave">Conta</span>
      </div>

      <h1 className="mt-3 text-[25px] font-extrabold tracking-tight text-tinta">
        Dicas de uso
      </h1>
      <p className="mb-6 mt-1 text-[14.5px] leading-relaxed text-suave">
        Eu não sou uma planilha de estoque — sou um assistente que aprende com
        o seu uso. Entenda o ciclo e você tira o máximo de mim com o mínimo de
        esforço.
      </p>

      {/* Como funciona */}
      <div className="mb-2.5 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Como eu funciono
      </div>
      <div className="overflow-hidden rounded-[18px] border border-borda bg-superficie">
        {PASSOS.map((p, idx) => (
          <div
            key={p.numero}
            className="flex gap-3.5 p-4"
            style={{
              borderBottom:
                idx === PASSOS.length - 1 ? "none" : "1px solid #f4efe8",
            }}
          >
            <span
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[15px] font-extrabold text-acento"
              style={{
                background: "color-mix(in srgb, var(--color-acento) 10%, #fff)",
              }}
            >
              {p.numero}
            </span>
            <span className="min-w-0">
              <span className="block text-[15px] font-extrabold text-tinta">
                {p.titulo}
              </span>
              <span className="mt-1 block text-[14px] leading-relaxed text-suave">
                {p.texto}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Semáforo */}
      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        O semáforo da Despensa
      </div>
      <div className="rounded-[18px] border border-borda bg-superficie p-4">
        <p className="mb-3 text-[14px] leading-relaxed text-suave">
          A bolinha ao lado de cada item não é a quantidade — é o quanto eu
          confio na minha própria estimativa:
        </p>
        <div className="flex flex-col gap-2.5">
          {SEMAFORO.map((s) => (
            <div key={s.rotulo} className="flex items-start gap-2.5">
              <span
                className="mt-1 h-3 w-3 flex-none rounded-full"
                style={{ background: s.cor }}
              />
              <span className="min-w-0 text-[14px] leading-relaxed text-suave">
                <span className="font-bold text-tinta">{s.rotulo}.</span>{" "}
                {s.texto}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Por tela */}
      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        Tela por tela
      </div>
      <div className="flex flex-col gap-2.5">
        {TELAS.map((t) => (
          <div
            key={t.titulo}
            className="rounded-[18px] border border-borda bg-superficie p-4"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[18px]">{t.emoji}</span>
              <span className="text-[15px] font-extrabold text-tinta">
                {t.titulo}
              </span>
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-suave">
              {t.oQueE}
            </p>
            <ul className="mt-2.5 flex flex-col gap-2">
              {t.facaIsso.map((dica) => (
                <li key={dica} className="flex items-start gap-2">
                  <span className="mt-[7px] h-[5px] w-[5px] flex-none rounded-full bg-acento" />
                  <span className="text-[14px] leading-relaxed text-suave">
                    {dica}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* O que não precisa */}
      <div className="mb-2.5 mt-6 pl-0.5 text-[12.5px] font-bold uppercase tracking-wide text-suave-2">
        O que você NÃO precisa fazer
      </div>
      <div className="rounded-[18px] border border-borda bg-superficie p-4">
        <ul className="flex flex-col gap-2">
          {NAO_PRECISA.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="text-[14px]">🙅</span>
              <span className="text-[14px] leading-relaxed text-suave">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fechamento */}
      <div
        className="mt-6 rounded-[18px] p-4"
        style={{
          background: "color-mix(in srgb, var(--color-acento) 7%, #fff)",
          border:
            "1px solid color-mix(in srgb, var(--color-acento) 18%, #fff)",
        }}
      >
        <p className="text-[14px] leading-relaxed text-tinta">
          <span className="font-extrabold">Uma coisa por fim:</span> nas
          primeiras semanas eu erro mais — ainda estou aprendendo o ritmo da
          sua casa. Cada Compra registrada e cada ajuste me deixam mais
          preciso. Em poucas semanas, a Lista começa a parecer que leu sua
          mente. 😉
        </p>
      </div>
    </>
  );
}
