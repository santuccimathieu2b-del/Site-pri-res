import React from "react";
import { Flame, ScrollText } from "lucide-react";

const APropos = () => (
  <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20" data-testid="apropos-page">
    <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Notre mission</p>
    <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight mb-10">
      Un <em className="text-[var(--gold)]">espace</em> sans murs, sans dogme.
    </h1>

    <div className="divider-ornament mb-12"><Flame size={16} strokeWidth={1.2} /></div>

    <article className="font-serif-body text-lg text-[var(--ivory-muted)] leading-loose space-y-6">
      <p className="initial-letter">
        Cet espace est né d'une certitude simple&nbsp;: la prière n'appartient à aucune religion en particulier.
        Elle appartient à celui qui prie. Des premières pratiques préhistoriques aux origines ésotériques de
        Mésopotamie ou d'Égypte, chaque tradition a posé sur le monde une parole de paix, de soin, de protection.
      </p>
      <p>
        Notre vocation est de recueillir, de transmettre, et d'écrire. De recueillir ce que les âges nous ont confié.
        De transmettre ce qui ne doit pas se perdre. D'écrire, lorsque la situation singulière d'une âme appelle une
        prière singulière.
      </p>
      <p>
        Nous ne demandons aucune appartenance, aucune croyance préalable. Seulement le silence de quelques minutes,
        et la confiance en ce qui, en vous, sait déjà prier.
      </p>
      <p className="text-[var(--gold)] italic font-serif-display text-2xl mt-12 text-center">
        « Que tout ce qui souffre trouve sa lumière. »
      </p>
      <div className="divider-ornament mt-10"><ScrollText size={14} strokeWidth={1.2} /></div>
    </article>
  </div>
);

export default APropos;
