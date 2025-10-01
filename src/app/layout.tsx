import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finanças Pessoais",
  description: "Gerencie suas finanças pessoais de forma simples e eficiente",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased`}>
        <ClientSessionProvider>{children}</ClientSessionProvider>
      </body>
    </html>
  );
}
