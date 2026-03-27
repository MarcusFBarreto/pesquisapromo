import Link from "next/link";
import {
  cityRoutes,
  districts,
  featuredDeals,
  missions,
  steps,
  testShops,
} from "@/lib/exploration-data";

export default function Home() {
  const taxiProducts = Array.from(
    new Map(
      districts.flatMap((district) =>
        district.shops.flatMap((shop) =>
          (shop.products ?? []).map((product) => [
            product,
            {
              product,
              stores: district.shops
                .filter((item) => item.products?.includes(product))
                .map((item) => item.name)
                .join(", "),
            },
          ]),
        ),
      ),
    ).values(),
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[var(--pp-cream)] text-[var(--pp-ink)]">
      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-8 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top_left,_rgba(25,76,160,0.22),_transparent_48%)]" />

        <header className="relative flex flex-col gap-6 rounded-[2rem] border border-[var(--pp-line)] bg-white/82 px-6 py-6 shadow-[0_28px_90px_rgba(16,37,74,0.08)] backdrop-blur md:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded-full border-[10px] border-[var(--pp-blue)] bg-white shadow-[inset_0_0_0_6px_rgba(229,93,58,0.08)]">
                  <div className="absolute left-[2.8rem] top-[2.8rem] h-10 w-16 rounded-full bg-[var(--pp-blue)]" />
                  <div className="absolute inset-[0.95rem] rounded-full border-2 border-dashed border-[var(--pp-blue-soft)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[var(--pp-blue)]">
                    PesquisaPromo
                  </p>
                  <p className="text-sm text-[var(--pp-muted)]">
                    Lojas virtuais, promocoes reais.
                  </p>
                </div>
              </div>

              <span className="inline-flex rounded-full border border-[var(--pp-line)] bg-[var(--pp-warm)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--pp-blue)]">
                Lojas virtuais, promocoes reais.
              </span>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-balance sm:text-5xl lg:text-7xl">
                Encontre precos melhores e promocoes de verdade.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--pp-muted)] sm:text-lg">
                A proposta e ajudar voce a passear por ruas cheias de lojinhas,
                comparar ofertas da sua regiao e achar oportunidades boas sem
                virar um trabalhão.
              </p>
            </div>

            <div className="grid gap-3 rounded-[1.75rem] bg-[var(--pp-blue)] p-5 text-white md:min-w-[19rem]">
              <p className="text-sm uppercase tracking-[0.22em] text-white/72">
                Do seu jeito
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 px-3 py-4">
                  <p className="text-2xl font-semibold">5</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/72">
                    Ofertas
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-4">
                  <p className="text-2xl font-semibold">10</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/72">
                    Parceiros
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-3 py-4">
                  <p className="text-2xl font-semibold">20</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/72">
                    Alertas
                  </p>
                </div>
              </div>
              <p className="text-sm leading-7 text-white/78">
                Nada de poluicao. So o que ajuda voce a decidir melhor.
              </p>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.75rem] border border-[var(--pp-line)] bg-[var(--pp-surface)] p-4 md:grid-cols-[1.15fr_0.85fr] md:p-5">
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--pp-muted)]">
                O que voce quer encontrar?
              </label>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  className="h-14 flex-1 rounded-full border border-[var(--pp-line)] bg-white px-5 text-base outline-none transition focus:border-[var(--pp-blue)] focus:ring-4 focus:ring-[rgba(25,76,160,0.14)]"
                  placeholder="Ex.: smart tv 50, cimento, caderno, ar-condicionado"
                />
                <button className="h-14 rounded-full bg-[var(--pp-orange)] px-7 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#cc4f2f]">
                  Buscar ofertas
                </button>
              </div>
            </div>

            <div className="grid gap-3 rounded-[1.35rem] bg-white px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--pp-muted)]">
                  Taxi virtual
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--pp-muted)]">
                  Digite o nome da loja, da rua ou um endereco da cidade para ir
                  direto sem precisar passear.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <input
                  list="taxi-products"
                  className="h-12 rounded-full border border-[var(--pp-line)] bg-[var(--pp-surface)] px-4 text-sm outline-none transition focus:border-[var(--pp-blue)] focus:ring-4 focus:ring-[rgba(25,76,160,0.14)]"
                  placeholder="Ex.: air fryer, tenis urbano, sandalia rasteira"
                />
                <datalist id="taxi-products">
                  {taxiProducts.map((item) => (
                    <option
                      key={item.product}
                      value={item.product}
                    >{`${item.product} - ${item.stores}`}</option>
                  ))}
                </datalist>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="h-11 rounded-full bg-[var(--pp-blue)] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]">
                    Me leve ate la
                  </button>
                  <button className="h-11 rounded-full border border-[var(--pp-line)] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-muted)] transition hover:border-[var(--pp-blue)] hover:text-[var(--pp-blue)]">
                    Ver sugestoes
                  </button>
                </div>
              </div>

              <p className="text-xs leading-6 text-[var(--pp-muted)]">
                Teste atual: autocomplete por produto. Depois o taxi pode ligar
                o produto as lojas e enderecos da cidade.
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
                Um portal para explorar
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                Como se voce entrasse numa cidade cheia de ruas e vitrines.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--pp-muted)]">
              Em vez de um site frio, a ideia e passar a sensacao de passeio:
              varios caminhos, varias vitrines e sempre alguma coisa nova para
              olhar com calma.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {districts.map((district, index) => (
              <Link
                href={`/${district.type}/${district.slug}`}
                key={district.title}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--pp-line)] bg-[var(--pp-surface)] p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,37,74,0.08)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-[rgba(25,76,160,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                    {district.type === "ruas"
                      ? `Rua ${index + 1}`
                      : "Avenida"}
                  </span>
                  <span className="text-sm font-medium text-[var(--pp-muted)]">
                    {district.count}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-semibold">{district.title}</h3>
                  <p className="text-sm leading-7 text-[var(--pp-muted)]">
                    {district.subtitle}
                  </p>
                  {district.slug === "testes" ? (
                    <p className="inline-flex rounded-full bg-[rgba(229,93,58,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-orange)]">
                      Nosso laboratorio
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 flex items-end gap-3">
                  <div className="h-16 w-10 rounded-t-[1.2rem] bg-[var(--pp-blue)]/16" />
                  <div className="h-24 w-12 rounded-t-[1.2rem] bg-[var(--pp-blue)]/28" />
                  <div className="h-20 w-11 rounded-t-[1.2rem] bg-[var(--pp-orange)]/24" />
                  <div className="h-28 w-14 rounded-t-[1.2rem] bg-[var(--pp-blue)]" />
                  <div className="h-16 w-10 rounded-t-[1.2rem] bg-[var(--pp-blue)]/16" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
                  Mapa da exploracao
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Um mapa leve, divertido e cheio de caminhos.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[var(--pp-muted)]">
                Aqui a pessoa nao entra so para buscar. Ela tambem pode passear,
                descobrir e voltar para as ruas que mais gosta.
              </p>
            </div>

            <div className="mt-6 rounded-[1.8rem] border border-[var(--pp-line)] bg-[linear-gradient(180deg,_#f9f6f0,_#f1ede5)] p-5">
              <div className="grid gap-4">
                {cityRoutes.map((route) => (
                  <div key={route.name} className="rounded-[1.4rem] bg-white/80 p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-lg font-semibold">{route.name}</p>
                        <p className="text-sm text-[var(--pp-muted)]">
                          {route.detail}
                        </p>
                      </div>
                      <span className="inline-flex rounded-full border border-[var(--pp-line)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-muted)]">
                        {route.label}
                      </span>
                    </div>
                    <div className="mt-4 h-4 rounded-full bg-[rgba(25,76,160,0.08)] p-[3px]">
                      <div
                        className={`${route.width} ${route.accent} h-full rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6">
            <article className="rounded-[2rem] bg-[var(--pp-blue)] p-6 text-white shadow-[0_20px_60px_rgba(16,37,74,0.15)] md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                Sua jornada
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Um empurraozinho para explorar mais.
              </h2>
              <div className="mt-5 rounded-[1.5rem] bg-white/10 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>3 de 12 ruas visitadas</span>
                  <span>25%</span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-white/15 p-[2px]">
                  <div className="h-full w-1/4 rounded-full bg-white" />
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {missions.map((mission, index) => (
                  <div
                    key={mission}
                    className="grid grid-cols-[auto_1fr] gap-3 rounded-[1.2rem] bg-white/10 p-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--pp-blue)]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-7 text-white/88">{mission}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
                Piloto local
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Horizonte, Ceara, ja entrou no mapa.
              </h2>
              <p className="mt-4 text-sm leading-8 text-[var(--pp-muted)]">
                O principal agora ja carrega uma primeira leva de lojinhas e
                servicos inspirados em Horizonte. A ideia e misturar o que foi
                encontrado em fontes publicas com o que ainda esta em observacao.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/ruas/servicos"
                  className="rounded-full bg-[var(--pp-blue)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]"
                >
                  Abrir Rua dos Servicos
                </Link>
                <Link
                  href="/ruas/casa"
                  className="rounded-full border border-[var(--pp-line)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-muted)] transition hover:border-[var(--pp-blue)] hover:text-[var(--pp-blue)]"
                >
                  Ver Rua da Casa
                </Link>
              </div>
            </article>
          </section>
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
                Segunda camada simulada
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] md:text-3xl">
                Como se voce entrasse nas lojinhas da rua.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[var(--pp-muted)]">
              Esta area simula o proximo passo da navegacao: depois da rua, a
              pessoa encontra vitrines menores, cada uma com sua cara, seu
              ritmo e suas ofertas.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {testShops.map((shop) => (
              <article
                key={shop.name}
                className="rounded-[1.75rem] border border-[var(--pp-line)] bg-[var(--pp-surface)] p-5 transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(16,37,74,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold">{shop.name}</p>
                    <p className="mt-1 text-sm text-[var(--pp-muted)]">
                      {shop.street}
                    </p>
                  </div>
                  <span className="inline-flex rounded-full bg-[rgba(229,93,58,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pp-orange)]">
                    {shop.badge}
                  </span>
                </div>

                <div className="mt-5 grid gap-5 md:grid-cols-[132px_1fr]">
                  <div className="flex h-32 items-end justify-center gap-2 rounded-[1.4rem] border border-dashed border-[var(--pp-line)] bg-white px-4 pb-4">
                    <div className="h-14 w-7 rounded-t-[0.8rem] bg-[var(--pp-blue)]/20" />
                    <div className="h-20 w-8 rounded-t-[0.8rem] bg-[var(--pp-blue)]/35" />
                    <div className="h-24 w-10 rounded-t-[0.9rem] bg-[var(--pp-orange)]/70" />
                    <div className="h-16 w-7 rounded-t-[0.8rem] bg-[var(--pp-blue)]/20" />
                  </div>

                  <div>
                    <p className="text-sm leading-7 text-[var(--pp-muted)]">
                      {shop.vibe}
                    </p>
                    <div className="mt-4 rounded-[1.2rem] bg-white px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                        Oferta chamando atencao
                      </p>
                      <p className="mt-2 text-base font-medium">{shop.offer}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-full bg-[var(--pp-blue)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#123a7e]">
                    Entrar na lojinha
                  </button>
                  <button className="rounded-full border border-[var(--pp-line)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-muted)] transition hover:border-[var(--pp-blue)] hover:text-[var(--pp-blue)]">
                    Guardar esta vitrine
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 shadow-[0_20px_60px_rgba(16,37,74,0.05)] md:p-7">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-blue)]">
                  Promocoes em destaque
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Menos vitrine, mais clareza.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[var(--pp-muted)]">
                A ideia e mostrar poucas ofertas, mas com contexto suficiente
                para voce bater o olho e entender se vale abrir ou nao.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {featuredDeals.map((deal) => (
                <article
                  key={deal.item}
                  className="grid gap-4 rounded-[1.5rem] border border-[var(--pp-line)] bg-[var(--pp-surface)] p-5 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="text-lg font-semibold">{deal.item}</p>
                    <p className="mt-1 text-sm text-[var(--pp-muted)]">
                      {deal.store}
                    </p>
                    <p className="mt-3 inline-flex rounded-full bg-[rgba(25,76,160,0.08)] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[var(--pp-blue)]">
                      {deal.note}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                    <p className="text-2xl font-semibold text-[var(--pp-blue)]">
                      {deal.price}
                    </p>
                    <button className="rounded-full border border-[var(--pp-blue)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--pp-blue)] transition hover:bg-[var(--pp-blue)] hover:text-white">
                      Quero ver
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-6">
            <section className="rounded-[2rem] bg-[var(--pp-blue)] p-6 text-white shadow-[0_20px_60px_rgba(16,37,74,0.15)] md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
                Como funciona
              </p>
              <div className="mt-5 grid gap-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-[1.35rem] bg-white/10 p-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--pp-blue)]">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-7 text-white/88">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--pp-line)] bg-white p-6 md:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--pp-orange)]">
                Mais pra frente
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Promocao de verdade, nao so etiqueta chamativa.
              </h2>
              <p className="mt-4 text-sm leading-8 text-[var(--pp-muted)]">
                A ideia e guardar o historico de preco da propria loja para
                entender quando houve uma queda real. Assim, fica mais facil
                separar desconto bom de falsa promocao.
              </p>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
