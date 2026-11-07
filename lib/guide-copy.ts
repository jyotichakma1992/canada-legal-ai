import type { Lang } from "@/lib/language";
import type { JurisdictionId } from "@/lib/jurisdictions";
import type { ProvinceGuide } from "@/lib/provinces";

const FEDERAL_LAWS = "https://laws-lois.justice.gc.ca";

type PlaceFr = {
  name: string;
  inPlace: string;
  ofPlace: string;
};

const PLACE: Record<JurisdictionId, PlaceFr> = {
  QC: { name: "Québec", inPlace: "au Québec", ofPlace: "du Québec" },
  ON: { name: "Ontario", inPlace: "en Ontario", ofPlace: "de l'Ontario" },
  BC: { name: "Colombie-Britannique", inPlace: "en Colombie-Britannique", ofPlace: "de la Colombie-Britannique" },
  AB: { name: "Alberta", inPlace: "en Alberta", ofPlace: "de l'Alberta" },
  MB: { name: "Manitoba", inPlace: "au Manitoba", ofPlace: "du Manitoba" },
  SK: { name: "Saskatchewan", inPlace: "en Saskatchewan", ofPlace: "de la Saskatchewan" },
  NS: { name: "Nouvelle-Écosse", inPlace: "en Nouvelle-Écosse", ofPlace: "de la Nouvelle-Écosse" },
  NB: { name: "Nouveau-Brunswick", inPlace: "au Nouveau-Brunswick", ofPlace: "du Nouveau-Brunswick" },
  NL: {
    name: "Terre-Neuve-et-Labrador",
    inPlace: "à Terre-Neuve-et-Labrador",
    ofPlace: "de Terre-Neuve-et-Labrador",
  },
  PE: {
    name: "Île-du-Prince-Édouard",
    inPlace: "à l'Île-du-Prince-Édouard",
    ofPlace: "de l'Île-du-Prince-Édouard",
  },
  YT: { name: "Yukon", inPlace: "au Yukon", ofPlace: "du Yukon" },
  NT: {
    name: "Territoires du Nord-Ouest",
    inPlace: "aux Territoires du Nord-Ouest",
    ofPlace: "des Territoires du Nord-Ouest",
  },
  NU: { name: "Nunavut", inPlace: "au Nunavut", ofPlace: "du Nunavut" },
  CA: { name: "Fédéral / partout au Canada", inPlace: "au Canada", ofPlace: "du Canada" },
};

export type GuideView = {
  title: string;
  lede: string;
  covers: string[];
  scopeHeading: string;
  jurisdiction: string[];
  officialLead: string;
  federalLead: string;
  federalName: string;
  showFederalLink: boolean;
  closing: string;
  askLabel: string;
};

export function guideView(province: ProvinceGuide, lang: Lang): GuideView {
  const sameFederalSite = province.officialUrl.replace(/\/$/, "") === FEDERAL_LAWS;
  if (lang === "en") {
    const scopeHeading =
      province.kind === "federal"
        ? "Federal law and provincial law"
        : province.kind === "territory"
          ? "Territorial law and federal law"
          : "Provincial law and federal law";
    const askLabel =
      province.kind === "federal" ? "Ask a Canada-wide question" : `Ask about ${province.name} law`;
    const closing =
      province.kind === "federal"
        ? "The chat is general information for anyone in Canada, not a lawyer. It will say when a rule is federal and when a province or territory's own law matters. If it cannot verify a statute, case, or link, it says that instead of guessing."
        : `The chat is general information for anyone in ${province.name}, not a lawyer. It will say when a rule is ${province.kind === "territory" ? "territorial" : "provincial"} and when it is federal. If it cannot verify a statute, case, or link, it says that instead of guessing.`;

    return {
      title: province.name,
      lede: province.lede,
      covers: province.covers,
      scopeHeading,
      jurisdiction: province.jurisdiction,
      officialLead: "Official text:",
      federalLead: "Federal statutes:",
      federalName: "Justice Laws website",
      showFederalLink: !sameFederalSite,
      closing,
      askLabel,
    };
  }

  return frenchGuide(province, !sameFederalSite);
}

