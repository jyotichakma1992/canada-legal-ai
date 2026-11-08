"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { t } = useLanguage();
  const links = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
    { href: "/terms", label: t.terms },
    { href: "/privacy", label: t.privacy },
  ];

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
        <p className="font-serif text-lg text-navy">{t.siteName}</p>
        <p className="mt-1 text-sm text-muted">{t.tagline}</p>
        <p className="mt-1 text-sm text-ink">{t.forAnyone}</p>
        <nav aria-label={t.footerNav} className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-accent underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">{t.footerNote}</p>
      </div>
    </footer>
  );
}
