export default function Home() {
  const tracks = [
    {
      title: "Cidade V2",
      description: "Nova leitura da home, mapa e entradas da cidade.",
    },
    {
      title: "Taxi Virtual",
      description: "Ensaios de busca direta, autocomplete e navegacao guiada.",
    },
    {
      title: "Ludico + Real",
      description: "Testes de equilibrio entre encanto visual e uso pratico.",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-8 text-[var(--foreground)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-[2rem] border border-[var(--lab-line)] bg-[var(--lab-panel)] p-6 shadow-[0_24px_70px_rgba(16,37,74,0.06)] md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--lab-blue)]">
            Segundo site
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
            PesquisaPromo Teste
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--lab-muted)] sm:text-lg">
            Este espaco existe para experimentar caminhos maiores sem baguncar o
            site principal. Aqui podem nascer novas estruturas, narrativas,
            componentes e versoes completas em paralelo.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {tracks.map((track) => (
            <article
              key={track.title}
              className="rounded-[1.75rem] border border-[var(--lab-line)] bg-[var(--lab-panel)] p-5 shadow-[0_16px_40px_rgba(16,37,74,0.04)]"
            >
              <p className="text-lg font-semibold">{track.title}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--lab-muted)]">
                {track.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-[var(--lab-line)] bg-[var(--lab-panel)] p-6 shadow-[0_16px_40px_rgba(16,37,74,0.04)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--lab-orange)]">
              Uso recomendado
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.2rem] bg-white px-4 py-3 text-sm text-[var(--lab-muted)]">
                Prototipos grandes que ja parecem um novo site
              </div>
              <div className="rounded-[1.2rem] bg-white px-4 py-3 text-sm text-[var(--lab-muted)]">
                Testes ousados de identidade, navegacao e UX
              </div>
              <div className="rounded-[1.2rem] bg-white px-4 py-3 text-sm text-[var(--lab-muted)]">
                Ensaios sem impacto nas ruas e lojinhas do principal
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] bg-[var(--lab-blue)] p-6 text-white shadow-[0_20px_60px_rgba(16,37,74,0.12)] md:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
              Porta padrao
            </p>
            <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
              localhost:3001
            </p>
            <p className="mt-4 text-sm leading-7 text-white/84">
              O site principal segue em `localhost:3000`. Este segundo site roda
              separado, com autonomia para evoluir como quiser.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
