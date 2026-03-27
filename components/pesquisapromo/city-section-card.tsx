import Link from "next/link";

type Props = {
  title: string;
  summary: string;
  href: string;
};

export function CitySectionCard({ title, summary, href }: Props) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{summary}</p>
      <span className="mt-4 inline-block text-sm font-medium text-slate-900">Ir para a rua</span>
    </Link>
  );
}
