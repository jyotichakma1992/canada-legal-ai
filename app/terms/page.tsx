import type { Metadata } from "next";

import { TermsView } from "@/components/static-pages";
import { getRequestLang } from "@/lib/request-lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  if (lang === "fr") {
    return {
      title: "Conditions",
      description:
        "Conditions d'utilisation : information générale seulement, aucune relation avocat-client, et limitation de responsabilité.",
    };
  }
  return {
    title: "Terms",
    description:
      "Terms of use: general information only, no lawyer-client relationship, and a limit on liability.",
  };
}

export default function TermsPage() {
  return <TermsView />;
}
