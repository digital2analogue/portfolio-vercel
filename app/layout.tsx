import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk, Spectral } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FocusCaret from "@/components/FocusCaret";
import "./globals.css";

// Fonts match the brand-tokens system:
//   sans  → Space Grotesk (titles, UI labels)
//   serif → Spectral       (body prose)
//   mono  → JetBrains Mono (code + terminal UI chrome)

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--next-font-sans",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--next-font-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--next-font-mono",
});

// Site URL — set NEXT_PUBLIC_SITE_URL in Vercel env to River's production domain.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://riverromney.com";

const DESCRIPTION =
  "Principal Designer working at the intersection of design systems, decision tooling, and enterprise UX. Ten years shipping compliance-heavy B2B fintech.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "River Romney — Principal Designer",
    template: "%s · River Romney",
  },
  description: DESCRIPTION,
  applicationName: "River Romney · Portfolio",
  authors: [{ name: "River Romney" }],
  creator: "River Romney",
  keywords: [
    "River Romney",
    "Principal Designer",
    "design systems",
    "decision tooling",
    "enterprise UX",
    "B2B product design",
    "compliance UX",
    "fintech design",
    "senior IC design",
    "staff designer",
    "Capital One",
    "OpenTable",
  ],
  openGraph: {
    type: "website",
    siteName: "River Romney · Principal Designer",
    title: "River Romney — Principal Designer",
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "River Romney — Principal Designer. Design systems · decision tooling · enterprise UX.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "River Romney — Principal Designer",
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0D0A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spectral.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <FocusCaret />
        <Nav />
        <main id="main" tabIndex={-1} style={{ outline: "none" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
