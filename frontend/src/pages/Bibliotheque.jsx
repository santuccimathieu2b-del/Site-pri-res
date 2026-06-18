import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { HeartPulse, Shield, Flame, Lock, ScrollText } from "lucide-react";

const ICONS = { soins: HeartPulse, protection: Shield, exorcisme: Flame };

const Bibliotheque = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  const activeCat = searchParams.get("cat") || "all";

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = activeCat !== "all" ? { category: activeCat } : {};
    api.get("/prayers", { params }).then(({ data }) => {
      setPrayers(data);
      setLoading(false);
    });
  }, [activeCat, user]);

  const tabs = useMemo(() => [{ slug: "all", name: "Toutes les prières" }, ...categories], [categories]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20" data-testid="library-page">
      <div className="mb-14">
        <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Recueil sacré</p>
        <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
          La <em className="text-[var(--gold)]">Bibliothèque</em> des prières
        </h1>
        <p className="mt-6 max-w-2xl font-serif-body text-[var(--ivory-muted)] text-lg">
          Chaque prière a été déposée ici comme un cierge. Lisez-les à voix basse, ou laissez-les vous lire.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-[rgba(212,175,55,0.15)] pb-1">
        {tabs.map((t) => (
          <button
            key={t.slug}
            onClick={() => setSearchParams(t.slug === "all" ? {} : { cat: t.slug })}
            className={`nav-link py-3 px-2 ${activeCat === t.slug ? "active" : ""}`}
            data-testid={`cat-tab-${t.slug}`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-[var(--ivory-muted)] italic font-serif-body">Recueillement…</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(212,175,55,0.12)]">
          {prayers.map((p) => {
            const Icon = ICONS[p.category_slug] || ScrollText;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="sacred-card sharp p-8 text-left flex flex-col gap-4 group relative"
                data-testid={`prayer-card-${p.id}`}
              >
                <div className="flex justify-between items-start">
                  <Icon className="text-[var(--gold)]" strokeWidth={1.1} size={28} />
                  {p.is_premium && (
                    <span className="font-engraved text-[10px] text-[var(--gold)] flex items-center gap-1">
                      <Lock size={11} strokeWidth={1.4} /> Sacré
                    </span>
                  )}
                </div>
                <h3 className="font-serif-display text-2xl text-[var(--ivory)] leading-tight">{p.title}</h3>
                <p className="font-serif-body italic text-[var(--ivory-muted)] text-sm leading-relaxed">{p.excerpt}</p>
                <span className="font-engraved text-[10px] text-[var(--gold)] mt-auto">Lire →</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
          data-testid="prayer-modal"
        >
          <div
            className="sacred-card sharp max-w-2xl w-full p-10 md:p-14 max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-6 nav-link"
              data-testid="prayer-modal-close"
            >
              Fermer ✕
            </button>
            <p className="font-engraved text-[var(--gold)] text-[10px] mb-4">
              {categories.find((c) => c.slug === selected.category_slug)?.name || ""}
            </p>
            <h2 className="font-serif-display text-4xl text-[var(--ivory)] mb-8 leading-tight">{selected.title}</h2>
            <div className="divider-ornament mb-8"><ScrollText size={14} strokeWidth={1.2} /></div>

            {selected.locked ? (
              <div className="locked-overlay sharp p-10 text-center">
                <Lock className="mx-auto text-[var(--gold)] mb-4" strokeWidth={1.2} size={32} />
                <h3 className="font-serif-display text-3xl text-[var(--ivory)] mb-3">Prière scellée</h3>
                <p className="font-serif-body text-[var(--ivory-muted)] mb-8 max-w-md mx-auto">
                  Cette prière est confiée aux gardiens du sanctuaire. Devenez membre donateur pour en recevoir l'accès.
                </p>
                <Link to="/dons" className="btn-sacred sharp" data-testid="locked-cta">
                  Faire une offrande
                </Link>
              </div>
            ) : (
              <p className="font-serif-body text-[var(--ivory)] text-lg leading-loose whitespace-pre-line">
                {selected.body}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Bibliotheque;
