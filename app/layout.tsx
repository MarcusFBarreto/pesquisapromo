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
  title: "myLupa | Sua demanda nas mãos certas",
  description:
    "Conectamos suas necessidades aos melhores parceiros locais. Descreva o que precisa e receba propostas reais direto no seu WhatsApp. Simples, rápido e regional.",
  keywords: ["mylupa", "myLupa", "pedidos de orçamento", "serviços locais", "marketplace regional"],
  openGraph: {
    title: "myLupa | Onde o seu pedido encontra o parceiro certo",
    description: "Descreva o que precisa e receba propostas de parceiros locais direto no WhatsApp.",
    url: "https://pesquisapromo.com.br",
    siteName: "myLupa",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "myLupa | Sua demanda nas mãos certas",
    description: "Encontre o parceiro ideal para orçamentos e serviços localmente.",
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
