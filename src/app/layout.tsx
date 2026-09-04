import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "UGAP — Le choix de l'achat juste | Pricing Intelligence",
  description:
    "Prototype IA Lab — pricing appels d'offres et veille concurrentielle",
  icons: {
    icon: `${basePath}/favicon-ugap.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- fallback CSS statique si PostCSS/Tailwind ne charge pas */}
        <link rel="stylesheet" href={`${basePath}/app.css`} />
      </head>
      <body className={`${inter.variable} ${inter.className}`}>{children}</body>
    </html>
  );
}