function frenchGuide(province: ProvinceGuide, showFederalLink: boolean): GuideView {
  const place = PLACE[province.id];
  if (province.kind === "federal") {
    return {
      title: place.name,
      lede: "Un point de départ pour les questions qui s'appliquent dans tout le Canada, ou lorsque vous ne savez pas quelle loi provinciale ou territoriale compte. La conversation explique des règles générales. Ce n'est pas un avocat et elle ne vous représente pas.",
      covers: [
        "Le droit criminel, et ce qui se passe en général après une accusation de la police.",
        "L'immigration, la citoyenneté et l'arrivée au Canada.",
        "Le divorce, et le moment où une province ou un territoire fixe encore les règles de la famille.",
        "Les emplois dans les banques, les compagnies aériennes, les chemins de fer et la fonction publique fédérale.",
        "Les prestations fédérales, et le cas où une province ou un territoire gère son propre programme.",
        "Un problème qui peut dépendre de l'endroit où vous vivez au Canada. La réponse devrait dire quand choisir cet endroit.",
      ],
      scopeHeading: "Droit fédéral et droit provincial",
      jurisdiction: [
        "Le Parlement établit le droit criminel, le droit de l'immigration et de nombreuses autres règles qui s'appliquent dans chaque province et territoire.",
        "Le logement, la plupart des emplois, la conduite, les testaments et les ventes aux consommateurs sont en général fixés par la province ou le territoire. Choisissez cet endroit dans la conversation lorsque la question porte sur la vie là-bas.",
        "Les questions de famille peuvent mêler des règles fédérales sur le divorce et des règles provinciales ou territoriales. Les prestations peuvent être fédérales, provinciales ou territoriales.",
        "Si une loi, une décision ou un lien ne peut pas être vérifié, la réponse le dit. Lisez le texte sur le site Justice Laws et sur le site officiel de la province ou du territoire avant de vous y fier.",
      ],
      officialLead: "Texte officiel :",
      federalLead: "Lois fédérales :",
      federalName: "site Justice Laws",
      showFederalLink,
      closing:
        "La conversation donne de l'information générale pour toute personne au Canada, pas un avis d'avocat. Elle dira quand une règle est fédérale et quand la loi d'une province ou d'un territoire compte. Si elle ne peut pas vérifier une loi, une décision ou un lien, elle le dit au lieu de deviner.",
      askLabel: "Poser une question pour l'ensemble du Canada",
    };
  }

  const level = province.kind === "territory" ? "territoriale" : "provinciale";
  const scopeHeading =
    province.kind === "territory" ? "Droit territorial et droit fédéral" : "Droit provincial et droit fédéral";

  const covers = [
    "Famille, parentalité et ce qui se passe lorsqu'une relation se termine.",
    "Conduite, contraventions et problèmes courants sur la route.",
    "Travail, petite entreprise et contrat qu'une personne s'apprête à signer.",
    "Logement, loyer et achat qui a mal tourné.",
    "Prestations, dettes, petites créances, testaments et traitement injuste.",
    `Police, accusation criminelle ou demande d'immigration. Ces sujets sont surtout fédéraux, même pour les personnes qui vivent ${place.inPlace}.`,
  ];

  const jurisdiction =
    province.id === "QC"
      ? [
          "Le Québec utilise le droit civil pour de nombreuses affaires privées, dont une grande partie du patrimoine familial, du logement, des testaments et des contrats. Les autres provinces utilisent la common law pour ces sujets.",
          "Le Québec établit aussi de nombreuses règles sur la conduite, les achats des consommateurs, la plupart des milieux de travail et les infractions provinciales. Les prestations peuvent être provinciales ou fédérales.",
          "Le droit fédéral s'applique aussi au Québec. Le droit criminel et l'immigration sont fédéraux. Certains milieux de travail sont de compétence fédérale.",
          "Lorsque le Québec est choisi, la conversation répond en français. Pour les autres provinces, territoires et questions pancanadiennes, elle répond en anglais. Elle le dit lorsqu'elle ne peut pas vérifier une source. Consultez LégisQuébec et le site fédéral Justice Laws.",
        ]
      : [
          `${place.name} établit une grande partie des règles sur le logement, la plupart des milieux de travail, les ventes aux consommateurs, la conduite, les testaments et les infractions ${level}s.`,
          `Les questions de famille peuvent relever à la fois du droit ${place.ofPlace} et des règles fédérales sur le divorce. Les prestations peuvent être ${level}s ou fédérales. La réponse devrait dire de quel niveau il s'agit.`,
          "Le droit criminel et l'immigration sont fédéraux. Certains emplois, dont les banques, les compagnies aériennes et le gouvernement fédéral, suivent les règles fédérales du travail.",
          `Si une loi, une décision ou un lien ne peut pas être vérifié, la réponse le dit. Lisez le texte sur ${province.officialName} et sur le site fédéral Justice Laws avant de vous y fier.`,
        ];

  return {
    title: place.name,
    lede:
      province.id === "QC"
        ? "Un point de départ pour toute personne au Québec. Les affaires privées y suivent souvent le Code civil du Québec, qui diffère de la common law utilisée ailleurs au Canada. La conversation n'est pas un avocat et elle ne vous représente pas."
        : `Un point de départ pour toute personne ${place.inPlace} : familles, étudiants, conducteurs, consommateurs, petites entreprises, employés, locataires, nouveaux arrivants, et personnes aux prises avec la police, des prestations ou un tribunal. La conversation explique des règles générales. Ce n'est pas un avocat et elle ne vous représente pas.`,
    covers,
    scopeHeading,
    jurisdiction,
    officialLead: "Texte officiel :",
    federalLead: "Lois fédérales :",
    federalName: "site Justice Laws",
    showFederalLink,
    closing: `La conversation donne de l'information générale pour toute personne ${place.inPlace}, pas un avis d'avocat. Elle dira quand une règle est ${level} et quand elle est fédérale. Si elle ne peut pas vérifier une loi, une décision ou un lien, elle le dit au lieu de deviner.`,
    askLabel: `Poser une question sur le droit ${place.ofPlace}`,
  };
}
