import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Flame, Check, Sparkles } from "lucide-react";

const Abonnement = () => {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/donations/packages").then(({ data }) => {
      setPkg(data[0] || null);
    });
  }, []);

  const checkout = async () => {
    if (!pkg) return;
    setLoading(true);
    try {
      const { data } = await api.post("/donations/checkout", {
        package_id: pkg.id,
        origin_url: window.location.origin,
      });
      window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.detail || "Erreur lors de l'abonnement.");
      setLoading(false);
    }
  };

  const benefits = [
    "Accès illimité et à vie à toutes les prières du site, sans restriction",
    "Toutes les futures prières et pratiques ajoutées incluses",
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-20" data-testid="abonnement-page">
      <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Rejoindre l'Espace</p>
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
        Un <em className="text-[var(--gold)]">abonnement</em>, un accès complet
      </h1>
      <p className="mt-6 mb-14 max-w-2xl font-serif-body text-[var(--ivory-muted)] text-lg leading-relaxed">
        Un seul engagement vous ouvre l'ensemble des contenus du site&nbsp;: prières scellées, pratiques, matériel,
        et tout ce qui sera ajouté au fil du temps.
      </p>

      {!user && (
        <div className="sacred-card sharp p-6 mb-10 border-l-4 border-l-[var(--gold)]" data-testid="abonnement-auth-hint">
          <p className="font-serif-body italic text-[var(--ivory-muted)]">
            Astuce&nbsp;: créez un compte avant de vous abonner pour que votre accès soit lié à votre profil.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-px bg-[rgba(212,175,55,0.15)]" data-testid="abonnement-card">
        {/* Offer */}
        <div className="sacred-card sharp p-10 lg:p-14 flex flex-col">
          <Flame className="text-[var(--gold)] flicker mb-6" strokeWidth={1.1} size={40} />
          <p className="font-engraved text-[10px] text-[var(--ivory-muted)] mb-2">Formule unique</p>
          <h2 className="font-serif-display text-4xl text-[var(--ivory)] mb-6 leading-tight">
            {pkg ? pkg.label : "Abonnement à vie"}
          </h2>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-serif-display text-7xl text-[var(--gold)]">
              {pkg ? pkg.amount : 29}
            </span>
            <span className="font-engraved text-[11px] text-[var(--ivory-muted)]">
              {pkg ? pkg.currency.toUpperCase() : "EUR"} · À VIE
            </span>
          </div>
          <p className="font-serif-body italic text-[var(--ivory-muted)] mb-10">
            Un paiement unique, un accès permanent.
          </p>

          <button
            onClick={checkout}
            disabled={loading || !pkg}
            className="btn-sacred btn-sacred-filled sharp w-full"
            data-testid="subscribe-btn"
          >
            {loading ? "Préparation…" : "S'abonner à vie"}
          </button>

          <p className="font-engraved text-[10px] text-[var(--ivory-muted)] text-center mt-6">
            Paiement sécurisé via Stripe · Aucun renouvellement, aucun prélèvement automatique
          </p>
        </div>

        {/* Benefits */}
        <div className="sacred-card sharp p-10 lg:p-14">
          <Sparkles className="text-[var(--gold)] mb-6" strokeWidth={1.1} size={36} />
          <h3 className="font-serif-display text-3xl text-[var(--ivory)] mb-6">Ce que vous recevez</h3>
          <ul className="space-y-5">
            {benefits.map((b, i) => (
              <li key={i} className="flex gap-3 items-start font-serif-body text-[var(--ivory)]" data-testid={`benefit-${i}`}>
                <Check className="text-[var(--gold)] mt-1 shrink-0" strokeWidth={1.4} size={18} />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>

          {user?.is_donor && (
            <div className="mt-10 pt-8 border-t border-[rgba(212,175,55,0.15)]" data-testid="already-subscribed">
              <p className="font-engraved text-[10px] text-[var(--gold)] mb-2">✦ Vous êtes abonné</p>
              <p className="font-serif-body italic text-[var(--ivory-muted)]">
                Merci. Tout l'Espace vous est déjà ouvert. Vous pouvez renouveler ou offrir un abonnement supplémentaire.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto text-center">
        <div className="divider-ornament mb-8"><Flame size={14} strokeWidth={1.2} /></div>
        <p className="font-serif-body italic text-[var(--ivory-muted)] leading-relaxed">
          Si vous traversez une situation difficile et ne pouvez pas vous abonner, écrivez-nous via le formulaire
          de contact&nbsp;: <Link to="/contact" className="text-[var(--gold)] underline-offset-4 hover:underline">nous écrire</Link>.
          Aucune âme n'est laissée à la porte.
        </p>
      </div>
    </div>
  );
};

export default Abonnement;
