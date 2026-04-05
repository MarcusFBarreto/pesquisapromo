import Link from "next/link";
import { PesquisaPromoHeader } from "@/components/pesquisapromo/header";
import { PartnerOnboardingForm } from "@/components/ui/partner-onboarding-form";
import { Store, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Seja Parceiro | myLupa",
  description: "Tem algo para oferecer? 3 dados e você já está dentro do myLupa.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FornecerLandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <PesquisaPromoHeader />

      {/* ─── Hero Compacto ─── */}
      <section className="relative overflow-hidden bg-white pt-8 pb-12 lg:pt-16 lg:pb-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500 opacity-[0.03] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-2xl px-6 lg:px-10">
          {/* Title */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <Store className="h-8 w-8" />
            </div>
            <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-emerald-600 mb-4">
              Portal do Parceiro
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              Tem algo para oferecer?<br/>
              <span className="text-emerald-500 italic font-medium">
                3 dados e você já está dentro.
              </span>
            </h1>
            <p className="mt-4 text-base text-slate-500 font-light leading-relaxed max-w-md mx-auto">
              Receba pedidos de clientes reais da sua região. Sem taxa, sem contrato, sem burocracia.
            </p>
          </div>

          {/* Form Card (Inline) */}
          <div className="animate-fade-in-up delay-1 rounded-2xl border border-emerald-100 bg-white p-8 shadow-[0_20px_50px_rgba(16,185,129,0.1)] sm:p-10">
            <PartnerOnboardingForm />
          </div>

          {/* Already a partner? */}
          <div className="mt-6 text-center animate-fade-in-up delay-2">
            <p className="text-xs text-slate-400">
              Já é parceiro?{" "}
              <Link href="/parceiro/login" className="font-bold text-emerald-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
