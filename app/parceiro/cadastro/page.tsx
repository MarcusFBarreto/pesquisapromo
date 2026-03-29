import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PartnerOnboardingForm } from "@/components/ui/partner-onboarding-form";

export const metadata = {
  title: "Sou Lojista | PesquisaPromo",
  description: "Cadastre sua loja para receber orçamentos hiper-segmentados de Horizonte.",
};

export default function PartnerRegistrationPage() {
  return (
    <div className="min-h-screen bg-pp-cream">
      {/* ─── HEADER SIMPLIFICADO ─── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-pp-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2 transition hover:opacity-80">
            <span className="text-2xl" aria-hidden="true">🔎</span>
            <span className="text-xl font-bold tracking-tight text-white">PesquisaPromo</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao site</span>
          </Link>
        </div>
      </header>

      {/* ─── HERO & FORMULÁRIO ─── */}
      <main>
        {/* Dark Hero Section */}
        <section className="relative overflow-hidden bg-pp-dark py-16 lg:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pp-teal/10 via-pp-dark to-pp-dark" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-pp-orange/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pp-orange">
              Portal do Parceiro
            </span>
            <h1 className="text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
              Mais orçamentos, zero esforço.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
              Receba pedidos de orçamento segmentados direto no seu painel. Preencha seus dados comerciais e junte-se aos verificados da cidade.
            </p>
          </div>
        </section>

        {/* Form Container (Overlapping the dark section) */}
        <section className="mx-auto max-w-3xl px-6 lg:px-10 -mt-12 pb-24 relative z-10">
          <div className="glass-card rounded-[2rem] border border-pp-line bg-white p-8 shadow-xl sm:p-12">
            <PartnerOnboardingForm />
          </div>
        </section>
      </main>
    </div>
  );
}
