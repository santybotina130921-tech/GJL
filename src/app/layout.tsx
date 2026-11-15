import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import "./jgl.css";
import "./extra.css";
import "./tema.css";
import { getAjustes } from "@/lib/datos";
import { IDS_TEMAS } from "@/lib/temas";

const titulos = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-titulos",
});

const texto = Inter({
  subsets: ["latin"],
  variable: "--font-texto",
});

export const metadata: Metadata = {
  title: "JGL Estructural | Soldadura y estructuras metálicas",
  description:
    "Fabricación, soldadura y montaje de estructuras metálicas para obras civiles, bodegas y viviendas.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const a = await getAjustes();
  const tema = IDS_TEMAS.includes(a.tema) ? a.tema : "naranja";
  return (
    <html lang="es" data-tema={tema} className={`dark ${titulos.variable} ${texto.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
