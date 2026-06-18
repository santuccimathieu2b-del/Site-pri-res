import React from "react";
import { Link } from "react-router-dom";
import { HeartPulse, Shield, Flame, ScrollText, Sparkles, BookOpen } from "lucide-react";

const HERO_IMG = "https://images.unsplash.com/photo-1601922046210-41e129a3e64a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHwzfHxjYW5kbGVsaWdodCUyMGRhcmslMjBtYWNyb3xlbnwwfHx8fDE3ODE3ODYxMjJ8MA&ixlib=rb-4.1.0&q=85";
const ARCH_IMG = "https://images.pexels.com/photos/220745/pexels-photo-220745.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const pillars = [
  { slug: "soins", title: "Soins", subtitle: "Guérir le visible et l'invisible", Icon: HeartPulse,
    text: "Apaiser la douleur, restaurer le souffle, recoudre ce que la vie a déchiré." },
  { slug: "protection", title: "Protection", subtitle: "Élever un rempart de lumière", Icon: Shield,
    text: "Sceller le foyer, écarter les ombres, marcher dans une paix gardée." },
  { slug: "exorcisme", title: "Exorcisme", subtitle: "Délier ce qui retient l'âme", Icon: Flame,
    text: "Libérer les lieux, les objets, les présences. Rendre l'âme à elle-même." },
];

const Home = () => {
  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/65 to-[#08090C]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-32 md:py-44 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 reveal">
            <p className="font-engraved text-[var(--gold)] text-[11px] mb-6">
              ✦  Refuge non-confessionnel · Depuis les âges anciens  ✦
            </p>
            <h1 className="font-serif-display text-5xl md:text-7xl lg:text-[88px] leading-[0.95] text-[var(--ivory)]">
              <span className="italic font-light text-[var(--gold)]">Là</span> où la prière<br />
              <span className="italic">devient</span> <em className="not-italic font-serif-display text-[var(--gold)]">lumière</em>.
            </h1>
            <p className="mt-10 max-w-xl text-lg text-[var(--ivory-muted)] font-serif-body leading-relaxed reveal-2">
              Sanctuaire Sacré recueille les prières millénaires de soins, de protection et d'exorcisme. Un seul chemin&nbsp;:
              que l'âme retrouve sa paix.
            </p>
            <div className="mt-12 flex flex-wrap gap-5 reveal-3">
              <Link to="/bibliotheque" className="btn-sacred sharp" data-testid="cta-bibliotheque">
                Entrer dans la bibliothèque
              </Link>
              <Link to="/demande" className="btn-sacred btn-sacred-filled sharp" data-testid="cta-demande">
                Confier une intention
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 reveal-4 hidden lg:block">
            <div className="sacred-card sharp p-10 ml-auto max-w-md">
              <p className="font-engraved text-[var(--gold)] text-[10px] mb-4">Verset du jour</p>
              <p className="font-serif-display text-2xl italic text-[var(--ivory)] leading-snug">
                « Que ta paix soit plus forte que mes peurs, ta lumière plus vaste que mes ombres. »
              </p>
              <div className="divider-ornament mt-8"><Sparkles size={14} strokeWidth={1.2} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-28">
        <div className="text-center mb-20">
          <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Les trois piliers</p>
          <h2 className="font-serif-display text-4xl md:text-5xl text-[var(--ivory)] max-w-2xl mx-auto leading-tight">
            Trois chemins, une seule <em className="text-[var(--gold)]">source</em>.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-[rgba(212,175,55,0.12)]">
          {pillars.map(({ slug, title, subtitle, Icon, text }, i) => (
            <Link
              to={`/bibliotheque?cat=${slug}`}
              key={slug}
              className="sacred-card sharp p-10 md:p-14 flex flex-col gap-6 group"
              data-testid={`pillar-${slug}`}
            >
              <Icon className="text-[var(--gold)]" strokeWidth={1.1} size={42} />
              <div>
                <p className="font-engraved text-[var(--ivory-muted)] text-[10px] mb-2">{`0${i + 1}`}</p>
                <h3 className="font-serif-display text-4xl text-[var(--ivory)] mb-2">{title}</h3>
                <p className="font-serif-body italic text-[var(--gold)] text-base">{subtitle}</p>
              </div>
              <p className="font-serif-body text-[var(--ivory-muted)] leading-relaxed">{text}</p>
              <span className="font-engraved text-[10px] text-[var(--gold)] mt-auto pt-6 group-hover:translate-x-1 transition">
                Lire les prières →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="relative py-32">
        <img src={ARCH_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/85 to-[#08090C]/70" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <div className="divider-ornament mb-10"><ScrollText size={16} strokeWidth={1.2} /></div>
          <h2 className="font-serif-display text-3xl md:text-5xl text-[var(--ivory)] italic mb-8">
            Une bibliothèque vivante, transmise d'âme en âme
          </h2>
          <p className="font-serif-body text-lg md:text-xl text-[var(--ivory-muted)] leading-relaxed initial-letter">
            Sanctuaire Sacré rassemble les paroles sacrées des traditions du monde, sans appartenance ni dogme. Chaque
            prière y a été déposée comme on dépose un cierge&nbsp;: avec respect, avec lumière, avec l'espoir que d'autres
            âmes y trouveront le repos. Certaines de ces prières, plus rares ou plus puissantes, sont confiées à nos
            membres-donateurs, gardiens silencieux du sanctuaire.
          </p>
        </div>
      </section>

      {/* CTA - DONOR */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-2 gap-px bg-[rgba(212,175,55,0.12)]">
          <div className="sacred-card sharp p-12 lg:p-16">
            <BookOpen className="text-[var(--gold)] mb-6" strokeWidth={1.1} size={36} />
            <h3 className="font-serif-display text-4xl text-[var(--ivory)] mb-4">
              Devenez gardien du sanctuaire
            </h3>
            <p className="font-serif-body text-[var(--ivory-muted)] mb-8 leading-relaxed">
              Par une offrande, accédez aux prières secrètes du sanctuaire, à la composition de prières personnalisées
              par notre guide intérieur, et soutenez la transmission silencieuse.
            </p>
            <Link to="/dons" className="btn-sacred sharp" data-testid="cta-donor">
              Faire une offrande
            </Link>
          </div>
          <div className="sacred-card sharp p-12 lg:p-16">
            <Sparkles className="text-[var(--gold)] mb-6" strokeWidth={1.1} size={36} />
            <h3 className="font-serif-display text-4xl text-[var(--ivory)] mb-4">
              Composition sacrée par voie intérieure
            </h3>
            <p className="font-serif-body text-[var(--ivory-muted)] mb-8 leading-relaxed">
              Pour chaque intention, une prière unique est tissée. Réservée aux membres donateurs, cette voie permet
              à votre situation singulière de recevoir une parole singulière.
            </p>
            <Link to="/espace-membre" className="btn-sacred sharp" data-testid="cta-ai-prayer">
              Découvrir l'oraison personnelle
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
