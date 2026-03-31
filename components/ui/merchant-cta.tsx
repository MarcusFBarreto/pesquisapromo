import Link from "next/link";

export function MerchantCTA() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_70%)]" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[3rem] border border-slate-200 bg-slate-50 px-8 py-16 text-center sm:px-16 sm:py-24 shadow-2xl shadow-slate-200/50">
          <div className="relative z-10">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700">
              Para Lojistas e Autônomos
            </span>
            
            <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.1]">
              Vende em Horizonte? <br />
              <span className="text-pp-orange">Receba orçamentos no seu WhatsApp.</span>
            </h2>
            
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-500 font-light">
              Pare de procurar clientes e comece a ser encontrado. O PesquisaPromo conecta você com quem já decidiu comprar e está apenas esperando o melhor orçamento.
            </p>
            
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/parceiro/cadastro"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-emerald-600 px-10 py-5 text-sm font-bold tracking-tight text-white shadow-xl shadow-emerald-500/20 transition hover:scale-105 hover:bg-emerald-500 active:scale-95 sm:w-auto"
              >
                Quero ser um parceiro
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/parceiro/login"
                className="w-full text-sm font-semibold text-slate-500 transition hover:text-slate-900 sm:w-auto px-6 py-5"
              >
                Já sou parceiro (Fazer Login)
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl border border-slate-200 shadow-sm">⚡</div>
                <p className="text-sm font-bold text-slate-900">Pedidos em Tempo Real</p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">Receba notificações assim que um cliente pedir um orçamento.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl border border-slate-200 shadow-sm">📱</div>
                <p className="text-sm font-bold text-slate-900">WhatsApp Direto</p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">Fale com o cliente sem intermediários e feche a venda.</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl border border-slate-200 shadow-sm">🛡️</div>
                <p className="text-sm font-bold text-slate-900">Perfil Verificado</p>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">Ganhe mais confiança dos consumidores como loja verificada.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
