export type Lang = "en" | "fr";

export const LANG_COOKIE = "cla-lang";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "en" || value === "fr";
}
