import type { Metadata } from "next";

import { AboutView } from "@/components/static-pages";
import { getRequestLang } from "@/lib/request-lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  if (lang === "fr") {
    return {
      title: "À propos",
      description:
        "Canada Legal AI explique le droit canadien en langage clair pour toute personne au Canada, de la famille et de la conduite jusqu'au tribunal, aux prestations et à la petite entreprise.",
    };
  }
  return {
    title: "About",
    description:
      "Canada Legal AI explains Canadian law in plain language for anyone in Canada, from family and driving to court, benefits, and small business.",
  };
}

export default function AboutPage() {
  return <AboutView />;
}
