import Link from "next/link";

export function TaxiButton() {
  return (
    <Link
      href="/taxi-virtual"
      className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
    >
      Chamar Táxi
    </Link>
  );
}
