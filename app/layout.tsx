import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";

import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_NAME, TAGLINE } from "@/lib/copy";
import { getRequestLang } from "@/lib/request-lang";
import { ui } from "@/lib/ui";

import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const copy = ui(lang);
  return {
    title: {
      default: SITE_NAME,
      template: `%s · ${SITE_NAME}`,
    },
    description:
      lang === "fr"
        ? `${copy.tagline} Information juridique en langage clair pour toute personne au Canada.`
        : `${TAGLINE} Plain-language legal information for anyone in Canada.`,
    applicationName: SITE_NAME,
    openGraph: {
      title: SITE_NAME,
      description: copy.tagline,
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getRequestLang();
  const copy = ui(lang);

  return (
    <html lang={lang === "fr" ? "fr-CA" : "en-CA"} className={`${sourceSans.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased">
        <LanguageProvider initialLang={lang}>
          <div className="flex min-h-dvh flex-col bg-white">
            <div className="h-0.5 shrink-0 bg-navy" />
            <SiteHeader />
            <noscript>
              <p className="bg-navy px-4 py-2 text-center text-sm text-white">{copy.noscript}</p>
            </noscript>
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
