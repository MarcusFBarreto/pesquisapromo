"use client";

import { useState, FormEvent } from "react";
import { DemandModal } from "./demand-modal";

export function HeroDemandForm() {
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsModalOpen(true);
  }

  function handleClose() {
    setIsModalOpen(false);
    // Clear input so the field doesn't stay pre-filled after the user sends the demand
    setInputValue("");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="demand-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="h-14 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-6 text-base text-white outline-none transition placeholder:text-white/30 focus:border-pp-teal focus:ring-4 focus:ring-pp-teal/20"
          placeholder="Ex.: cimento 50 sacos, conserto de ar-condicionado, orçamento de pintura..."
          required
        />
        <button
          id="demand-submit"
          type="submit"
          className="h-14 shrink-0 rounded-full bg-pp-orange px-8 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover hover:shadow-lg hover:shadow-pp-orange/20 active:scale-[0.98]"
        >
          Receber propostas
        </button>
      </form>
      <DemandModal
        isOpen={isModalOpen}
        onClose={handleClose}
        initialDemand={inputValue}
      />
    </>
  );
}
