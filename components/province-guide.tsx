"use client";

import Link from "next/link";

import { InfoPage } from "@/components/info-page";
import { useLanguage } from "@/components/language-provider";
import { guideView } from "@/lib/guide-copy";
import type { ProvinceGuide } from "@/lib/provinces";

const FEDERAL_LAWS = "https://laws-lois.justice.gc.ca";

export function ProvinceGuidePage({ province }: { province: ProvinceGuide }) {
  const { lang } = useLanguage();
  const view = guideView(province, lang);

  return (
    <InfoPage title={view.title} lede={view.lede}>
      <h2>{lang === "fr" ? "Ce que cela couvre" : "What this covers"}</h2>
      <ul>
        {view.covers.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2>{view.scopeHeading}</h2>
      {view.jurisdiction.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <p>
        {view.officialLead}{" "}
        <a href={province.officialUrl} target="_blank" rel="noopener noreferrer">
          {province.officialName}
        </a>
        .
        {view.showFederalLink ? (
          <>
            {" "}
            {view.federalLead}{" "}
            <a href={FEDERAL_LAWS} target="_blank" rel="noopener noreferrer">
              {view.federalName}
            </a>
            .
          </>
        ) : null}
      </p>
      <p>{view.closing}</p>
      <p>
        <Link href={`/?jurisdiction=${province.id}`}>{view.askLabel}</Link>
      </p>
    </InfoPage>
  );
}
