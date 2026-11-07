import { cookies, headers } from "next/headers";

import { isJurisdictionId, type JurisdictionId } from "@/lib/jurisdictions";
import { isLang, langForPath, type Lang, LANG_COOKIE } from "@/lib/language";

export async function getLockedLang(): Promise<Lang | null> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : null;
}

export async function getRequestLang(): Promise<Lang> {
  const locked = await getLockedLang();
  if (locked) return locked;

  const headerStore = await headers();
  const path = headerStore.get("x-pathname") ?? "";
  if (langForPath(path) === "fr") return "fr";
  if (path === "/" && headerStore.get("x-cla-jurisdiction") === "QC") return "fr";
  return "en";
}

/** Home page only. Keeps the first paint in French when Quebec is already selected. */
export async function getInitialChatJurisdiction(): Promise<JurisdictionId | null> {
  const headerStore = await headers();
  const path = headerStore.get("x-pathname") ?? "";
  if (path !== "/") return null;
  const value = headerStore.get("x-cla-jurisdiction");
  if (value === "QC" && isJurisdictionId(value)) return value;
  return null;
}
