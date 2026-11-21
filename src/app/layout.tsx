import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { site } from "@/lib/site";
import "./globals.css";

// Mêmes fichiers de police que l'ancien site (hébergés localement).
const oswald = localFont({
  src: "./fonts/Oswald-VariableFont_wght.woff2",
  variable: "--font-oswald",
  weight: "200 700",
  display: "swap",
});

const poppins = localFont({
  src: "./fonts/Poppins-Regular.woff2",
  variable: "--font-poppins",
  weight: "400",
  display: "swap",
});

const openSans = localFont({
  src: "./fonts/OpenSans-VariableFont_wdthwght.woff2",
  variable: "--font-open-sans",
  weight: "300 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s – ${site.name}`,
  },
  description: site.tagline,
  authors: [{ name: site.author, url: site.url }],
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.name,
    description: site.tagline,
    locale: "fr_FR",
    images: [{ url: "/images/portrait.webp", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    site: "@_pgillon",
  },
};

export const viewport: Viewport = {
  themeColor: "#4d19a2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr-FR" className={`${oswald.variable} ${poppins.variable} ${openSans.variable}`}>
      <head>
        {/* Sans JavaScript, le contenu animé reste visible */}
        <noscript>
          <style>{`.reveal{visibility:visible!important}`}</style>
        </noscript>
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
