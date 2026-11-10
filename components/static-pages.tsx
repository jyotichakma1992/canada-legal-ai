"use client";

import Link from "next/link";

import { InfoPage } from "@/components/info-page";
import { useLanguage } from "@/components/language-provider";
import { CONTACT_EMAIL } from "@/lib/nav";

export function AboutView() {
  const { lang, t } = useLanguage();
  if (lang === "fr") {
    return (
      <InfoPage
        title="À propos"
        lede="Canada Legal AI s'adresse à toute personne au Canada qui a besoin de comprendre un problème juridique avant de décider de la suite."
      >
        <p>{t.audienceLine}</p>
        <p>
          Posez la question en mots de tous les jours. La réponse explique l'idée, dit si la règle est
          fédérale ou provinciale, et indique une source officielle lorsque cette source peut être
          nommée avec assurance. Si elle ne peut pas vérifier une loi, une décision ou un lien, elle
          le dit.
        </p>
        <h2>Pourquoi les gens s'en servent</h2>
        <ul>
          <li>L'explication suit la langue que vous choisissez, le français ou l'anglais.</li>
          <li>
            Elle suit la province ou le territoire que vous choisissez, et elle dit quand une règle
            fédérale s'applique.
          </li>
          <li>Elle nomme une source lorsqu'elle le peut, et elle admet lorsqu'elle ne le peut pas.</li>
          <li>C'est de l'information. Ce n'est pas un avocat, et cela ne vous représente pas.</li>
        </ul>
        <h2>Ce que vous pouvez demander</h2>
        <p>
          Les affaires criminelles, la famille, l'emploi, le logement, l'immigration, les problèmes de
          consommation, les testaments et successions, les petites créances et les dettes, les droits
          de la personne, la circulation, les prestations et l'entreprise. Les sujets fédéraux et
          provinciaux ont leur place ici. Choisissez votre province dans la conversation.
        </p>
        <h2>Ce que ce n'est pas</h2>
        <p>{t.disclaimer}</p>
        <p>
          La conversation n'est pas enregistrée. Actualiser ou fermer l'onglet l'efface. Il n'y a pas
          de compte ni de base de données de questions.
        </p>
        <p>
          <Link href="/">{t.askQuestion}</Link>
        </p>
      </InfoPage>
    );
  }

  return (
    <InfoPage
      title="About"
      lede="Canada Legal AI is for anyone in Canada who needs to understand a legal problem before deciding what to do next."
    >
      <p>{t.audienceLine}</p>
      <p>
        Ask in everyday words. The answer explains the idea, says whether the rule is federal or
        provincial, and points to an official source when that source can be named with confidence.
        If it cannot verify a statute, case, or link, it says so.
      </p>
      <h2>Why people use this</h2>
      <ul>
        <li>The explanation follows the language you choose, English or French.</li>
        <li>It follows the province or territory you select, and it says when a federal rule applies.</li>
        <li>It names a source when it can, and it admits when it cannot.</li>
        <li>It is information. It is not a lawyer, and it does not represent you.</li>
      </ul>
      <h2>What you can ask about</h2>
      <p>
        Criminal matters, family, employment, housing, immigration, consumer problems, wills and
        estates, small claims and debt, human rights, traffic, benefits, and business. Federal and
        provincial subjects both belong here. Pick your province in the chat.
      </p>
      <h2>What this is not</h2>
      <p>{t.disclaimer}</p>
      <p>
        The conversation is not saved. Refreshing or closing the tab clears it. There is no account
        and no database of questions.
      </p>
      <p>
        <Link href="/">{t.askQuestion}</Link>
      </p>
    </InfoPage>
  );
}

