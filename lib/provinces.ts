import type { JurisdictionId } from "@/lib/jurisdictions";

export type GuideKind = "province" | "territory" | "federal";

export type ProvinceGuide = {
  id: JurisdictionId;
  slug: string;
  name: string;
  kind: GuideKind;
  lede: string;
  covers: string[];
  jurisdiction: string[];
  officialName: string;
  officialUrl: string;
};

const AUDIENCE =
  "families, students, drivers, consumers, small businesses, employees, tenants, newcomers, and people dealing with police, benefits, or a court";

function covers(place: "province" | "territory"): string[] {
  return [
    "Family, parenting, and what happens when a relationship ends.",
    "Driving, tickets, and everyday problems on the road.",
    "Work, a small business, and a contract someone is about to sign.",
    "Housing, rent, and a purchase that went wrong.",
    "Benefits, debt, small claims, wills, and unfair treatment.",
    `Police, a criminal charge, or an immigration application. Those subjects are mostly federal, even for people who live in the ${place}.`,
  ];
}

function commonLawPlace(input: {
  id: JurisdictionId;
  slug: string;
  name: string;
  kind: "province" | "territory";
  officialName: string;
  officialUrl: string;
}): ProvinceGuide {
  const level = input.kind === "territory" ? "territorial" : "provincial";
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    kind: input.kind,
    lede: `A starting point for anyone in ${input.name}: ${AUDIENCE}. The chat explains general rules. It is not a lawyer and it does not represent you.`,
    covers: covers(input.kind),
    jurisdiction: [
      `${input.name} sets many of the rules for housing, most workplaces, consumer sales, driving, wills, and ${level} offences.`,
      `Family questions can involve both ${input.name} law and federal rules about divorce. Benefits can be ${level} or federal. The answer should say which level it is describing.`,
      "Criminal law and immigration are federal. Some jobs, including banks, airlines, and the federal government, follow federal labour rules.",
      `If a statute, case, or link cannot be verified, the answer says so. Read the wording on ${input.officialName} and the federal Justice Laws website before you rely on it.`,
    ],
    officialName: input.officialName,
    officialUrl: input.officialUrl,
  };
}

