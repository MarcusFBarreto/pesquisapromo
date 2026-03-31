import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PesquisaPromo | Sua demanda nas mãos certas em Horizonte",
  description:
    "Conectamos suas necessidades aos melhores parceiros locais em Horizonte, Ceará. Descreva o que precisa e receba propostas reais direto no seu WhatsApp. Simples, rápido e regional.",
  keywords: ["pesquisapromo", "horizonte ce", "pedidos de orçamento", "serviços locais", "compras horizonte", "marketplace regional", "vendas em horizonte"],
  openGraph: {
    title: "PesquisaPromo Horizonte | Onde o seu pedido encontra o parceiro certo",
    description: "Descreva o que precisa e receba propostas de parceiros locais direto no WhatsApp.",
    url: "https://pesquisapromo.com.br", // Substituir pelo domínio oficial se disponível
    siteName: "PesquisaPromo",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PesquisaPromo | Sua demanda nas mãos certas",
    description: "Encontre o parceiro ideal em Horizonte, Ceará, para orçamentos e serviços.",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
