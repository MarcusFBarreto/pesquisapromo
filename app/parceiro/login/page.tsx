"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function PartnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      // Auth context has user now — redirect to dashboard
      const stored = localStorage.getItem("pp_auth");
      if (stored) {
        const user = JSON.parse(stored);
        router.push(`/parceiro/painel/${user.partnerSlug}`);
      }
    } else {
      setError(result.error || "Erro ao entrar.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pp-dark p-6">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-pp-teal opacity-[0.05] blur-[120px]" />
        <div className="absolute -left-24 bottom-0 h-[400px] w-[400px] rounded-full bg-pp-orange opacity-[0.03] blur-[100px]" />
      </div>

      <div className="animate-fade-in-up relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-3 w-3 rounded-full bg-pp-orange" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              my<span className="text-pp-orange">Lupa</span>
            </span>
          </Link>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
              <div className="h-2 w-2 rounded-full bg-pp-teal" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-teal-soft">
                Área do parceiro
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Entrar no painel</h1>
            <p className="mt-2 text-sm text-white/40">
              Acesse suas demandas e responda aos clientes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
              >
                Email do parceiro
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                placeholder="parceiro@pesquisapromo.com"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40"
              >
                Senha
              </label>
              <input
                id="login-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-pp-orange py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover hover:shadow-lg hover:shadow-pp-orange/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/5 pt-6">
            <Link 
              href="/parceiro/ativar" 
              className="group flex items-center gap-2 text-xs font-semibold text-pp-teal-soft transition hover:text-pp-teal"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pp-teal/10 group-hover:bg-pp-teal/20">✨</span>
              Primeiro acesso? Ative sua conta aqui
            </Link>
          </div>

          <div className="mt-8 rounded-xl bg-white/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
              Modo demonstração
            </p>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Use <span className="font-mono text-pp-teal-soft">erivaldo@mylupa.com.br</span> com qualquer senha.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Não é parceiro?{" "}
          <Link href="/" className="text-pp-teal-soft transition hover:text-pp-teal">
            Voltar para o myLupa
          </Link>
        </p>
      </div>
    </main>
  );
}
