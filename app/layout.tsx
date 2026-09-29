import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://universe-store-gyn.eduardo-classich123.chatgpt.site"),
  title: "Universe Store Gyn | Tecnologia no Setor Marista",
  description:
    "Universe Store Gyn em Goiânia. Atendimento na loja, retirada e entrega. Consulte produtos e disponibilidade pelo WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Universe Store Gyn",
    description: "Uma experiência premium para descobrir tecnologia em Goiânia.",
    type: "website",
    locale: "pt_BR",
    url: "https://universe-store-gyn.eduardo-classich123.chatgpt.site",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
