import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Shield, Flame, ScrollText } from "lucide-react";
import { useSEO, ORG_JSONLD } from "@/hooks/useSEO";

const HERO_IMG = "https://images.unsplash.com/photo-1601922046210-41e129a3e64a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxjYW5kbGVsaWdodCUyMGRhcmslMjBtYWNyb3xlbnwwfHx8fDE3ODE3ODYxMjJ8MA&ixlib=rb-4.1.0&q=85";

const pillars = [
  { slug: "soins", title: "Soins", Icon: HeartPulse },
  { slug: "protection", title: "Protection", Icon: Shield },
  { slug: "exorcisme", title: "Exorcisme", Icon: Flame },
];

const Home = () => {
  useSEO({
    title: "Prières traditionnelles de soins, protection et délivrance",
    description: "Bibliothèque non-confessionnelle de plus de 100 prières traditionnelles : soins, protection spirituelle, exorcisme, délivrance et aide. Accès à vie pour 29 €.",
    path: "/",
    keywords: "prière de délivrance, prière d'exorcisme, prière de protection, prière de guérison, bibliothèque de prières, MCS-Éditions",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Prières · Soins · Délivrance",
      url: "https://prieres-soins-delivrance.fr",
      inLanguage: "fr-FR",
      publisher: ORG_JSONLD,
      potentialAction: {
        "@type": "SearchAction",
        target: "https://prieres-soins-delivrance.fr/bibliotheque?q={query}",
        "query-input": "required name=query",
      },
    },
  });

  return (
    <div data-testid="home-page">
      {/* HERO with disclaimer text */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-[#08090C]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 py-28 md:py-40">
          <div className="reveal">
            <p className="font-engraved text-[var(--gold)] text-[11px] mb-8 text-center">
              ✦  Soins · Protections · Délivrances  ✦
            </p>
            <div className="divider-ornament mb-12"><Flame size={16} strokeWidth={1.2} className="flicker" /></div>

            <p className="font-serif-display text-3xl md:text-5xl text-[var(--ivory)] leading-snug text-center italic">
              Cet espace n'appartient à aucune <em className="text-[var(--gold)] not-italic">religion</em>.
            </p>

            <p className="font-serif-body text-xl md:text-2xl text-[var(--ivory-muted)] leading-relaxed text-center mt-10 reveal-2">
              Notre démarche est spirituelle et centrée sur des prières pour se soulager
              et des rituels pour se protéger ou se libérer.
            </p>

            <div className="divider-ornament my-14"><ScrollText size={14} strokeWidth={1.2} /></div>

            <p className="font-serif-body text-base md:text-lg text-[var(--ivory-muted)] leading-relaxed text-center max-w-2xl mx-auto reveal-3 italic">
              Les prières, rituels et textes présentés sur ce site ne constituent en aucun cas
              un avis médical, un traitement, un diagnostic ou une alternative à un suivi professionnel.
              Pour toute question concernant votre santé physique ou mentale, consultez un médecin,
              un professionnel de santé ou un spécialiste qualifié.
            </p>

            <div className="mt-16 flex flex-wrap gap-5 justify-center reveal-4">
              <Link to="/bibliotheque" className="btn-sacred sharp" data-testid="cta-bibliotheque">
                Entrer dans la bibliothèque
              </Link>
              <Link to="/contact" className="btn-sacred btn-sacred-filled sharp" data-testid="cta-demande">
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Three pillars - silent navigation */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20 border-t border-[rgba(212,175,55,0.1)]">
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(212,175,55,0.12)]">
          {pillars.map(({ slug, title, Icon }) => (
            <Link
              to={`/bibliotheque?cat=${slug}`}
              key={slug}
              className="sacred-card sharp p-10 flex flex-col items-center text-center gap-4 group"
              data-testid={`pillar-${slug}`}
            >
              <Icon className="text-[var(--gold)]" strokeWidth={1.1} size={36} />
              <h3 className="font-serif-display text-3xl text-[var(--ivory)]">{title}</h3>
              <span className="font-engraved text-[10px] text-[var(--gold)] group-hover:translate-x-1 transition">
                Lire les prières →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
