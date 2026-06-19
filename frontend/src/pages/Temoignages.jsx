import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { ScrollText } from "lucide-react";

const Temoignages = () => {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get("/testimonies").then(({ data }) => setItems(data)); }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20" data-testid="temoignages-page">
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight mb-6">
        <em className="text-[var(--gold)]">Témoignages</em>
      </h1>
      <p className="font-serif-body text-lg text-[var(--ivory-muted)] max-w-2xl mb-16">
        N'hésitez pas à témoigner ou à nous faire partager vos expériences.
      </p>

      {items.length === 0 ? (
        <div className="sacred-card sharp p-16 text-center" data-testid="temoignages-empty">
          <ScrollText className="text-[var(--gold)] mx-auto mb-6" strokeWidth={1.1} size={32} />
          <p className="font-serif-display text-2xl text-[var(--ivory)] italic">
            Les premiers témoignages seront bientôt recueillis.
          </p>
          <p className="font-serif-body text-[var(--ivory-muted)] mt-4">
            Cet espace reste ouvert au silence avant que les voix s'y déposent.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-px bg-[rgba(212,175,55,0.12)]">
          {items.map((t) => (
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
      )}
    </div>
  );
};

export default Temoignages;
