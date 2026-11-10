import {
  AUDIENCE_LINE,
  DISCLAIMER,
  HOME_HEADING,
  HOME_SUBTITLE,
  INPUT_PLACEHOLDER,
  SITE_NAME,
  TAGLINE,
} from "@/lib/copy";
import { jurisdictionById, type JurisdictionId } from "@/lib/jurisdictions";
import type { Lang } from "@/lib/language";

const PLACE_FR: Record<JurisdictionId, string> = {
  QC: "Québec",
  ON: "Ontario",
  BC: "Colombie-Britannique",
  AB: "Alberta",
  MB: "Manitoba",
  SK: "Saskatchewan",
  NS: "Nouvelle-Écosse",
  NB: "Nouveau-Brunswick",
  NL: "Terre-Neuve-et-Labrador",
  PE: "Île-du-Prince-Édouard",
  YT: "Yukon",
  NT: "Territoires du Nord-Ouest",
  NU: "Nunavut",
  CA: "Fédéral / partout au Canada",
};

export function placeName(id: JurisdictionId, lang: Lang): string {
  return lang === "fr" ? PLACE_FR[id] : jurisdictionById(id).label;
}

const ERRORS_FR: Record<string, string> = {
  "Too many questions from this network. Please wait a few minutes and try again.":
    "Trop de questions depuis ce réseau. Veuillez attendre quelques minutes et réessayer.",
  "That question could not be read. Please try again.":
    "Cette question n'a pas pu être lue. Veuillez réessayer.",
  "This conversation is too long. Start a new chat to continue.":
    "Cette conversation est trop longue. Commencez une nouvelle conversation pour continuer.",
  "The AI service rejected the server API key. Check GEMINI_API_KEY.":
    "Le service d'IA a refusé la clé API du serveur. Vérifiez GEMINI_API_KEY.",
  "The saved API key could not be sent. Check GEMINI_API_KEY.":
    "La clé API enregistrée n'a pas pu être envoyée. Vérifiez GEMINI_API_KEY.",
  "The AI service is busy right now. Please wait a moment and try again.":
    "Le service d'IA est occupé pour le moment. Veuillez patienter un instant et réessayer.",
  "The AI model is not available for this key right now. Please try again later.":
    "Le modèle d'IA n'est pas disponible pour cette clé pour le moment. Veuillez réessayer plus tard.",
  "The AI service could not answer just now. Please try again.":
    "Le service d'IA n'a pas pu répondre pour le moment. Veuillez réessayer.",
  "The AI service is not configured yet. Add GEMINI_API_KEY on the server and try again.":
    "Le service d'IA n'est pas encore configuré. Ajoutez GEMINI_API_KEY sur le serveur et réessayez.",
  "The AI service returned an empty answer. Please try again.":
    "Le service d'IA a renvoyé une réponse vide. Veuillez réessayer.",
  "Choose a province, territory, or Federal / Canada-wide.":
    "Choisissez une province, un territoire ou Fédéral / partout au Canada.",
  "Choose English or French.": "Choisissez le français ou l'anglais.",
  "Read and agree to the Terms before asking a question.":
    "Lisez et acceptez les conditions avant de poser une question.",
  "Type a question to continue.": "Écrivez une question pour continuer.",
  "That message could not be read.": "Ce message n'a pas pu être lu.",
  "That message is too long. Try a shorter question.":
    "Ce message est trop long. Essayez une question plus courte.",
  "You appear to be offline, or the server could not be reached.":
    "Vous semblez hors ligne, ou le serveur n'a pas pu être joint.",
  "Sign in to ask a question.": "Connectez-vous pour poser une question.",
  "The AI service declined to answer this question.":
    "Le service d'IA a refusé de répondre à cette question.",
  "The AI service timed out before it could answer.":
    "Le service d'IA a expiré avant de pouvoir répondre.",
  "The AI service could not be reached.": "Le service d'IA n'a pas pu être joint.",
  "The AI request failed before Google returned a status.":
    "La requête d'IA a échoué avant que Google ne renvoie un statut.",
  "The AI service returned an error that could not be shown.":
    "Le service d'IA a renvoyé une erreur qui ne peut pas être affichée.",
};

