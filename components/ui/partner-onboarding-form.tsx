"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  "Casa e Eletro",
  "Papelaria e Gráfica",
  "Saúde e Bem-estar",
  "Móveis e Decoração",
  "Construção e Reforma",
] as const;

export function PartnerOnboardingForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatWhatsApp = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/parceiros/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, whatsapp, category }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao enviar solicitação");
      }

      setIsSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-500/10 border border-emerald-100">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="mb-2 text-2xl font-black text-slate-900 tracking-tight">Pronto, você está na fila!</h3>
        <p className="mx-auto mb-8 max-w-xs text-sm text-slate-500 font-light leading-relaxed">
          Recebemos seus dados. Em breve, um membro da equipe <strong className="text-slate-900 font-bold">myLupa</strong> entrará em contato pelo seu WhatsApp para ativar seu acesso.
        </p>
        <Link
          href="/"
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors py-2"
        >
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in">
      {errorMsg && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          <strong>Ops:</strong> {errorMsg}
        </div>
      )}

      {/* 1. Nome */}
      <div>
        <label
          htmlFor="partner-name"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          Nome do seu negócio
        </label>
        <input
          id="partner-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-14 w-full rounded-xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          placeholder="Ex.: J Erivaldo Material de Construção"
        />
      </div>

      {/* 2. WhatsApp */}
      <div>
        <label
          htmlFor="partner-whatsapp"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          WhatsApp de vendas
        </label>
        <input
          id="partner-whatsapp"
          type="text"
          required
          maxLength={15}
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatWhatsApp(e.target.value))}
          className="h-14 w-full rounded-xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm"
          placeholder="(00) 00000-0000"
        />
      </div>

      {/* 3. Categoria */}
      <div>
        <label
          htmlFor="partner-category"
          className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-slate-400"
        >
          O que você vende ou oferece?
        </label>
        <select
          id="partner-category"
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-14 w-full rounded-xl border border-emerald-100 bg-white px-5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-sm appearance-none"
        >
          <option value="" disabled>Selecione a categoria...</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-slate-900 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed solar-shimmer-effect"
      >
        {isLoading ? "Enviando..." : "Quero receber pedidos"}
      </button>

      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-300">
        Gratuito · Aprovação em até 24h
      </p>
    </form>
  );
}
