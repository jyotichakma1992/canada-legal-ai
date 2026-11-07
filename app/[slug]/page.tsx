import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProvinceGuidePage } from "@/components/province-guide";
import { placeName } from "@/lib/ui";
import { PROVINCE_GUIDES, provinceBySlug } from "@/lib/provinces";
import { getRequestLang } from "@/lib/request-lang";

type GuideProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PROVINCE_GUIDES.map((province) => ({ slug: province.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: GuideProps): Promise<Metadata> {
  const { slug } = await params;
  const province = provinceBySlug(slug);
  if (!province) return {};

  const lang = await getRequestLang();
  const title = placeName(province.id, lang);
  const description =
    lang === "fr"
      ? province.kind === "federal"
        ? "Point de départ en langage clair pour les questions fédérales et pancanadiennes. Information générale, pas un cabinet d'avocats."
        : `Point de départ en langage clair pour ${title}. Information générale, pas un cabinet d'avocats.`
      : province.kind === "federal"
        ? "Plain-language starting point for federal and Canada-wide questions. General information, not a law firm."
        : `Plain-language starting point for anyone in ${province.name}. General information, not a law firm.`;

  return { title, description };
}

export default async function GuidePage({ params }: GuideProps) {
  const { slug } = await params;
  const province = provinceBySlug(slug);
  if (!province) notFound();
  return <ProvinceGuidePage province={province} />;
}