export function translateError(error: string, lang: Lang): string {
  if (lang === "en") return error;
  return ERRORS_FR[error] ?? error;
}

export type Ui = {
  siteName: string;
  tagline: string;
  forAnyone: string;
  homeHeading: string;
  homeSubtitle: string;
  audienceLine: string;
  yourProvince: string;
  provinceHint: string;
  newChat: string;
  disclaimer: string;
  answerNotice: string;
  questionHint: string;
  sentToGoogle: string;
  placeholder: string;
  send: string;
  enterHint: string;
  examples: string;
  empty: string;
  filled: string;
  areas: string;
  areasHint: string;
  whyTitle: string;
  why: readonly { title: string; text: string }[];
  tryAgain: string;
  thinking: string;
  languageLabel: string;
  allOfCanada: string;
  primaryNav: string;
  footerNav: string;
  home: string;
  about: string;
  contact: string;
  terms: string;
  termsGateTitle: string;
  scrollTerms: string;
  agreeTerms: string;
  privacy: string;
  noscript: string;
  footerNote: string;
  askQuestion: string;
};

const en: Ui = {
  siteName: SITE_NAME,
  tagline: TAGLINE,
  forAnyone: "For anyone in Canada.",
  homeHeading: HOME_HEADING,
  homeSubtitle: HOME_SUBTITLE,
  audienceLine: AUDIENCE_LINE,
  yourProvince: "Your province",
  provinceHint: "Pick where the problem is. Federal rules can still apply.",
  newChat: "New chat",
  disclaimer: DISCLAIMER,
  answerNotice:
    "This answer is general information generated by Google Gemini. It is not legal advice and it does not tell you what to do in your own case. A lawyer or paralegal licensed in your province or territory should review your situation before you rely on it.",
  questionHint:
    "A good question includes where it happened, what happened, and what you want to know. Leave out identity numbers and documents.",
  sentToGoogle:
    "The question and earlier messages in this chat are sent to Google to write the answer.",
  placeholder: INPUT_PLACEHOLDER,
  send: "Ask",
  enterHint: "Enter to ask. Shift+Enter for a new line.",
  examples: "Examples",
  empty: "No question yet. An example fills the box. It does not send until you press Send.",
  filled: "That question is in the box. Change it if you need to, then press Send.",
  areas: "Areas of law",
  areasHint:
    "Federal, provincial, and territorial. These shortcuts fill the box with a starting question. Add what happened, and keep the place you selected.",
  whyTitle: "Why people use this",
  why: [
    { title: "Plain English", text: "Answers use everyday words." },
    {
      title: "Province-aware",
      text: "The answer follows the place you pick, and says when a federal rule applies.",
    },
    {
      title: "Sources when they can be named",
      text: "If a source cannot be checked, the answer says so.",
    },
    {
      title: "Information, not a lawyer",
      text: "This is general information. It is not a lawyer and it does not represent you.",
    },
  ],
  tryAgain: "Try again",
  thinking: "Preparing an explanation…",
  languageLabel: "Language",
  allOfCanada: "All of Canada",
  primaryNav: "Primary",
  footerNav: "Footer",
  home: "Home",
  about: "About",
  contact: "Contact",
  terms: "Terms",
  termsGateTitle: "Read and agree before you ask",
  scrollTerms: "Scroll through the terms to the end. The agree button turns on after that.",
  agreeTerms: "I have read and understood the Terms and Conditions and I agree",
  privacy: "Privacy",
  noscript: "Canada Legal AI needs JavaScript to ask a question.",
  footerNote:
    "Canada Legal AI gives general legal information. It is not a law firm and does not represent users. Answers do not create a lawyer-client relationship.",
  askQuestion: "Ask a question",
};