export const PROVINCE_GUIDES: ProvinceGuide[] = [
  {
    id: "QC",
    slug: "quebec",
    name: "Quebec",
    kind: "province",
    lede: "A starting point for anyone in Quebec. Private matters here often follow the Civil Code of Québec, which is different from the common law used elsewhere in Canada. The chat is not a lawyer and it does not represent you.",
    covers: covers("province"),
    jurisdiction: [
      "Quebec uses civil law for many private matters, including a large part of family property, housing, wills, and contracts. The other provinces use common law for those subjects.",
      "Quebec also sets many rules for driving, consumer purchases, most workplaces, and provincial offences. Benefits can be provincial or federal.",
      "Federal law still applies in Quebec. Criminal law and immigration are federal. Some workplaces are federally regulated.",
      "When Quebec is selected, the chat answers in French. For every other province, territory, or a Canada-wide question, it answers in English. It says so when it cannot verify a source. Check LégisQuébec and the federal Justice Laws website.",
    ],
    officialName: "LégisQuébec",
    officialUrl: "https://www.legisquebec.gouv.qc.ca",
  },
  commonLawPlace({
    id: "ON",
    slug: "ontario",
    name: "Ontario",
    kind: "province",
    officialName: "Ontario e-Laws",
    officialUrl: "https://www.ontario.ca/laws",
  }),
  commonLawPlace({
    id: "BC",
    slug: "british-columbia",
    name: "British Columbia",
    kind: "province",
    officialName: "BC Laws",
    officialUrl: "https://www.bclaws.gov.bc.ca",
  }),
  commonLawPlace({
    id: "AB",
    slug: "alberta",
    name: "Alberta",
    kind: "province",
    officialName: "Alberta King's Printer",
    officialUrl: "https://www.alberta.ca/alberta-kings-printer",
  }),
  commonLawPlace({
    id: "MB",
    slug: "manitoba",
    name: "Manitoba",
    kind: "province",
    officialName: "Manitoba Laws",
    officialUrl: "https://web2.gov.mb.ca/laws/index.php",
  }),
  commonLawPlace({
    id: "SK",
    slug: "saskatchewan",
    name: "Saskatchewan",
    kind: "province",
    officialName: "Government of Saskatchewan",
    officialUrl: "https://www.saskatchewan.ca/residents/justice-crime-and-the-law",
  }),
  commonLawPlace({
    id: "NS",
    slug: "nova-scotia",
    name: "Nova Scotia",
    kind: "province",
    officialName: "Nova Scotia Legislature",
    officialUrl: "https://nslegislature.ca/legislative-business/bills-statutes",
  }),
  commonLawPlace({
    id: "NB",
    slug: "new-brunswick",
    name: "New Brunswick",
    kind: "province",
    officialName: "New Brunswick Acts and Regulations",
    officialUrl: "https://laws.gnb.ca/",
  }),
  commonLawPlace({
    id: "NL",
    slug: "newfoundland-and-labrador",
    name: "Newfoundland and Labrador",
    kind: "province",
    officialName: "House of Assembly of Newfoundland and Labrador",
    officialUrl: "https://www.assembly.nl.ca/legislation/sr/statutes/",
  }),
  commonLawPlace({
    id: "PE",
    slug: "prince-edward-island",
    name: "Prince Edward Island",
    kind: "province",
    officialName: "Government of Prince Edward Island",
    officialUrl: "https://www.princeedwardisland.ca/en/legislation",
  }),
  commonLawPlace({
    id: "YT",
    slug: "yukon",
    name: "Yukon",
    kind: "territory",
    officialName: "Yukon Laws",
    officialUrl: "https://laws.yukon.ca/",
  }),
  commonLawPlace({
    id: "NT",
    slug: "northwest-territories",
    name: "Northwest Territories",
    kind: "territory",
    officialName: "Government of the Northwest Territories",
    officialUrl: "https://gnwt.ca/laws-crime-and-justice/legislation-and-legislative-publications",
  }),
  commonLawPlace({
    id: "NU",
    slug: "nunavut",
    name: "Nunavut",
    kind: "territory",
    officialName: "Nunavut Legislation",
    officialUrl: "https://www.nunavutlegislation.ca/en",
  }),
  {
    id: "CA",
    slug: "canada",
    name: "Federal / Canada-wide",
    kind: "federal",
    lede: "A starting point for questions that apply across Canada, or when you are not sure which province or territory's law matters. The chat explains general rules. It is not a lawyer and it does not represent you.",
    covers: [
      "Criminal law, and what usually happens after the police charge someone.",
      "Immigration, citizenship, and coming to Canada.",
      "Divorce, and the point where a province or territory still sets the family rules.",
      "Jobs at banks, airlines, railways, and the federal public service.",
      "Federal benefits, and when a province or territory runs its own program.",
      "A problem that may depend on where in Canada you live. The answer should say when to pick that place.",
    ],
    jurisdiction: [
      "Parliament makes criminal law, immigration law, and many other rules that apply in every province and territory.",
      "Housing, most jobs, driving, wills, and consumer sales are usually set by the province or territory. Pick that place in the chat when the question is about life there.",
      "Family questions can mix federal rules about divorce with provincial or territorial rules. Benefits can be federal, provincial, or territorial.",
      "If a statute, case, or link cannot be verified, the answer says so. Read the wording on the Justice Laws website, and on the official site for the province or territory, before you rely on it.",
    ],
    officialName: "Justice Laws website",
    officialUrl: "https://laws-lois.justice.gc.ca",
  },
];

export function provinceBySlug(slug: string): ProvinceGuide | undefined {
  return PROVINCE_GUIDES.find((province) => province.slug === slug);
}
