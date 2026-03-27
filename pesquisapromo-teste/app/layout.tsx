import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PesquisaPromo Teste",
  description:
    "Segundo site do ecossistema PesquisaPromo para testes paralelos, prototipos e novas direcoes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={geist.className}>
      <body>{children}</body>
    </html>
  );
}
