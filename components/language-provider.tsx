"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { LANG_COOKIE, type Lang } from "@/lib/language";
import { ui, type Ui } from "@/lib/ui";

type LanguageValue = {
  lang: Lang;
  t: Ui;
  choose: (next: Lang) => void;
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const router = useRouter();

  useEffect(() => {
    document.documentElement.lang = lang === "fr" ? "fr-CA" : "en-CA";
  }, [lang]);

  const choose = useCallback(
    (next: Lang) => {
      document.cookie = `${LANG_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
      setLang(next);
      router.refresh();
    },
    [router],
  );

  const value = useMemo(() => ({ lang, t: ui(lang), choose }), [lang, choose]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("LanguageProvider is missing");
  }
  return value;
}
