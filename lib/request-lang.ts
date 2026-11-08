import { cookies } from "next/headers";

import { isLang, type Lang, LANG_COOKIE } from "@/lib/language";

/** The language the person chose. English until they pick French or English. */
export async function getRequestLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "en";
}