export function TermsArticles() {
  const { lang } = useLanguage();
  if (lang === "fr") {
    return (
      <>
        <h2>1. Aucun avis juridique ni relation avocat-client</h2>
        <p>
          L'information fournie par Canada Legal AI (le « Service ») est produite par un système
          automatisé d'intelligence artificielle (Google Gemini Flash) et est destinée strictement à
          des fins générales d'éducation et d'information.
        </p>
        <ul>
          <li>
            <strong>Aucune consultation professionnelle.</strong> Le Service ne fournit pas d'avis
            juridique, d'opinions juridiques ni de consultation juridique stratégique.
          </li>
          <li>
            <strong>Aucun mandat ni relation.</strong> Votre utilisation du Service, l'envoi de
            questions ou la réception de réponses ne crée pas de relation avocat-client,
            parajuriste-client ou fiduciaire entre vous et Canada Legal AI ou ses exploitants.
          </li>
          <li>
            <strong>Pas un substitut.</strong> Le Service ne remplace pas l'avis professionnel d'un
            avocat ou d'un parajuriste membre d'un ordre dans votre province ou territoire
            canadien. Ne négligez jamais un avis juridique professionnel et n'en retardez pas la
            recherche à cause de quelque chose que vous avez lu sur ce site.
          </li>
        </ul>
        <h2>2. Fourniture « tel quel » et limitation de responsabilité</h2>
        <p>
          Le Service vous est fourni « tel quel » et « selon la disponibilité », sans garantie
          d'aucune sorte, expresse ou implicite.
        </p>
        <ul>
          <li>
            <strong>Risque d'erreurs (hallucinations).</strong> Vous reconnaissez que les
            technologies d'intelligence artificielle sont sujettes aux erreurs, aux bogues
            logiciels et aux inexactitudes factuelles (souvent appelées « hallucinations »). Le
            Service ne garantit pas l'exactitude, l'exhaustivité, l'actualité ou l'applicabilité de
            toute information juridique ou de tout renvoi législatif produit.
          </li>
          <li>
            <strong>Plafond de responsabilité.</strong> Dans toute la mesure permise par les lois
            fédérales et provinciales canadiennes applicables, Canada Legal AI, ses fondateurs, ses
            exploitants, ses sociétés affiliées et ses concédants de licence ne seront en aucun cas
            responsables de dommages directs, indirects, accessoires, spéciaux, consécutifs ou
            punitifs. Cela comprend, sans s'y limiter, la perte de profits, la perte de données,
            les sanctions juridiques ou les issues défavorables devant un tribunal qui découlent de
            votre confiance dans le Service ou qui y sont liées, même si la possibilité de tels
            dommages a été signalée.
          </li>
        </ul>
        <h2>3. Territoire et indemnisation</h2>
        <p>
          Vous acceptez d'indemniser, de défendre et de dégager de toute responsabilité Canada
          Legal AI et ses exploitants à l'égard de toute réclamation, responsabilité ou perte
          découlant de votre mauvaise utilisation de la plateforme ou de votre confiance dans ses
          résultats. Ces conditions sont régies par les lois de la province de votre exploitation
          et les lois fédérales du Canada qui s'y appliquent, et elles sont interprétées
          conformément à ces lois.
        </p>
        <h2>Vos questions</h2>
        <p>
          N'envoyez pas de numéro d'assurance sociale, de numéro de passeport, de date de naissance
          complète, d'adresse domiciliaire, de numéro de compte, de numéro de carte d'assurance
          maladie, ni de copies de pièces d'identité. La conversation n'est pas enregistrée. Rien
          n'est enregistré dans un compte.
        </p>
      </>
    );
  }

  return (
    <>
      <h2>1. No legal advice or lawyer-client relationship</h2>
      <p>
        The information provided by Canada Legal AI (the &quot;Service&quot;) is generated by an
        automated artificial intelligence system (Google Gemini Flash) and is intended strictly for
        general educational and informational purposes.
      </p>
      <ul>
        <li>
          <strong>No professional consultation.</strong> The Service does not provide legal advice,
          legal opinions, or strategic legal consultation.
        </li>
        <li>
          <strong>No retainer or relationship.</strong> Your use of the Service, submission of
          questions, or receipt of responses does not create a lawyer-client, paralegal-client, or
          fiduciary relationship between you and Canada Legal AI or its operators.
        </li>
        <li>
          <strong>Not a substitute.</strong> The Service is not a substitute for the professional
          advice of a licensed lawyer or paralegal in your respective Canadian province or
          territory. Never disregard professional legal advice or delay seeking it because of
          something you read on this website.
        </li>
      </ul>
      <h2>2. &quot;As-is&quot; provision and limitation of liability</h2>
      <p>
        The Service is provided to you on an &quot;as-is&quot; and &quot;as-available&quot; basis
        without warranties of any kind, either express or implied.
      </p>
      <ul>
        <li>
          <strong>Risk of errors (hallucinations).</strong> You acknowledge that artificial
          intelligence technologies are subject to errors, software bugs, and factual inaccuracies
          (commonly referred to as &quot;hallucinations&quot;). The Service does not guarantee the
          accuracy, completeness, currency, or applicability of any legal information or statutory
          references generated.
        </li>
        <li>
          <strong>Total liability cap.</strong> To the maximum extent permitted by applicable
          Canadian federal and provincial laws, in no event shall Canada Legal AI, its founders,
          operators, affiliates, or licensors be liable for any direct, indirect, incidental,
          special, consequential, or punitive damages. This includes, but is not limited to, loss
          of profits, loss of data, legal penalties, or adverse court outcomes arising out of or
          connected to your reliance on the Service, even if advised of the possibility of such
          damages.
        </li>
      </ul>
      <h2>3. Jurisdiction and indemnification</h2>
      <p>
        You agree to indemnify, defend, and hold harmless Canada Legal AI and its operators from
        any claims, liabilities, or losses arising out of your misuse of the platform or your
        reliance on its outputs. These Terms shall be governed by and construed in accordance with
        the laws of the Province of your operation and the federal laws of Canada applicable
        therein.
      </p>
      <h2>Your questions</h2>
      <p>
        Do not send a social insurance number, passport number, full date of birth, home address,
        account number, health card number, or copies of identity documents. The conversation is
        not saved. Nothing is saved in an account.
      </p>
    </>
  );
}

