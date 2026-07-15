import React from "react";
import EmailImage from "@/components/EmailImage";

const Section = ({ title, children }) => (
  <section className="mb-10">
    <h2 className="font-serif-display text-2xl text-[var(--gold)] mb-4">{title}</h2>
    <div className="text-[var(--ivory)] font-serif-body text-base leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const Confidentialite = () => (
  <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16" data-testid="confidentialite-page">
    <header className="mb-12 border-b border-[rgba(212,175,55,0.15)] pb-8">
      <p className="font-engraved text-[var(--gold)] text-[11px] tracking-widest mb-3">Protection de vos données</p>
      <h1 className="font-serif-display text-4xl sm:text-5xl text-[var(--ivory)]">Politique de confidentialité</h1>
    </header>

    <Section title="Responsable du traitement">
      <p>
        Le responsable du traitement des données à caractère personnel collectées sur ce site est&nbsp;:
      </p>
      <p><strong className="text-[var(--gold)]">MCS-Éditions</strong> — SASU au capital variable, 200 rue de la Croix-Nivert, 75015 Paris, SIRET 995 128 642 00015.</p>
      <p className="flex items-center gap-3 flex-wrap">
        Pour toute question relative à vos données&nbsp;:
        <EmailImage user="contact" domain="mcs-editions.com" />
      </p>
    </Section>

    <Section title="Données collectées">
      <p>Nous collectons uniquement les données strictement nécessaires au fonctionnement du service&nbsp;:</p>
      <ul className="list-disc list-inside space-y-1 pl-4">
        <li><strong>Compte membre :</strong> adresse e-mail, mot de passe (chiffré), date d'inscription.</li>
        <li><strong>Formulaire de contact :</strong> nom, adresse e-mail, message.</li>
        <li><strong>Abonnement :</strong> les données de paiement sont traitées exclusivement par Stripe (nous ne stockons jamais vos numéros de carte).</li>
        <li><strong>Journalisation technique :</strong> adresse IP, horodatage, type de navigateur (finalité de sécurité et de statistiques anonymes).</li>
      </ul>
    </Section>

    <Section title="Finalités du traitement">
      <ul className="list-disc list-inside space-y-1 pl-4">
        <li>Fourniture du service (accès à la bibliothèque, espace membre, génération de prières personnalisées).</li>
        <li>Gestion des abonnements et de la facturation.</li>
        <li>Réponse aux demandes formulées via le formulaire de contact.</li>
        <li>Envoi éventuel de communications relatives au service (jamais à des fins commerciales sans consentement).</li>
        <li>Sécurité, prévention de la fraude et respect des obligations légales.</li>
      </ul>
    </Section>

    <Section title="Base légale">
      <ul className="list-disc list-inside space-y-1 pl-4">
        <li><strong>Exécution du contrat</strong> pour la gestion du compte et de l'abonnement.</li>
        <li><strong>Consentement</strong> pour toute communication non essentielle.</li>
        <li><strong>Intérêt légitime</strong> pour la sécurité et la lutte contre les abus.</li>
        <li><strong>Obligation légale</strong> pour la conservation des données de facturation.</li>
      </ul>
    </Section>

    <Section title="Durée de conservation">
      <ul className="list-disc list-inside space-y-1 pl-4">
        <li>Compte membre&nbsp;: pendant toute la durée de l'abonnement, puis 3 ans après la dernière connexion.</li>
        <li>Données de facturation&nbsp;: 10 ans (obligation comptable).</li>
        <li>Formulaire de contact&nbsp;: 3 ans après le dernier échange.</li>
        <li>Journaux techniques&nbsp;: 12 mois maximum.</li>
      </ul>
    </Section>

    <Section title="Destinataires">
      <p>Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales.</p>
      <p>Elles peuvent être transmises uniquement à nos sous-traitants strictement nécessaires au service&nbsp;:</p>
      <ul className="list-disc list-inside space-y-1 pl-4">
        <li><strong>Stripe</strong> (paiement) — <em>stripe.com/privacy</em></li>
        <li><strong>Emergent Labs</strong> (hébergement)</li>
        <li><strong>Resend</strong> (envoi d'e-mails transactionnels), le cas échéant</li>
      </ul>
    </Section>

    <Section title="Vos droits (RGPD)">
      <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez à tout moment des droits suivants&nbsp;:</p>
      <ul className="list-disc list-inside space-y-1 pl-4">
        <li>Droit d'accès à vos données.</li>
        <li>Droit de rectification.</li>
        <li>Droit à l'effacement (« droit à l'oubli »).</li>
        <li>Droit à la limitation du traitement.</li>
        <li>Droit à la portabilité.</li>
        <li>Droit d'opposition.</li>
        <li>Droit d'introduire une réclamation auprès de la CNIL (<em>cnil.fr</em>).</li>
      </ul>
      <p className="flex items-center gap-3 flex-wrap">
        Pour exercer ces droits, écrivez-nous à&nbsp;:
        <EmailImage user="contact" domain="mcs-editions.com" />
      </p>
    </Section>

    <Section title="Cookies">
      <p>
        Ce site utilise uniquement des cookies techniques strictement nécessaires au bon fonctionnement du
        service (session de connexion, panier d'abonnement Stripe). Aucun cookie publicitaire ou de
        traçage tiers n'est déposé sans votre consentement explicite.
      </p>
    </Section>

    <p className="text-xs text-[var(--ivory-muted)] mt-12 italic">
      Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
    </p>
  </div>
);

export default Confidentialite;
