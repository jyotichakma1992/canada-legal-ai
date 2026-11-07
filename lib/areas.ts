export type LawArea = {
  id: string;
  label: string;
  question: string;
};

const LAW_AREAS_FR: readonly LawArea[] = [
  {
    id: "criminal",
    label: "Criminel",
    question: "Que se passe-t-il en général si la police accuse quelqu'un d'une infraction ?",
  },
  {
    id: "family",
    label: "Famille",
    question: "Comment fonctionnent les décisions parentales lorsque les parents vivent séparés ?",
  },
  {
    id: "employment",
    label: "Emploi",
    question: "Quelles sont les options habituelles lorsqu'une personne perd son emploi ?",
  },
  {
    id: "housing",
    label: "Logement",
    question: "Que peut demander une personne au sujet d'un problème de loyer ou de logement ?",
  },
  {
    id: "immigration",
    label: "Immigration",
    question: "Que demandent en général les gens au sujet d'une demande d'immigration au Canada ?",
  },
  {
    id: "consumer",
    label: "Consommation",
    question: "Que peut faire un acheteur lorsqu'un achat ou un contrat tourne mal ?",
  },
  {
    id: "wills",
    label: "Testaments et successions",
    question: "Que devrait examiner une famille après un décès ?",
  },
  {
    id: "debt",
    label: "Petites créances et dettes",
    question: "Que se passe-t-il aux petites créances si quelqu'un ne paie pas ce qu'il doit ?",
  },
  {
    id: "human-rights",
    label: "Droits de la personne",
    question: "Par où commencer si une personne a été traitée injustement en raison de qui elle est ?",
  },
  {
    id: "traffic",
    label: "Circulation",
    question: "Que peut faire un conducteur pour contester une contravention ?",
  },
  {
    id: "benefits",
    label: "Prestations",
    question: "Que peut examiner une personne si une prestation gouvernementale est refusée ?",
  },
  {
    id: "business",
    label: "Entreprise",
    question: "Que devrait vérifier une petite entreprise avant de signer un contrat ?",
  },
] as const;

export const LAW_AREAS: readonly LawArea[] = [
  {
    id: "criminal",
    label: "Criminal",
    question: "What usually happens if the police charge someone with an offence?",
  },
  {
    id: "family",
    label: "Family",
    question: "How do parenting decisions work when parents live apart?",
  },
  {
    id: "employment",
    label: "Employment",
    question: "What are the usual options if someone loses a job?",
  },
  {
    id: "housing",
    label: "Housing",
    question: "What can a person ask about a problem with rent or a home?",
  },
  {
    id: "immigration",
    label: "Immigration",
    question: "What do people usually ask about a Canadian immigration application?",
  },
  {
    id: "consumer",
    label: "Consumer",
    question: "What can a shopper do when a purchase or a contract goes wrong?",
  },
  {
    id: "wills",
    label: "Wills and estates",
    question: "What should a family look into after a person dies?",
  },
  {
    id: "debt",
    label: "Small claims and debt",
    question: "What happens in small claims if someone will not pay what they owe?",
  },
  {
    id: "human-rights",
    label: "Human rights",
    question: "Where can someone start if they were treated unfairly because of who they are?",
  },
  {
    id: "traffic",
    label: "Traffic",
    question: "What can a driver do about a traffic ticket they want to dispute?",
  },
  {
    id: "benefits",
    label: "Benefits",
    question: "What can someone look at if a government benefit is refused?",
  },
  {
    id: "business",
    label: "Business",
    question: "What should a small business check before signing a contract?",
  },
] as const;

const EXAMPLE_IDS = ["family", "traffic", "employment", "criminal", "debt"] as const;

function questionsFor(areas: readonly LawArea[]): string[] {
  return EXAMPLE_IDS.map((id) => {
    const area = areas.find((item) => item.id === id);
    if (!area) {
      throw new Error(`Missing example area: ${id}`);
    }
    return area.question;
  });
}

export const EXAMPLE_QUESTIONS = questionsFor(LAW_AREAS);

export function areasFor(lang: "en" | "fr"): readonly LawArea[] {
  return lang === "fr" ? LAW_AREAS_FR : LAW_AREAS;
}

export function examplesFor(lang: "en" | "fr"): string[] {
  return questionsFor(areasFor(lang));
}
