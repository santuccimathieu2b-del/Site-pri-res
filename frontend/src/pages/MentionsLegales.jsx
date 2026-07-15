import React from "react";
import EmailImage from "@/components/EmailImage";

const Section = ({ title, children }) => (
  <section className="mb-10" data-testid="legal-section">
    <h2 className="font-serif-display text-2xl text-[var(--gold)] mb-4">{title}</h2>
    <div className="text-[var(--ivory)] font-serif-body text-base leading-relaxed space-y-3">
      {children}
    </div>
  </section>
);

const MentionsLegales = () => (
  <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16" data-testid="mentions-legales-page">
    <header className="mb-12 border-b border-[rgba(212,175,55,0.15)] pb-8">
      <p className="font-engraved text-[var(--gold)] text-[11px] tracking-widest mb-3">Informations réglementaires</p>
      <h1 className="font-serif-display text-4xl sm:text-5xl text-[var(--ivory)]">Mentions légales</h1>
    </header>

    <Section title="Éditeur du site">
      <p><strong className="text-[var(--gold)]">Raison sociale :</strong> MCS-Éditions</p>
      <p><strong className="text-[var(--gold)]">Forme juridique :</strong> Société par actions simplifiée unipersonnelle (SASU)</p>
      <p><strong className="text-[var(--gold)]">Siège social :</strong> 200 rue de la Croix-Nivert, 75015 Paris, France</p>
      <p><strong className="text-[var(--gold)]">SIRET :</strong> 995 128 642 00015</p>
      <p><strong className="text-[var(--gold)]">RCS :</strong> Paris</p>
      <p><strong className="text-[var(--gold)]">TVA intracommunautaire :</strong> FR60 995 128 642</p>
      <p><strong className="text-[var(--gold)]">Directeur de la publication :</strong> Mathieu Santucci</p>
      <p className="flex items-center gap-3 flex-wrap">
        <strong className="text-[var(--gold)]">Contact :</strong>
        <EmailImage user="contact" domain="mcs-editions.com" />
      </p>
    </Section>

    <Section title="Hébergement">
      <p><strong className="text-[var(--gold)]">Hébergeur :</strong> Emergent Labs, Inc.</p>
      <p><strong className="text-[var(--gold)]">Adresse :</strong> San Francisco, Californie, États-Unis</p>
      <p><strong className="text-[var(--gold)]">Contact :</strong> support@emergent.sh</p>
    </Section>

    <Section title="Propriété intellectuelle">
      <p>
        L'ensemble du contenu du site <em>prieres-soins-delivrance.fr</em> — textes de prières,
        oraisons, rituels, iconographies, mise en page, choix éditoriaux, architecture technique —
        est protégé par le droit d'auteur et le droit sui generis des bases de données.
      </p>
      <p>
        Toute reproduction, représentation, modification, publication, transmission ou dénaturation,
        totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit, sans autorisation
        écrite préalable de MCS-Éditions, est strictement interdite et constituerait une contrefaçon
        sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
      </p>
      <p>
        Certaines prières présentées sur le site sont issues de traditions populaires anciennes tombées
        dans le domaine public ; leur mise en forme éditoriale, adaptation et sélection demeurent néanmoins
        protégées.
      </p>
    </Section>

    <Section title="Responsabilité">
      <p>
        MCS-Éditions met tout en œuvre pour offrir aux utilisateurs des informations et outils disponibles
        et vérifiés, mais ne saurait être tenue responsable des erreurs, d'une absence de disponibilité
        des informations ou de la présence de virus sur le site.
      </p>
      <p>
        Les prières, rituels et textes présentés sur ce site ne constituent en aucun cas un avis médical,
        un traitement, un diagnostic ou une alternative à un suivi professionnel. Pour toute question
        concernant votre santé physique ou mentale, consultez un médecin, un professionnel de santé
        ou un spécialiste qualifié.
      </p>
    </Section>

    <Section title="Liens hypertextes">
      <p>
        Le site peut contenir des liens vers d'autres sites internet. MCS-Éditions n'exerce aucun contrôle
        sur ces sites tiers et décline toute responsabilité quant à leur contenu.
      </p>
    </Section>

    <Section title="Droit applicable">
      <p>
        Le présent site est soumis au droit français. En cas de litige, et à défaut de résolution amiable,
        les tribunaux français seront seuls compétents.
      </p>
    </Section>

    <p className="text-xs text-[var(--ivory-muted)] mt-12 italic">
      Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
    </p>
  </div>
);

export default MentionsLegales;
