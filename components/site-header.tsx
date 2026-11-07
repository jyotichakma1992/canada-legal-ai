"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLanguage } from "@/components/language-provider";
import { PROVINCE_GUIDES } from "@/lib/provinces";
import { placeName } from "@/lib/ui";

export function SiteHeader() {
  const pathname = usePathname();
  const { lang, t, choose } = useLanguage();
  const primary = [
    { href: "/", label: t.home },
    { href: "/about", label: t.about },
    { href: "/contact", label: t.contact },
  ];

  return (
    <header className="shrink-0 border-b border-line bg-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href="/"
              className="font-serif text-xl tracking-tight text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t.siteName}
            </Link>
            <p className="mt-0.5 text-sm text-muted">{t.tagline}</p>
            <p className="text-sm text-ink">{t.forAnyone}</p>
          </div>
          <div role="group" aria-label={t.languageLabel} className="flex shrink-0 items-center gap-1 pt-1 text-sm">
            <LangButton active={lang === "en"} onClick={() => choose("en")}>
              EN
            </LangButton>
            <span className="text-muted" aria-hidden="true">
              /
            </span>
            <LangButton active={lang === "fr"} onClick={() => choose("fr")}>
              FR
            </LangButton>
          </div>
        </div>
        <nav aria-label={t.primaryNav} className="flex flex-wrap gap-x-4 gap-y-2">
          {primary.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "font-medium text-navy underline" : "text-accent hover:underline"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <nav aria-label={t.allOfCanada}>
          <p className="text-sm font-semibold text-navy">{t.allOfCanada}</p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
            {PROVINCE_GUIDES.map((guide) => {
              const href = `/${guide.slug}`;
              const active = pathname === href;
              return (
                <li key={guide.id}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      active ? "font-medium text-navy underline" : "text-accent hover:underline"
                    }`}
                  >
                    {placeName(guide.id, lang)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

function LangButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-11 min-w-11 rounded px-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active ? "text-navy underline decoration-2 underline-offset-4" : "text-muted hover:text-navy"
      }`}
    >
      {children}
    </button>
  );
}
