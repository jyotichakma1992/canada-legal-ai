"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { JurisdictionId } from "@/lib/jurisdictions";
import { LANG_COOKIE, type Lang } from "@/lib/language";
import { ui, type Ui } from "@/lib/ui";

type LanguageValue = {
  lang: Lang;
  t: Ui;
  choose: (next: Lang) => void;
  setChatJurisdiction: (id: JurisdictionId | null) => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({
  locked: lockedFromServer,
  initialChatJurisdiction,
  children,
}: {
  locked: Lang | null;
  initialChatJurisdiction: JurisdictionId | null;
  children: React.ReactNode;
}) {
  const [locked, setLocked] = useState<Lang | null>(lockedFromServer);
  const [chatJurisdiction, setChatJurisdiction] = useState<JurisdictionId | null>(initialChatJurisdiction);
  const pathname = usePathname();
  const router = useRouter();

  const lang: Lang = locked ?? (pathname === "/quebec" || chatJurisdiction === "QC" ? "fr" : "en");

  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
  }, [lang]);

  const choose = useCallback(
    (next: Lang) => {
      document.cookie = `${LANG_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      setLocked(next);
      router.refresh();
    },
    [router],
  );

  const value = useMemo(
    () => ({ lang, t: ui(lang), choose, setChatJurisdiction }),
    [lang, choose],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("LanguageProvider is missing");
  }
  return value;
}
