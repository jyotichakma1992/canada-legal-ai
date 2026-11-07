import { ChatApp } from "@/components/chat-app";
import { isJurisdictionId, type JurisdictionId } from "@/lib/jurisdictions";

type HomeProps = {
  searchParams: Promise<{ jurisdiction?: string | string[] }>;
};

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const raw = Array.isArray(params.jurisdiction) ? params.jurisdiction[0] : params.jurisdiction;
  const initialJurisdiction: JurisdictionId | undefined =
    raw && isJurisdictionId(raw) ? raw : undefined;

  return <ChatApp initialJurisdiction={initialJurisdiction} />;
}
