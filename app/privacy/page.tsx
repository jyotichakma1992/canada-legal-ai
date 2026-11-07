import type { Metadata } from "next";

import { PrivacyView } from "@/components/static-pages";
import { getRequestLang } from "@/lib/request-lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  if (lang === "fr") {
    return {
      title: "Confidentialité",
      description:
        "Canada Legal AI ne conserve pas de comptes, de conversations ni de messages de formulaire.",
    };
  }
  return {
    title: "Privacy",
    description: "Canada Legal AI does not keep accounts, conversations, or contact form submissions.",
  };
}

export default function PrivacyPage() {
  return <PrivacyView />;
}
