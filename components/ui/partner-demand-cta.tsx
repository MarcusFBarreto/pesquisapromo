"use client";

import { useState } from "react";
import { DemandModal } from "./demand-modal";

type Props = {
  partnerName: string;
  partnerSlug: string;
};

export function PartnerDemandCTA({ partnerName, partnerSlug }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-5 block w-full rounded-full bg-pp-orange py-3.5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover"
      >
        Abrir demanda
      </button>
      <DemandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        intendedPartnerSlug={partnerSlug}
        intendedPartnerName={partnerName}
      />
    </>
  );
}
