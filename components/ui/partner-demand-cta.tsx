"use client";

import { useRouter } from "next/navigation";

type Props = {
  partnerName: string;
  partnerSlug: string;
};

export function PartnerDemandCTA({ partnerName, partnerSlug }: Props) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/solicitar?parceiro=${partnerSlug}`)}
      className="mt-5 block w-full rounded-full bg-pp-orange py-3.5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-pp-orange-hover"
    >
      Abrir demanda
    </button>
  );
}
