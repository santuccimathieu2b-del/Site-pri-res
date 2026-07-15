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

const CGV = () => (
  <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16" data-testid="cgv-page">
    <header className="mb-12 border-b border-[rgba(212,175,55,0.15)] pb-8">
      <p className="font-engraved text-[var(--gold)] text-[11px] tracking-widest mb-3">Conditions Générales de Vente</p>
      <h1 className="font-serif-display text-4xl sm:text-5xl text-[var(--ivory)]">CGV</h1>
    </header>

    <Section title="Article 1 — Objet">
      <p>
        Les présentes conditions générales de vente (CGV) régissent l'abonnement au site
        <em> prieres-soins-delivrance.fr</em>, édité par MCS-Éditions (SASU, SIRET 995 128 642 00015,
        siège&nbsp;: 200 rue de la Croix-Nivert, 75015 Paris).
      </p>
    </Section>

    <Section title="Article 2 — Description du service">
      <p>
        MCS-Éditions propose l'accès à une bibliothèque en ligne de prières, oraisons et rituels de
        traditions diverses. L'abonnement donne accès à l'intégralité du contenu réservé aux donateurs,
        y compris les prières « scellées » et les fonctions avancées (génération de prières personnalisées, etc.).
      </p>
    </Section>

    <Section title="Article 3 — Prix">
      <p>
        L'abonnement est proposé au tarif unique de <strong className="text-[var(--gold)]">29 € TTC</strong>,
        payable en une seule fois. Il s'agit d'un abonnement <strong>à vie</strong> pour le compte de l'utilisateur.
      </p>
      <p>
        La mention « à vie » s'entend comme la durée d'existence de la société MCS-Éditions ou, si elle est
        plus courte, la période effective de mise en ligne du site <em>prieres-soins-delivrance.fr</em>.
        En cas de cessation d'activité de la société ou d'arrêt définitif du site, aucune restitution
        au prorata ne pourra être exigée.
      </p>
      <p>La TVA applicable est celle en vigueur à la date de la commande.</p>
    </Section>

    <Section title="Article 4 — Modalités de paiement">
      <p>
        Le paiement s'effectue en ligne via le prestataire <strong>Stripe</strong>, par carte bancaire
        (CB, Visa, Mastercard, American Express). Les données de paiement sont traitées et sécurisées
        directement par Stripe, MCS-Éditions n'y ayant jamais accès.
      </p>
      <p>
        La commande est validée dès la confirmation du paiement. Une facture est envoyée par courriel à
        l'utilisateur.
      </p>
    </Section>

    <Section title="Article 5 — Livraison du service">
      <p>
        L'accès aux contenus premium est activé instantanément après la validation du paiement. En cas
        de problème d'accès, l'utilisateur peut contacter le support&nbsp;:
      </p>
      <p className="flex items-center gap-3 flex-wrap">
        <EmailImage user="contact" domain="mcs-editions.com" />
      </p>
    </Section>

    <Section title="Article 6 — Droit de rétractation">
      <p>
        Conformément à l'article L.221-28 du Code de la consommation, l'exécution du contrat commence
        immédiatement avec l'accord exprès du consommateur ; par conséquent, le droit de rétractation
        de 14 jours ne s'applique pas dès lors que le contenu numérique a été rendu accessible.
      </p>
      <p>
        L'utilisateur reconnaît, en validant sa commande, avoir été informé de cette limitation et y
        consentir expressément.
      </p>
      <p>
        En dehors de ce cadre, MCS-Éditions peut, à sa discrétion et par geste commercial, procéder à
        un remboursement partiel ou total sur demande motivée adressée par courriel.
      </p>
    </Section>

    <Section title="Article 7 — Compte utilisateur">
      <p>
        L'utilisateur est responsable de la confidentialité de ses identifiants. Tout usage du compte
        est réputé effectué par le titulaire. En cas de suspicion d'accès frauduleux, il appartient à
        l'utilisateur de nous en informer sans délai.
      </p>
      <p>
        MCS-Éditions se réserve le droit de suspendre ou résilier tout compte en cas de manquement aux
        présentes CGV, notamment en cas de partage abusif d'identifiants, de comportement frauduleux
        ou d'atteinte au bon fonctionnement du service.
      </p>
    </Section>

    <Section title="Article 8 — Propriété intellectuelle">
      <p>
        L'abonnement confère un droit d'accès personnel, non exclusif et non transférable aux contenus
        du site. Toute reproduction, diffusion ou revente du contenu est strictement interdite.
      </p>
    </Section>

    <Section title="Article 9 — Responsabilité">
      <p>
        Les prières, rituels et textes présentés sur ce site ne constituent en aucun cas un avis médical,
        un traitement, un diagnostic ou une alternative à un suivi professionnel. Pour toute question
        concernant votre santé physique ou mentale, consultez un médecin, un professionnel de santé
        ou un spécialiste qualifié.
      </p>
      <p>
        MCS-Éditions ne saurait être tenue responsable des conséquences résultant d'un usage
        inapproprié des contenus proposés, notamment en matière de pratiques d'exorcisme réservées à
        des personnes formées et pleinement conscientes de leur démarche.
      </p>
    </Section>

    <Section title="Article 10 — Données personnelles">
      <p>
        Le traitement des données personnelles est décrit dans notre politique de confidentialité,
        accessible depuis le pied de page du site.
      </p>
    </Section>

    <Section title="Article 11 — Droit applicable et litiges">
      <p>
        Les présentes CGV sont soumises au droit français. En cas de différend, une solution amiable
        sera recherchée. À défaut, les tribunaux français compétents seront saisis.
      </p>
      <p>
        Conformément aux dispositions du Code de la consommation, l'utilisateur peut recourir gratuitement
        au service de médiation MEDICYS (<em>medicys.fr</em>) ou à tout autre médiateur compétent.
      </p>
    </Section>

    <p className="text-xs text-[var(--ivory-muted)] mt-12 italic">
      Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
    </p>
  </div>
);

export default CGV;
