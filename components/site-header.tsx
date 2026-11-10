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
    <header className="shrink-0 border-b border-line bg-white shadow-sm">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-4">
          <div className="min-w-0">
            <Link
              href="/"
              className="font-serif text-2xl tracking-tight text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t.siteName}
            </Link>
            <p className="mt-0.5 text-sm text-muted">{t.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <nav aria-label={t.primaryNav} className="flex flex-wrap gap-x-5 gap-y-2">
              {primary.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-sm underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                      active ? "font-semibold text-navy underline" : "text-ink hover:text-navy hover:underline"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div role="group" aria-label={t.languageLabel} className="flex shrink-0 items-center gap-1 text-sm">
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
        </div>
        <nav aria-label={t.allOfCanada} className="border-t border-line py-3">
          <p className="text-xs font-semibold tracking-[0.12em] text-navy uppercase">{t.allOfCanada}</p>
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
                      active ? "font-semibold text-navy underline" : "text-ink hover:text-navy hover:underline"
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
