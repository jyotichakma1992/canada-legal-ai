export const TERMS_CONSENT_COOKIE = "cla-terms";

/** Bump this when agreement must be given again. */
export const TERMS_CONSENT_VALUE = "2026-11-10-3";

export function isTermsConsent(value: string | undefined | null): boolean {
  return value === TERMS_CONSENT_VALUE;
}

export function browserHasTermsConsent(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((part) => part.trim() === `${TERMS_CONSENT_COOKIE}=${TERMS_CONSENT_VALUE}`);
}
