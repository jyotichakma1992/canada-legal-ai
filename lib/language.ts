export type Lang = "en" | "fr";

export const LANG_COOKIE = "cla-lang";

export function isLang(value: string | undefined | null): value is Lang {
  return value === "en" || value === "fr";
}

/** French by default only on the Quebec guide. Every other path stays English. */
export function langForPath(pathname: string): Lang {
  return pathname === "/quebec" ? "fr" : "en";
}
