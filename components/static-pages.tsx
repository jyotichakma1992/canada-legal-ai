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
          <li>L'explication est en langage clair.</li>
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
        <li>The explanation is in plain English.</li>
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

export function TermsView() {
  const { lang, t } = useLanguage();
  if (lang === "fr") {
    return (
      <InfoPage
        title="Conditions"
        lede="Ces conditions décrivent cet outil d'information. Elles ne créent pas de relation avocat-client."
      >
        <h2>Information générale</h2>
        <p>{t.disclaimer}</p>
        <p>
          Les réponses peuvent être incomplètes, périmées ou erronées. Elles ne garantissent pas un
          résultat devant un tribunal, un résultat devant un organisme décisionnel, ni une décision
          d'un bureau gouvernemental. Vérifiez les questions importantes auprès d'une personne
          qualifiée et auprès du texte officiel de la loi.
        </p>
        <h2>Aucune représentation</h2>
        <p>
          Canada Legal AI n'est pas un cabinet d'avocats. Il ne vous représente pas. Utiliser la
          conversation ne fait de personne votre avocat. L'avertissement sur le site ne supprime
          aucune responsabilité juridique que vous ou l'exploitant pourriez avoir.
        </p>
        <h2>Vos questions</h2>
        <p>
          N'envoyez pas de numéro d'assurance sociale, de numéro de passeport, de date de naissance
          complète, d'adresse domiciliaire, de numéro de compte, de numéro de carte d'assurance
          maladie, ni de copies de pièces d'identité. La conversation n'est pas enregistrée. Rien
          n'est enregistré dans un compte.
        </p>
      </InfoPage>
    );
  }

  return (
    <InfoPage
      title="Terms"
      lede="These terms describe this information tool. They do not create a lawyer-client relationship."
    >
      <h2>General information</h2>
      <p>{t.disclaimer}</p>
      <p>
        Answers can be incomplete, outdated, or wrong. They do not guarantee a court result, a
        tribunal result, or a decision by a government office. Verify important matters with an
        appropriately qualified professional and with the official text of the law.
      </p>
      <h2>No representation</h2>
      <p>
        Canada Legal AI is not a law firm. It does not represent you. Using the chat does not make
        anyone your lawyer. The disclaimer on the site does not remove any legal responsibility you
        or the operator may have.
      </p>
      <h2>Your questions</h2>
      <p>
        Do not send a social insurance number, passport number, full date of birth, home address,
        account number, health card number, or copies of identity documents. The conversation is
        not saved. Nothing is saved in an account.
      </p>
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