export function TermsView() {
  const { lang } = useLanguage();
  if (lang === "fr") {
    return (
      <InfoPage
        title="Conditions"
        lede="En utilisant Canada Legal AI, y compris en posant une question, vous acceptez ces conditions."
      >
        <TermsArticles />
      </InfoPage>
    );
  }

  return (
    <InfoPage
      title="Terms"
      lede="By using Canada Legal AI, including by asking a question, you agree to these terms."
    >
      <TermsArticles />
    </InfoPage>
  );
}

export function PrivacyView() {
  const { lang, t } = useLanguage();
  if (lang === "fr") {
    return (
      <InfoPage
        title="Confidentialité"
        lede="Le site est conçu pour qu'une question ne devienne pas un dossier enregistré à votre sujet."
      >
        <h2>Ce qui reste sur votre appareil</h2>
        <p>
          Les mots d'une conversation restent sur la page pendant que vous la regardez, et une
          actualisation les efface. Le site ne conserve pas de copie de vos questions. Il n'utilise
          pas de compte ni de base de données.
        </p>
        <h2>Ce qui est envoyé pour répondre à une question</h2>
        <p>{t.sentToGoogle}</p>
        <p>
          Lorsque vous posez une question, la question, les messages précédents de cette séance et
          la province ou le territoire choisi sont envoyés au serveur de ce site, puis à l'API Gemini
          de Google pour rédiger la réponse. N'incluez pas de numéro d'assurance sociale, de numéro
          de passeport, de date de naissance complète, d'adresse domiciliaire, de numéro de compte
          financier, de numéro de carte d'assurance maladie ni de pièces d'identité dans la question.
        </p>
        <h2>Contact</h2>
        <p>
          Il n'y a pas de formulaire de contact qui enregistre les messages. La page Contact ouvre
          votre propre application de courriel à {CONTACT_EMAIL}. Ce site ne conserve pas de copie
          de ce courriel.
        </p>
      </InfoPage>
    );
  }

  return (
    <InfoPage
      title="Privacy"
      lede="The site is built so a question does not become a stored file about you."
    >
      <h2>What stays on your device</h2>
      <p>
        The words of a conversation stay on the page while you are looking at it, and a refresh
        clears them. The site does not keep a copy of your questions. It does not use an account or
        a database.
      </p>
      <h2>What is sent to answer a question</h2>
      <p>{t.sentToGoogle}</p>
      <p>
        When you ask something, the question, the earlier messages in that session, and the
        province or territory you selected are sent to this site’s server and then to Google’s
        Gemini API to write the answer. Do not include a social insurance number, passport number,
        full date of birth, home address, financial account number, health card number, or identity
        documents in the question.
      </p>
      <h2>Contact</h2>
      <p>
        There is no contact form that stores messages. The contact page opens your own email app
        at {CONTACT_EMAIL}. This website does not keep a copy of that email.
      </p>
    </InfoPage>
  );
}

export function ContactView() {
  const { lang } = useLanguage();
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Canada Legal AI")}`;

  if (lang === "fr") {
    return (
      <InfoPage
        title="Contact"
        lede="Écrivez-nous dans votre propre application de courriel. Ce site n'enregistre pas les messages."
      >
        <p>
          <a href={href}>{CONTACT_EMAIL}</a>
        </p>
        <p>
          Le lien ouvre votre programme de courriel. Il n'y a pas de formulaire sur ce site, pas de
          base de données, et aucune copie du message n'est conservée ici. N'envoyez pas de numéros
          d'identité ni de documents.
        </p>
        <p>
          Canada Legal AI n'est pas un cabinet d'avocats. Un courriel ne crée pas de relation
          avocat-client et n'est pas une demande de représentation.
        </p>
      </InfoPage>
    );
  }

  return (
    <InfoPage title="Contact" lede="Write to us in your own email app. This website does not store messages.">
      <p>
        <a href={href}>{CONTACT_EMAIL}</a>
      </p>
      <p>
        The link opens your email program. There is no form on this site, no database, and no copy
        of the message kept here. Please do not send identity numbers or documents.
      </p>
      <p>
        Canada Legal AI is not a law firm. An email does not create a lawyer-client relationship
        and is not a request for representation.
      </p>
    </InfoPage>
  );
}
