import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Álbum Mundial 2026",
  description:
    "Registro de cromos: equipos, Coca-Cola, historia FIFA, repetidos y cuenta en la nube.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-dvh flex-col text-zinc-900 dark:text-zinc-50">
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/world-cup-bg.png')" }}
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 bg-white/35 dark:bg-black/45"
        />
        <SiteHeader />
        <main className="relative flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
