import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { ScrollText } from "lucide-react";

const Temoignages = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/testimonies").then(({ data }) => setItems(data)); }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20" data-testid="temoignages-page">
      <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Voix des âmes</p>
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight mb-6">
        <em className="text-[var(--gold)]">Témoignages</em> des chemins traversés
      </h1>
      <p className="font-serif-body text-lg text-[var(--ivory-muted)] max-w-2xl mb-16">
        Ces voix se sont confiées à nous. Avec leur accord, elles sont déposées ici pour vous, qui peut-être
        commencez le même chemin.
      </p>

      <div className="grid md:grid-cols-2 gap-px bg-[rgba(212,175,55,0.12)]">
        {items.map((t, i) => (
          <div key={t.id} className="sacred-card sharp p-10" data-testid={`temoignage-${t.id}`}>
            <ScrollText className="text-[var(--gold)] mb-4" strokeWidth={1.1} size={22} />
            <p className="font-serif-display text-xl md:text-2xl italic text-[var(--ivory)] leading-snug mb-6">
              « {t.text} »
            </p>
            <div className="flex justify-between items-end">
              <p className="font-engraved text-[10px] text-[var(--gold)]">{t.name} — {t.city}</p>
              <p className="font-engraved text-[10px] text-[var(--ivory-muted)]">{t.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Temoignages;
