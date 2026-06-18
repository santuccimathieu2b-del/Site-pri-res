import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Flame, Sparkles } from "lucide-react";

const Dons = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/donations/packages").then(({ data }) => setPackages(data));
  }, []);

  const checkout = async (pkg_id) => {
    setLoading(pkg_id);
    try {
      const { data } = await api.post("/donations/checkout", {
        package_id: pkg_id,
        origin_url: window.location.origin,
      });
      window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur lors de la création de l'offrande.");
      setLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20" data-testid="dons-page">
      <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Offrande sacrée</p>
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
        Déposez votre <em className="text-[var(--gold)]">cierge</em>
      </h1>
      <p className="mt-6 mb-14 max-w-2xl font-serif-body text-[var(--ivory-muted)] text-lg leading-relaxed">
        Toute offrande, quelle que soit sa taille, devient lumière. À partir de 21€, vous recevez l'accès aux prières
        sacrées et à la composition d'oraisons personnelles.
      </p>

      {!user && (
        <div className="sacred-card sharp p-6 mb-10 border-l-4 border-l-[var(--gold)]" data-testid="dons-auth-hint">
          <p className="font-serif-body italic text-[var(--ivory-muted)]">
            Astuce&nbsp;: créez un compte avant de faire votre offrande pour que votre statut de gardien soit lié à votre profil.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(212,175,55,0.12)]">
        {packages.map((p, i) => (
          <div key={p.id} className="sacred-card sharp p-8 flex flex-col" data-testid={`package-${p.id}`}>
            <p className="font-engraved text-[10px] text-[var(--ivory-muted)] mb-2">{`Offrande 0${i + 1}`}</p>
            <h3 className="font-serif-display text-3xl text-[var(--ivory)] mb-3 leading-tight">{p.label}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif-display text-5xl text-[var(--gold)]">{p.amount}</span>
              <span className="font-engraved text-[10px] text-[var(--ivory-muted)]">{p.currency.toUpperCase()}</span>
            </div>
            {p.amount >= 21 ? (
              <p className="font-serif-body text-sm text-[var(--ivory-muted)] mb-6 italic">
                ✦ Inclut l'accès gardien : prières sacrées + oraisons personnelles
              </p>
            ) : (
              <p className="font-serif-body text-sm text-[var(--ivory-muted)] mb-6 italic">
                Soutien simple au espace
              </p>
            )}
            <button
              onClick={() => checkout(p.id)}
              disabled={loading === p.id}
              className="btn-sacred sharp mt-auto"
              data-testid={`donate-btn-${p.id}`}
            >
              {loading === p.id ? "Préparation…" : "Faire l'offrande"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-12 items-start">
        <div className="sacred-card sharp p-10">
          <Flame className="text-[var(--gold)] mb-4" strokeWidth={1.1} size={32} />
          <h3 className="font-serif-display text-3xl text-[var(--ivory)] mb-4">Ce que votre offrande permet</h3>
          <ul className="font-serif-body text-[var(--ivory-muted)] space-y-3 leading-relaxed">
            <li>— La transmission silencieuse de prières millénaires</li>
            <li>— Le maintien du espace numérique ouvert à tous</li>
            <li>— L'accompagnement personnalisé des demandes</li>
            <li>— L'écriture d'oraisons inédites par notre guide intérieur</li>
          </ul>
        </div>
        <div className="sacred-card sharp p-10">
          <Sparkles className="text-[var(--gold)] mb-4" strokeWidth={1.1} size={32} />
          <h3 className="font-serif-display text-3xl text-[var(--ivory)] mb-4">Ce que vous recevez (dès 21€)</h3>
          <ul className="font-serif-body text-[var(--ivory-muted)] space-y-3 leading-relaxed">
            <li>— Accès aux prières scellées de la bibliothèque</li>
            <li>— Composition de prières personnelles illimitée</li>
            <li>— Statut de gardien à vie du espace</li>
            <li>— Notre gratitude la plus profonde</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dons;
