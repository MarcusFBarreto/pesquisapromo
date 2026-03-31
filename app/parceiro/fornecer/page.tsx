import Link from "next/link";
import { CheckBadgeIcon, RocketLaunchIcon, UserGroupIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Seja um Fornecedor | PesquisaPromo",
  description: "Traga sua loja para o PesquisaPromo e comece a receber pedidos de orçamento reais da sua região.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FornecerLandingPage() {
  return (
    <div className="min-h-screen bg-pp-dark text-white">
      {/* ─── NAV SIMPLIFICADA ─── */}
      <nav className="border-b border-white/10 bg-pp-dark/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
            <span className="text-2xl" aria-hidden="true">🔎</span>
            <div className="flex flex-row items-center gap-2 sm:gap-4 flex-nowrap shrink-0">
              <span className="text-xl font-bold tracking-tight text-white leading-none whitespace-nowrap">PesquisaPromo</span>
              <div className="inline-flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-0.5 border border-white/20 shrink-0 whitespace-nowrap">
                <div className="h-1 w-1 rounded-full bg-emerald-400" />
                <span className="text-[8px] font-black uppercase tracking-[0.05em] text-white">
                  Piloto: Horizonte, CE
                </span>
              </div>
            </div>
          </Link>
          <Link href="/parceiro/login" className="text-sm font-semibold text-white/60 hover:text-white transition">
            Já sou parceiro
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pp-teal/20 via-pp-dark to-pp-dark" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-pp-teal/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pp-teal">
            Expanda seu negócio local
          </span>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-[-0.03em] sm:text-6xl lg:text-7xl lg:leading-[1.1]">
            Pare de procurar clientes. <br />
            <span className="text-pp-orange text-3xl sm:text-5xl lg:text-6xl">Deixe que eles te encontrem.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
            O PesquisaPromo é a ponte direta entre quem quer comprar e quem tem o produto. Em Horizonte e região, conectamos sua empresa a demandas reais de clientes locais.
          </p>
          <div className="mt-12">
            <Link
              href="/parceiro/cadastro"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-pp-orange px-10 py-5 text-sm font-bold tracking-tight text-white shadow-xl shadow-pp-orange/20 transition hover:scale-105 hover:bg-pp-orange-hover active:scale-95"
            >
              Criar conta de fornecedor
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMO FUNCIONA ─── */}
      <section className="bg-pp-surface py-24 text-pp-ink">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Como o PesquisaPromo ajuda você</h2>
            <p className="mt-4 text-pp-muted">Simples, prático e focado no seu fechamento de venda.</p>
          </div>

          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pp-teal/10 text-pp-teal">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">1. Receba a Demanda</h3>
              <p className="text-pp-muted text-sm leading-relaxed">
                Quando um cliente em Horizonte solicita um produto ou serviço na sua categoria, você é notificado instantaneamente no seu painel.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pp-orange/10 text-pp-orange">
                <RocketLaunchIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">2. Envie sua Proposta</h3>
              <p className="text-pp-muted text-sm leading-relaxed">
                Você envia seu melhor preço ou orçamento. O cliente recebe as opções e escolhe a que melhor o atende.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pp-ink/10 text-pp-ink">
                <CheckBadgeIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">3. Feche no WhatsApp</h3>
              <p className="text-pp-muted text-sm leading-relaxed">
                Ao ser escolhido, o contato é direto via WhatsApp. Sem taxas sobre a venda, sem enrolação. O cliente é seu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VANTAGENS ─── */}
      <section className="py-24 border-t border-white/5 bg-pp-dark">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="rounded-[3rem] bg-pp-orange/5 border border-pp-orange/10 p-8 lg:p-16 flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-6">Por que se tornar um Parceiro Verificado?</h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 text-pp-teal">
                    <CheckBadgeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Selo de Confiança</p>
                    <p className="text-sm text-white/50">Lojas verificadas recebem prioridade nas buscas e maior taxa de resposta dos clientes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 text-pp-teal">
                    <CheckBadgeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Visibilidade Regional</p>
                    <p className="text-sm text-white/50">Apareça no nosso diretório de parceiros exclusivo para Horizonte e região.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 text-pp-teal">
                    <CheckBadgeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Zero Investimento Inicial</p>
                    <p className="text-sm text-white/50">Neste período piloto, você entra, recebe demandas e testa a plataforma sem custos fixos.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1 bg-pp-dark-surface p-10 rounded-[2rem] border border-white/10 text-center">
              <UserGroupIcon className="mx-auto h-16 w-16 text-pp-orange mb-6" />
              <p className="text-2xl font-bold text-white mb-4">Pronto para começar?</p>
              <p className="text-white/40 mb-8">O cadastro leva menos de 2 minutos.</p>
              <Link
                href="/parceiro/cadastro"
                className="block w-full rounded-2xl bg-pp-teal py-4 text-sm font-bold text-white hover:bg-pp-teal-hover transition shadow-lg shadow-pp-teal/20"
              >
                Cadastrar minha empresa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/10 py-10 text-center text-xs text-white/30">
        <p>&copy; 2026 PesquisaPromo - Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
