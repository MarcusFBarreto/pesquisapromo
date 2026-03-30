"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PartnerActivationPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [partnerName, setPartnerName] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/parceiro/ativar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cnpj }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.alreadyActive) {
          setError("Esta conta já está ativa. Por favor, faça login.");
          setTimeout(() => router.push("/parceiro/login"), 3000);
        } else {
          setPartnerName(data.name);
          setStep(2);
        }
      } else {
        setError(data.error || "Dados não encontrados ou não conferem.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/parceiro/ativar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cnpj, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/parceiro/login"), 3000);
      } else {
        setError(data.error || "Erro ao ativar conta.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-pp-dark p-6">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-pp-teal opacity-[0.05] blur-[120px]" />
        <div className="absolute -left-24 bottom-0 h-[400px] w-[400px] rounded-full bg-pp-orange opacity-[0.03] blur-[100px]" />
      </div>

      <div className="animate-fade-in-up relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-pp-teal bg-pp-dark-surface">
              <div className="h-3 w-3 rounded-full bg-pp-orange" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              Pesquisa<span className="text-pp-orange">Promo</span>
            </span>
          </Link>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
          {success ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pp-teal/20 text-3xl">🎉</div>
              <h1 className="text-2xl font-bold text-white">Conta Ativada!</h1>
              <p className="mt-4 text-sm text-white/60 leading-relaxed">
                Parabéns! Sua conta foi ativada com sucesso. <br/>
                Redirecionando para o login em instantes...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                  <div className="h-2 w-2 rounded-full bg-pp-teal" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-pp-teal-soft">
                    {step === 1 ? "Etapa 1: Verificação" : "Etapa 2: Nova Senha"}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">
                  {step === 1 ? "Ativar sua conta" : `Olá, ${partnerName.split(' ')[0]}!`}
                </h1>
                <p className="mt-2 text-sm text-white/40">
                  {step === 1 
                    ? "Informe seus dados para validarmos sua aprovação." 
                    : "Agora defina a senha que você usará para acessar o painel."}
                </p>
              </div>

              {step === 1 ? (
                <form onSubmit={handleVerify} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
                      Email cadastrado
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
                      CNPJ (Somente números)
                    </label>
                    <input
                      type="text"
                      required
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                      placeholder="00000000000000"
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-white/[0.08] py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    {loading ? "Verificando..." : "Verificar Aprovação"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleActivate} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/40">
                      Confirmar Senha
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
                      placeholder="••••••••"
                    />
                  </div>
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-pp-teal py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-pp-teal/20 transition hover:bg-pp-teal-hover disabled:opacity-50"
                  >
                    {loading ? "Ativando..." : "Ativar minha conta"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-white/20">
          Já tem uma senha?{" "}
          <Link href="/parceiro/login" className="text-pp-teal-soft transition hover:text-pp-teal">
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  );
}
