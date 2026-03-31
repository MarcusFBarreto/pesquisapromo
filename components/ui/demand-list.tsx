"use client";

import { useState } from "react";
import {
  Demand,
  DemandStatus,
  formatWhatsappDisplay,
  generateWhatsappLink,
  timeAgo,
} from "@/lib/mock-demands";
import { blockClient } from "@/lib/blocklist-service";
import { 
  Bell, 
  CheckCircle2, 
  Archive, 
  Clock, 
  User, 
  MessageCircle, 
  Ban, 
  RotateCcw,
  Inbox
} from "lucide-react";

type DemandListProps = {
  demands: Demand[];
  partnerName: string;
  partnerSlug: string;
};

const TABS: { key: DemandStatus; label: string; icon: any }[] = [
  { key: "new", label: "Novas", icon: Bell },
  { key: "responded", label: "Atendidas", icon: CheckCircle2 },
  { key: "archived", label: "Arquivadas", icon: Archive },
];

export function DemandList({ demands: initialDemands, partnerName, partnerSlug }: DemandListProps) {
  const [demands, setDemands] = useState(initialDemands);
  const [activeTab, setActiveTab] = useState<DemandStatus>("new");

  const filtered = demands.filter((d) => d.status === activeTab);
  const counts = {
    new: demands.filter((d) => d.status === "new").length,
    responded: demands.filter((d) => d.status === "responded").length,
    archived: demands.filter((d) => d.status === "archived").length,
  };

  function updateStatus(id: string, newStatus: DemandStatus) {
    setDemands((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
    );
  }

  function handleBlock(demandId: string, clientWhatsapp: string) {
    // Silently block this client — they'll never know
    blockClient(partnerSlug, clientWhatsapp);
    // Remove from the list immediately
    setDemands((prev) => prev.filter((d) => d.id !== demandId));
  }

  return (
    <div>
      {/* Tabs (Solar Style) */}
      <div className="flex gap-1 rounded-2xl bg-white border border-slate-100 p-1.5 shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition ${
              activeTab === tab.key
                ? "bg-slate-900 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.key ? "text-emerald-400" : ""}`} />
            <span className="hidden sm:inline">{tab.label}</span>
            {counts[tab.key] > 0 && (
              <span
                className={`ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[8px] font-black ${
                  tab.key === "new" && counts.new > 0
                    ? "bg-pp-orange text-white"
                    : activeTab === tab.key ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Demand cards */}
      <div className="mt-6 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-[2.5rem] border border-slate-100 bg-white px-6 py-20 text-center shadow-xl shadow-emerald-500/[0.02]">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
              <Inbox className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              {activeTab === "new"
                ? "Nenhuma demanda nova no momento."
                : activeTab === "responded"
                  ? "Nenhuma demanda atendida ainda."
                  : "Nenhuma demanda arquivada."}
            </p>
          </div>
        ) : (
          filtered.map((demand, index) => (
            <article
              key={demand.id}
              className={`animate-fade-in-up delay-${Math.min(index + 1, 5)} group relative rounded-[2rem] border border-slate-100 bg-white p-6 transition-all hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/[0.06]`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {demand.request}
                  </h3>
                  {demand.details && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 font-light">
                      {demand.details}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-300">
                    <Clock className="h-3 w-3" />
                    {timeAgo(demand.createdAt)}
                  </div>
                </div>
              </div>

              {/* Customer info (Solar) */}
              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-tight">{demand.name}</p>
                    <p className="text-[11px] font-medium text-slate-400">
                      {formatWhatsappDisplay(demand.whatsapp)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Categories (Solar Tags) */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {demand.matchedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Actions (Solar Buttons) */}
              <div className="mt-6 flex flex-wrap gap-2">
                {demand.status === "new" && (
                  <>
                    <a
                      href={generateWhatsappLink(
                        demand.whatsapp,
                        demand.name,
                        demand.request,
                        partnerName
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2 rounded-full bg-pp-orange px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-pp-orange-hover hover:scale-[1.02] active:scale-95 shadow-lg shadow-pp-orange/20"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Responder no WhatsApp
                    </a>
                    <button
                      onClick={() => updateStatus(demand.id, "responded")}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Finalizar
                    </button>
                    <div className="ml-auto flex items-center gap-1">
                      <button
                        onClick={() => updateStatus(demand.id, "archived")}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-300 transition hover:bg-slate-50 hover:text-slate-500"
                        title="Arquivar"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleBlock(demand.id, demand.whatsapp)}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-200 transition hover:bg-red-50 hover:text-red-400"
                        title="Bloquear cliente"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
                {demand.status === "responded" && (
                  <>
                    <a
                      href={generateWhatsappLink(
                        demand.whatsapp,
                        demand.name,
                        demand.request,
                        partnerName
                      )}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 transition hover:bg-emerald-50"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Retomar conversa
                    </a>
                    <button
                      onClick={() => updateStatus(demand.id, "archived")}
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
                    >
                      <Archive className="h-4 w-4" />
                      Arquivar
                    </button>
                  </>
                )}
                {demand.status === "archived" && (
                  <button
                    onClick={() => updateStatus(demand.id, "new")}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 transition hover:border-emerald-300 hover:text-emerald-600"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restaurar Demanda
                  </button>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
