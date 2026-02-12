import type { Metadata } from "next";
import localFont from "next/font/local"; // On utilise localFont au lieu de Google
import "./globals.css";
import Navbar from "@/components/Navbar";

// Configuration de la police locale
const squidwod = localFont({
  src: "../public/fonts/Squidwod.otf", // Vérifie bien le nom du fichier
  variable: "--font-squidwod",
});

export const metadata: Metadata = {
  title: "SquidHub",
  description: "Le portail officiel du Serveur de l'Apocalypse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${squidwod.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}