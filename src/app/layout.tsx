import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, Michroma } from "next/font/google";
import { Toaster } from "@/components/Toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const barlow = Barlow_Condensed({ subsets: ["latin"], weight: ["500", "600", "700", "800", "900"], style: ["normal", "italic"], variable: "--font-barlow", display: "swap" });
const michroma = Michroma({ subsets: ["latin"], weight: "400", variable: "--font-michroma", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "VELOCITY LUXURY — Born to Stand Out", template: "%s · VELOCITY LUXURY" },
  description: "Moda urbana de lujo con ADN de superdeportivo. Camisetas, hoodies, chaquetas y ediciones exclusivas diseñadas para destacar.",
  openGraph: { title: "VELOCITY LUXURY", description: "Drive your style. Moda urbana de lujo inspirada en los superdeportivos.", images: ["/images/hero.svg"], locale: "es_EC", type: "website" },
};
export const viewport: Viewport = { themeColor: "#050506" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${barlow.variable} ${michroma.variable}`}>
      <body className="min-h-screen font-sans">
        <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-giallo focus:px-4 focus:py-2 focus:text-black">Saltar al contenido</a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