const fr: Ui = {
  siteName: SITE_NAME,
  tagline: "Comprendre le droit canadien. Connaître vos droits.",
  forAnyone: "Pour toute personne au Canada.",
  homeHeading: "Comment puis-je vous aider aujourd'hui ?",
  homeSubtitle:
    "Demandez au sujet de la famille, de la conduite, d'une facture, d'un emploi, d'une accusation, d'une prestation, d'une entreprise, du logement ou d'une étape devant un tribunal. La réponse est une information générale, en français simple.",
  audienceLine:
    "Pour toute personne au Canada : familles, étudiants, conducteurs, consommateurs, petites entreprises, employés, locataires, nouveaux arrivants, et personnes aux prises avec la police, des prestations ou un tribunal.",
  yourProvince: "Votre province",
  provinceHint: "Indiquez où se situe le problème. Les règles fédérales peuvent quand même s'appliquer.",
  newChat: "Nouvelle conversation",
  disclaimer:
    "Les réponses sont produites par un système automatisé (Google Gemini Flash) à des fins d'éducation générale seulement. Ce n'est pas un avis juridique, une opinion juridique ni une consultation, et cela ne crée pas de relation avocat-client, parajuriste-client ou fiduciaire. Les réponses peuvent être erronées. Ce n'est pas un substitut à un avocat ou à un parajuriste membre d'un ordre dans votre province ou territoire. En posant une question, vous acceptez ces conditions.",
  answerNotice:
    "Cette réponse est une information générale produite par Google Gemini. Ce n'est pas un avis juridique et elle ne vous dit pas quoi faire dans votre propre situation. Un avocat ou un parajuriste membre d'un ordre dans votre province ou territoire devrait examiner votre situation avant que vous vous y fiiez.",
  questionHint:
    "Une bonne question indique où cela s'est passé, ce qui s'est passé et ce que vous voulez savoir. N'incluez pas de numéros d'identité ni de documents.",
  sentToGoogle:
    "La question et les messages précédents de cette conversation sont envoyés à Google pour rédiger la réponse.",
  placeholder: "Posez une question sur le droit canadien...",
  send: "Demander",
  enterHint: "Entrée pour demander. Maj+Entrée pour une nouvelle ligne.",
  examples: "Exemples",
  empty:
    "Pas encore de question. Un exemple remplit la zone. Il n'est pas envoyé tant que vous n'appuyez pas sur Envoyer.",
  filled: "Cette question est dans la zone. Modifiez-la au besoin, puis appuyez sur Envoyer.",
  areas: "Domaines du droit",
  areasHint:
    "Fédéral, provincial et territorial. Ces raccourcis remplissent la zone avec une question de départ. Ajoutez ce qui s'est passé, et gardez l'endroit choisi.",
  whyTitle: "Pourquoi les gens s'en servent",
  why: [
    { title: "Langage clair", text: "Les réponses utilisent des mots de tous les jours." },
    {
      title: "Selon l'endroit",
      text: "La réponse suit l'endroit que vous choisissez et dit quand une règle fédérale s'applique.",
    },
    {
      title: "Sources lorsqu'elles peuvent être nommées",
      text: "Si une source ne peut pas être vérifiée, la réponse le dit.",
    },
    {
      title: "De l'information, pas un avocat",
      text: "Ceci est de l'information générale. Ce n'est pas un avocat et cela ne vous représente pas.",
    },
  ],
  tryAgain: "Réessayer",
  thinking: "Préparation d'une explication…",
  languageLabel: "Langue",
  allOfCanada: "Tout le Canada",
  primaryNav: "Principal",
  footerNav: "Pied de page",
  home: "Accueil",
  about: "À propos",
  contact: "Contact",
  terms: "Conditions",
  termsGateTitle: "Lisez et acceptez avant de poser une question",
  scrollTerms:
    "Faites défiler les conditions jusqu'à la fin. Le bouton d'accord s'active ensuite.",
  agreeTerms: "J'ai lu et compris les conditions et je les accepte",
  privacy: "Confidentialité",
  noscript: "Canada Legal AI a besoin de JavaScript pour poser une question.",
  footerNote:
    "Canada Legal AI donne de l'information juridique générale. Ce n'est pas un cabinet d'avocats et il ne représente pas les utilisateurs. Les réponses ne créent pas de relation avocat-client.",
  askQuestion: "Poser une question",
};

export function ui(lang: Lang): Ui {
  return lang === "fr" ? fr : en;
}
