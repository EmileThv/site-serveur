import type { Metadata } from "next";
import { Modak } from "next/font/google"; // On remplace Geist par Modak
import "./globals.css";

const modak = Modak({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-modak",
});

export const metadata: Metadata = {
  title: "CoubehFeu - Serv de l'apocalypse",
  description: "gamersonly3",
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