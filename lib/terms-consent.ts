export const TERMS_CONSENT_COOKIE = "cla-terms";

/** Bump this when the terms text changes so people must agree again. */
export const TERMS_CONSENT_VALUE = "2026-11-10";

export function isTermsConsent(value: string | undefined | null): boolean {
  return value === TERMS_CONSENT_VALUE;
}
