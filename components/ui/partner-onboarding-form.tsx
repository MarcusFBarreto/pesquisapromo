"use client";

import { useState } from "react";
import { CheckCircleIcon, BuildingStorefrontIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const CATEGORIES = [
  "Casa e Eletro",
  "Papelaria e Gráfica",
  "Saúde e Bem-estar",
  "Móveis e Decoração",
  "Construção e Reforma",
];

export function PartnerOnboardingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cnpj: "",
    whatsapp: "",
    category: "",
    description: "",
    partnerType: "cnpj", // Default to CNPJ as it was the original
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatWhatsApp = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 7) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9, 11)}`;
  };

  const formatCNPJ = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length <= 2) return v;
    if (v.length <= 5) return `${v.slice(0, 2)}.${v.slice(2)}`;
    if (v.length <= 8) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5)}`;
    if (v.length <= 12) return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8)}`;
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12, 14)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/parceiros/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
      <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in-up">
        <CheckCircleIcon className="h-16 w-16 text-pp-teal" />
        <h2 className="mt-6 text-2xl font-bold text-pp-ink">Solicitação Enviada!</h2>
        <p className="mt-4 max-w-md text-sm leading-6 text-pp-muted">
          Sua solicitação foi enviada pra equipe do myLupa e já está sendo analisada. 
          Assim que for aprovada, você recebe o acesso ao painel pelo WhatsApp.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-pp-dark px-8 py-3 text-sm font-semibold text-white transition hover:bg-pp-ink"
        >
          Voltar à página inicial
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-fade-in-up">
      <div className="flex items-center gap-3 border-b border-pp-line pb-4 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pp-orange/10 text-pp-orange">
          <BuildingStorefrontIcon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-pp-ink">Dados da Empresa</h2>
          <p className="text-xs text-pp-muted">Preencha com os dados públicos do seu negócio local.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          <strong>Erro:</strong> {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-pp-ink">Tipo de Atividade *</label>
          <select
            required
            className="w-full rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
            value={formData.partnerType}
            onChange={(e) => setFormData({ ...formData, partnerType: e.target.value, cnpj: "" })}
          >
            <option value="cnpj">Empresa (CNPJ)</option>
            <option value="cpf">Profissional (CPF)</option>
            <option value="autonomo">Autônomo / Freelancer</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-pp-ink">
            {formData.partnerType === "cnpj" ? "Nome Fantasia da Empresa *" : "Nome Completo *"}
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
            placeholder={formData.partnerType === "cnpj" ? "Ex: J Erivaldo Material" : "Seu nome completo"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-pp-ink">
            {formData.partnerType === "cnpj" ? "CNPJ *" : "CPF *"}
          </label>
          <input
            type="text"
            required
            maxLength={formData.partnerType === "cnpj" ? 18 : 14}
            className="w-full rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
            placeholder={formData.partnerType === "cnpj" ? "00.000.000/0000-00" : "000.000.000-00"}
            value={formData.cnpj}
            onChange={(e) => {
              const val = e.target.value;
              setFormData({ 
                ...formData, 
                cnpj: formData.partnerType === "cnpj" ? formatCNPJ(val) : formatCPF(val) 
              });
            }}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-pp-ink">Email para Login *</label>
          <input
            type="email"
            required
            className="w-full rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
            placeholder="Ex: contato@sualoja.com.br"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-pp-ink">WhatsApp de Vendas *</label>
          <input
            type="text"
            required
            maxLength={15}
            className="w-full rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
            placeholder="(85) 99999-9999"
            value={formData.whatsapp}
            onChange={(e) => setFormData({ ...formData, whatsapp: formatWhatsApp(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-pp-ink">Categoria Principal *</label>
          <select
            required
            className="w-full rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="" disabled>Selecione uma categoria...</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-pp-ink">Principais Marcas/Produtos (Opcional)</label>
        <textarea
          rows={3}
          className="w-full resize-none rounded-xl border border-pp-line bg-pp-surface px-4 py-3 text-sm text-pp-ink outline-none transition focus:border-pp-teal focus:ring-1 focus:ring-pp-teal"
          placeholder="Ex: Cimento Nassau, Tintas Coral, Areia lavada (Separe por vírgulas)..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pp-teal px-4 py-4 text-sm font-bold text-white transition hover:bg-pp-teal-hover focus:outline-none focus:ring-2 focus:ring-pp-teal focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <ArrowPathIcon className="h-5 w-5 animate-spin" />
            Enviando solicitação...
          </>
        ) : (
          "Solicitar Acesso ao Painel"
        )}
      </button>

      <p className="text-center text-xs text-pp-muted mt-2">
        * A aprovação leva em média 24h. Mantemos a rede enxuta e apenas com perfis verificados.
      </p>
    </form>
  );
}
