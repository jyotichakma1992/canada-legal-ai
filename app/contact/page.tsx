import type { Metadata } from "next";

import { ContactView } from "@/components/static-pages";
import { getRequestLang } from "@/lib/request-lang";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  if (lang === "fr") {
    return {
      title: "Contact",
      description: "Écrire à Canada Legal AI. Les messages ne sont pas enregistrés sur ce site.",
    };
  }
  return {
    title: "Contact",
    description: "Email Canada Legal AI. Messages are not stored on this website.",
  };
}

export default function ContactPage() {
  return <ContactView />;
}
