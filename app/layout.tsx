import type { Metadata, Viewport } from "next";
import { Archivo_Black, Manrope } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tres Gustavos — Chorizo de Pollo de Parrilla",
  description:
    "Chorizo de pollo artesanal de la línea premium de Tres Gustavos. Selección de autor, especias naturales y el punto exacto de la parrilla. Distribución oficial en Maracay.",
  keywords: [
    "chorizo de pollo",
    "Tres Gustavos",
    "parrilla",
    "Maracay",
    "Sannas Pollos",
    "gourmet",
  ],
  openGraph: {
    title: "Tres Gustavos — Chorizo de Pollo de Parrilla",
    description:
      "El fuego es el mejor sazón. Descubre el chorizo de pollo de la línea premium Tres Gustavos.",
    type: "website",
    locale: "es_VE",
    siteName: "Tres Gustavos",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
