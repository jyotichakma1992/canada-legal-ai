/** sessionStorage key. Bump TERMS_VERSION when agreement must be given again. */
export const TERMS_STORAGE_KEY = "terms_accepted_v1";

export const TERMS_VERSION = "1";

export const TERMS_ACCEPTANCE_HEADER = "x-cla-terms-accepted";

export const TERMS_REQUIRED_ERROR =
  "Please read and accept the Terms first. / Veuillez d'abord lire et accepter les conditions.";

export function isTermsConsent(value: string | undefined | null): boolean {
  return value === TERMS_VERSION;
}

export function browserHasTermsConsent(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(TERMS_STORAGE_KEY) === TERMS_VERSION;
  } catch {
    return false;
  }
}
