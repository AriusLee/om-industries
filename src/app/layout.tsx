import type { Metadata } from "next";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Masthead } from "@/components/masthead";
import { SiteFooter } from "@/components/site-footer";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "OM Industries — Independent industry research",
    template: "%s · OM Industries",
  },
  description:
    "Industry analysis from OM Industries, the public research imprint of Orionmano.",
  metadataBase: new URL(
    process.env.OM_SITE_URL ?? "https://industries.omassurance.com"
  ),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <Masthead />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
