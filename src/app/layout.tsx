import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import LocaleEffect from "@/components/system/LocaleEffect";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Pharaoh's Gambit — Tic-Tac-Toe & Minimax",
  description:
    "Play Tic-Tac-Toe against an unbeatable Minimax AI. Watch the algorithm think in real time, themed as the trials of Ancient Egypt. English / العربية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${cinzel.variable} ${cormorant.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleEffect />
        {children}
      </body>
    </html>
  );
}
