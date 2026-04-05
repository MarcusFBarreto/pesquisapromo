import { Metadata } from "next";

export const metadata: Metadata = {
  title: "myLupa | Onde vendedores encontram oportunidades",
  description: "A myLupa é o seu radar de demandas em tempo real em Horizonte. Encontre clientes, capture oportunidades e turbine seus negócios.",
  keywords: ["myLupa", "demandas", "oportunidades", "serviços em Horizonte", "vendas B2B", "construção civil", "energia solar"],
  openGraph: {
    title: "myLupa - O Radar de Demandas",
    description: "Enxergue o que o mercado ignora. Capture sua próxima oportunidade de negócio agora.",
    type: "website",
    locale: "pt_BR",
    siteName: "myLupa",
  },
  twitter: {
    card: "summary_large_image",
    title: "myLupa | Radar de Demandas",
    description: "Ache o seu próximo negócio na myLupa.",
  }
};

export default function BalaioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
