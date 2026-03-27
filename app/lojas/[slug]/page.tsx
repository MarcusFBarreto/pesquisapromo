import Link from "next/link";
import { notFound } from "next/navigation";
import { districts, getTestShopBySlug } from "@/lib/exploration-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return districts.flatMap((district) =>
    district.shops
      .filter((shop) => shop.slug)
      .map((shop) => ({ slug: shop.slug as string })),
  );
}

export default async function StorePage({ params }: PageProps) {
  const { slug } = await params;
  const result = getTestShopBySlug(slug);

  if (!result) {
    notFound();
  }

  const { district, shop } = result;
  const labBlocks = [
    "Card de oferta com selo e CTA principal",
    "Mini vitrine com variacao de preco simulada",
    "Caixa de missao para testar gamificacao leve",
  ];
  const toyMiniGames = [
    "Jogo da memoria com brinquedos",
    "Gire e descubra a vitrine surpresa",
    "Caca-egg com premio simbolico",
  ];

  return (
    <main className="min-h-screen bg-[var(--pp-cream)] px-6 py-8 text-[var(--pp-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="sticky top-4 z-20">
          <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--pp-line)] bg-white/92 p-4 shadow-[0_18px_40px_rgba(16,37,74,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex rounded-full bg-[var(--pp-orange)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white">
                Lojinha aberta
              </span>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] md:text-base">
                {shop.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${district.type}/${district.slug}`}
                className="inline-flex rounded-full border border-[var(--pp-line)] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] transition hover:border-[var(--pp-blue)]"
              >
                Voltar para {district.title}
              </Link>
              <Link
                href="/"
                className="inline-flex rounded-full bg-[var(--pp-blue)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]"
              >
                Sair da lojinha
              </Link>
            </div>
          </div>
        </div>

        <header className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
            Laboratorio da cidade
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
            {shop.name}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--pp-muted)]">
            {shop.vibe}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.5rem] bg-[var(--pp-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                Rua de origem
              </p>
              <p className="mt-2 text-base leading-8 text-[var(--pp-muted)]">
                {district.title}
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--pp-blue)] p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Oferta piloto
              </p>
              <p className="mt-2 text-base leading-8 text-white/88">
                {shop.offer}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
              Area de testes
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              Um canto seguro para experimentar.
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--pp-muted)]">
              Esta lojinha pode receber novos cards, filtros, botoes, selos,
              componentes e pequenas experiencias sem atrapalhar o restante da
              cidade.
            </p>

            <div className="mt-6 rounded-[1.5rem] bg-[var(--pp-surface)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-orange)]">
                Experimentos sugeridos
              </p>
              <div className="mt-4 grid gap-3">
                {labBlocks.map((block) => (
                  <div
                    key={block}
                    className="rounded-[1.2rem] bg-white px-4 py-3 text-sm text-[var(--pp-muted)]"
                  >
                    {block}
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
              Selo atual
            </p>
            <p className="mt-3 inline-flex rounded-full bg-[rgba(229,93,58,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-orange)]">
              {shop.badge}
            </p>

            <div className="mt-6 flex h-56 items-end justify-center gap-3 rounded-[1.7rem] border border-dashed border-[var(--pp-line)] bg-[linear-gradient(180deg,_#fbf8f3,_#f2ece1)] px-5 pb-5">
              <div className="h-24 w-10 rounded-t-[1rem] bg-[var(--pp-blue)]/18" />
              <div className="h-36 w-12 rounded-t-[1rem] bg-[var(--pp-blue)]/32" />
              <div className="h-44 w-16 rounded-t-[1.1rem] bg-[var(--pp-orange)]/72" />
              <div className="h-28 w-10 rounded-t-[1rem] bg-[var(--pp-blue)]/18" />
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
              Teste de card
            </p>
            <div className="mt-4 rounded-[1.7rem] border border-[var(--pp-line)] bg-[var(--pp-surface)] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold">Card piloto de oferta</p>
                  <p className="mt-1 text-sm text-[var(--pp-muted)]">
                    Uma amostra para validar hierarquia e leitura rapida.
                  </p>
                </div>
                <span className="inline-flex rounded-full bg-[rgba(25,76,160,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-blue)]">
                  prototipo
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-[1.4rem] bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-orange)]">
                    Oferta em destaque
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{shop.offer}</p>
                </div>
                <div className="flex flex-col gap-3 sm:items-end">
                  <button className="rounded-full bg-[var(--pp-blue)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]">
                    Testar CTA
                  </button>
                  <button className="rounded-full border border-[var(--pp-line)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-muted)] transition hover:border-[var(--pp-blue)] hover:text-[var(--pp-blue)]">
                    Guardar modelo
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
              Teste de missao
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
              Pequena gamificacao de laboratorio.
            </h2>
            <div className="mt-5 rounded-[1.5rem] bg-[var(--pp-blue)] p-5 text-white">
              <div className="flex items-center justify-between text-sm">
                <span>Missao da lojinha</span>
                <span>1/3</span>
              </div>
              <div className="mt-3 h-3 rounded-full bg-white/15 p-[2px]">
                <div className="h-full w-1/3 rounded-full bg-white" />
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-[1.1rem] bg-white/10 p-3 text-sm">
                  Testar um card novo
                </div>
                <div className="rounded-[1.1rem] bg-white/10 p-3 text-sm">
                  Comparar duas versoes de CTA
                </div>
                <div className="rounded-[1.1rem] bg-white/10 p-3 text-sm">
                  Marcar esta lojinha como favorita
                </div>
              </div>
            </div>
          </article>
        </section>

        {district.slug === "testes" ? (
          <section className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
                  Simulacao especial
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                  Ensaio para a futura Rua dos Brinquedos.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-8 text-[var(--pp-muted)]">
                Aqui simulamos o encontro entre vitrine real e brincadeira leve:
                uma rua mais colorida, com mini joguinhos gratis e espaco para
                surpresa sem atrapalhar a compra.
              </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[1.8rem] border border-[rgba(229,93,58,0.18)] bg-[linear-gradient(180deg,_#fff6ed,_#fff0e4)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-orange)]">
                  Vitrine ludica
                </p>
                <div className="mt-4 flex h-56 items-end justify-center gap-3 rounded-[1.6rem] border border-dashed border-[rgba(229,93,58,0.2)] bg-white px-5 pb-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--pp-orange)]/18 text-2xl">
                    *
                  </div>
                  <div className="flex h-28 w-24 items-center justify-center rounded-[1.4rem] bg-[var(--pp-blue)]/12 text-3xl">
                    +
                  </div>
                  <div className="flex h-36 w-28 items-center justify-center rounded-[1.6rem] bg-[var(--pp-orange)]/72 text-3xl text-white">
                    o
                  </div>
                  <div className="flex h-24 w-20 items-center justify-center rounded-full bg-[var(--pp-blue)]/18 text-2xl">
                    *
                  </div>
                </div>
                <p className="mt-4 text-sm leading-8 text-[var(--pp-muted)]">
                  A ideia e que esta rua tenha uma energia propria: mais cor,
                  mais curiosidade e pequenas interacoes espalhadas entre as
                  lojinhas.
                </p>
              </article>

              <article className="rounded-[1.8rem] bg-[var(--pp-blue)] p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                  Mini joguinhos gratis
                </p>
                <div className="mt-4 grid gap-3">
                  {toyMiniGames.map((game, index) => (
                    <div
                      key={game}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-[1.15rem] bg-white/10 p-4"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--pp-blue)]">
                        {index + 1}
                      </span>
                      <p className="text-sm leading-7 text-white/88">{game}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.3rem] bg-white/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">
                    Recompensa possivel
                  </p>
                  <p className="mt-2 text-sm leading-7 text-white/88">
                    Ganhar um selo divertido, desbloquear uma vitrine especial
                    ou descobrir um egg escondido na rua.
                  </p>
                </div>
              </article>
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
