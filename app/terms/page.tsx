import type { Metadata } from "next";

import { TermsView } from "@/components/static-pages";
import { getRequestLang } from "@/lib/request-lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  if (lang === "fr") {
    return {
      title: "Conditions",
      description:
        "Conditions d'utilisation de Canada Legal AI comme information juridique générale, et non comme un cabinet d'avocats.",
    };
  }
  return {
    title: "Terms",
    description: "Terms for using Canada Legal AI as general legal information, not as a law firm.",
  };
}

export default function TermsPage() {
  return <TermsView />;
}
