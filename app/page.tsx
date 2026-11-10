import { cookies } from "next/headers";

import { ChatApp } from "@/components/chat-app";
import { isJurisdictionId, type JurisdictionId } from "@/lib/jurisdictions";
import { isTermsConsent, TERMS_CONSENT_COOKIE } from "@/lib/terms-consent";

type HomeProps = {
  searchParams: Promise<{ jurisdiction?: string | string[] }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.jurisdiction) ? params.jurisdiction[0] : params.jurisdiction;
  const initialJurisdiction: JurisdictionId | undefined =
    raw && isJurisdictionId(raw) ? raw : undefined;
  const consent = (await cookies()).get(TERMS_CONSENT_COOKIE)?.value;

  return (
    <ChatApp
      initialJurisdiction={initialJurisdiction}
      initialTermsAccepted={isTermsConsent(consent)}
    />
  );
}
