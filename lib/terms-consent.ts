export const TERMS_CONSENT_COOKIE = "cla-terms";

/** Bump this when agreement must be given again. */
export const TERMS_CONSENT_VALUE = "2026-11-10-2";

export function isTermsConsent(value: string | undefined | null): boolean {
  return value === TERMS_CONSENT_VALUE;
}
