import Link from "next/link";
import { CityNavigator } from "@/components/city-navigator";
import { taxiPrompts } from "@/lib/city-data";

export default function TaxiPage() {
  return (
    <main className="min-h-screen bg-[var(--city-bg)] px-6 py-8 text-[var(--city-ink)] sm:px-10 lg:px-12">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-[2.2rem] border border-[var(--city-line)] bg-[linear-gradient(135deg,rgba(8,19,42,0.92),rgba(20,53,108,0.86))] p-7 text-white shadow-[0_30px_100px_rgba(14,29,63,0.24)] md:p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/68">
            Taxi Virtual
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.05em] md:text-6xl">
            Para onde vamos?
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/78">
            O taxi entende o destino e te leva para a rua, a lojinha ou a oportunidade
            mais coerente dentro da cidade.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              Voltar ao portal
            </Link>
            <Link href="/busca" className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--city-blue)]">
              Abrir busca
            </Link>
          </div>
        </header>

        <CityNavigator
          label="Atalho encantador"
          title="Diga o destino e deixe o resto com o mapa"
          description="Aqui a busca ja nasce como orientacao. O taxi tenta traduzir sua intencao em caminho, nao so em uma lista seca de resultados."
          placeholder="Ex.: geladeira, tenis, achado, fone"
          submitLabel="Me leve ate la"
        />

        <section className="rounded-[2rem] border border-[var(--city-line)] bg-white p-6 shadow-[0_20px_70px_rgba(14,29,63,0.08)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--city-orange)]">
            Destinos que ja fazem sentido
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {taxiPrompts.map((prompt) => (
              <Link
                key={prompt}
                href={`/busca?q=${encodeURIComponent(prompt)}`}
                className="inline-flex rounded-full bg-[var(--city-soft)] px-4 py-2 text-sm font-semibold text-[var(--city-ink)] transition hover:bg-white hover:shadow-[0_10px_24px_rgba(14,29,63,0.06)]"
              >
                {prompt}
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
