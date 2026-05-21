import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import LocaleEffect from "@/components/system/LocaleEffect";

// Only the weights actually rendered in the UI — saves ~120 KB of woff2
// (previously loaded 4 Cinzel + 4 Cormorant variants we never used).
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = "https://ahmedeid1.github.io/Tic-Tac-Toe";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Pharaoh's Gambit — Tic-Tac-Toe & Minimax",
  description:
    "Play Tic-Tac-Toe against an unbeatable Minimax AI. Watch the algorithm think in real time, themed as the trials of Ancient Egypt. English / العربية.",
  applicationName: "Pharaoh's Gambit",
  keywords: [
    "tic-tac-toe",
    "minimax",
    "alpha-beta pruning",
    "ai",
    "game",
    "next.js",
    "react",
    "egyptian",
    "ankh",
    "eye of horus",
    "arabic",
    "algorithm visualization",
  ],
  authors: [{ name: "ahmedEid1", url: "https://github.com/ahmedEid1" }],
  icons: {
    icon: [
      { url: `${BASE_PATH}/favicon.svg`, type: "image/svg+xml" },
    ],
    apple: `${BASE_PATH}/favicon.svg`,
  },
  openGraph: {
    type: "website",
    title: "Pharaoh's Gambit — Tic-Tac-Toe & Minimax",
    description:
      "An unbeatable Minimax AI you can watch think — in English and العربية, themed as the trials of Ancient Egypt.",
    url: SITE_URL,
    siteName: "Pharaoh's Gambit",
    images: [
      {
        url: `${BASE_PATH}/og.png`,
        width: 1200,
        height: 630,
        alt: "Pharaoh's Gambit — Tic-Tac-Toe with an explainable Minimax AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pharaoh's Gambit — Tic-Tac-Toe & Minimax",
    description:
      "An unbeatable Minimax AI you can watch think. EN / AR. Ancient-Egypt themed.",
    images: [`${BASE_PATH}/og.png`],
  },
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
