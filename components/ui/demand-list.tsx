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

type DemandListProps = {
  demands: Demand[];
  partnerName: string;
  partnerSlug: string;
};

const TABS: { key: DemandStatus; label: string; emoji: string }[] = [
  { key: "new", label: "Novas", emoji: "🔔" },
  { key: "responded", label: "Atendidas", emoji: "✅" },
  { key: "archived", label: "Arquivadas", emoji: "📦" },
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
      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-white/[0.04] p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
              activeTab === tab.key
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            }`}
          >
            {tab.emoji} {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className={`ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  tab.key === "new" && counts.new > 0
                    ? "bg-pp-orange text-white"
                    : "bg-white/10 text-white/50"
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
          <div className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.02] px-6 py-12 text-center">
            <p className="text-sm text-white/30">
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
              className={`animate-fade-in-up delay-${Math.min(index + 1, 5)} rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/15`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white">
                    {demand.request}
                  </h3>
                  {demand.details && (
                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      {demand.details}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs text-white/25">
                  {timeAgo(demand.createdAt)}
                </span>
              </div>

              {/* Customer info */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-pp-teal/20 text-xs">
                    👤
                  </div>
                  <span className="text-sm font-medium text-white/70">
                    {demand.name}
                  </span>
                </div>
                <span className="text-xs text-white/30">
                  {formatWhatsappDisplay(demand.whatsapp)}
                </span>
              </div>

              {/* Categories */}
              <div className="mt-3 flex flex-wrap gap-2">
                {demand.matchedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full bg-pp-orange/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-pp-orange"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-5 flex flex-wrap gap-2">
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
                      className="inline-flex items-center gap-2 rounded-full bg-pp-teal px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-pp-teal-soft"
                    >
                      💬 Responder via WhatsApp
                    </a>
                    <button
                      onClick={() => updateStatus(demand.id, "responded")}
                      className="rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white/70"
                    >
                      ✅ Marcar atendida
                    </button>
                    <button
                      onClick={() => updateStatus(demand.id, "archived")}
                      className="rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white/70"
                    >
                      📦 Arquivar
                    </button>
                    <button
                      onClick={() => handleBlock(demand.id, demand.whatsapp)}
                      className="rounded-full px-3 py-2.5 text-xs text-white/20 transition hover:text-red-400/60"
                      title="Não receber mais demandas deste cliente"
                    >
                      🚫
                    </button>
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
                      className="inline-flex items-center gap-2 rounded-full border border-pp-teal/30 px-4 py-2.5 text-xs font-semibold text-pp-teal transition hover:bg-pp-teal/10"
                    >
                      💬 Retomar conversa
                    </a>
                    <button
                      onClick={() => updateStatus(demand.id, "archived")}
                      className="rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white/70"
                    >
                      📦 Arquivar
                    </button>
                  </>
                )}
                {demand.status === "archived" && (
                  <button
                    onClick={() => updateStatus(demand.id, "new")}
                    className="rounded-full border border-white/10 px-4 py-2.5 text-xs font-semibold text-white/50 transition hover:border-white/20 hover:text-white/70"
                  >
                    🔄 Reabrir
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
