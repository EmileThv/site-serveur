import type { Metadata } from "next";
import { Modak } from "next/font/google"; // On remplace Geist par Modak
import "./globals.css";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
});

export const metadata: Metadata = {
  title: "CoubehFeu - Discord Games",
  description: "Le portail officiel de Coubah Corp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${modak.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}