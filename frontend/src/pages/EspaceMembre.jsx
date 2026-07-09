import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, ScrollText, Lock, Flame } from "lucide-react";
import { toast } from "sonner";

const EspaceMembre = () => {
  const { user, loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [aiPrayers, setAiPrayers] = useState([]);
  const [aiForm, setAiForm] = useState({ category: "soins", tone: "doux", intention: "" });
  const [generating, setGenerating] = useState(false);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    if (!user) return;
    api.get("/prayer-requests/mine").then(({ data }) => setRequests(data));
    if (user.is_donor) {
      api.get("/ai/my-prayers").then(({ data }) => setAiPrayers(data));
    }
  }, [user]);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-20 text-[var(--ivory-muted)] italic">Recueillement…</div>;
  if (!user) return <Navigate to="/connexion" state={{ from: "/espace-membre" }} />;

  const generate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setLatest(null);
    try {
      const { data } = await api.post("/ai/generate-prayer", aiForm);
      setLatest(data);
      const { data: list } = await api.get("/ai/my-prayers");
      setAiPrayers(list);
      toast.success("Prière composée.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Composition impossible.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20" data-testid="member-page">
      <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
        <div>
          <p className="font-engraved text-[var(--gold)] text-[11px] mb-3">Espace du gardien</p>
          <h1 className="font-serif-display text-5xl text-[var(--ivory)]">
            Bonjour, <em className="text-[var(--gold)]">{user.name}</em>
          </h1>
          <p className="font-serif-body text-[var(--ivory-muted)] mt-3">
            {user.is_donor ? (
              <span className="flex items-center gap-2"><Flame size={14} className="text-[var(--gold)]" /> Gardien du espace — accès aux prières sacrées et aux oraisons personnelles.</span>
            ) : (
              <span>Membre du espace — accédez aux prières scellées en devenant gardien.</span>
            )}
          </p>
        </div>
        {!user.is_donor && (
          <Link to="/abonnement" className="btn-sacred btn-sacred-filled sharp" data-testid="become-donor-cta">
            S'abonner
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-px bg-[rgba(212,175,55,0.12)] mb-12">
        {/* AI Prayer Generator */}
        <div className="sacred-card sharp p-10">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-[var(--gold)]" strokeWidth={1.1} size={28} />
            <h2 className="font-serif-display text-3xl text-[var(--ivory)]">Oraison personnelle</h2>
          </div>

          {!user.is_donor ? (
            <div className="locked-overlay sharp p-8 text-center" data-testid="ai-locked">
              <Lock className="mx-auto text-[var(--gold)] mb-4" strokeWidth={1.2} size={28} />
              <p className="font-serif-body text-[var(--ivory-muted)] mb-6">
                La composition d'oraisons personnelles est réservée aux gardiens du espace.
              </p>
              <Link to="/abonnement" className="btn-sacred sharp" data-testid="ai-locked-cta">S'abonner</Link>
            </div>
          ) : (
            <form onSubmit={generate} className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[rgba(212,175,55,0.15)]">
                {["soins", "protection", "exorcisme", "aide", "esoterisme", "wicca"].map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setAiForm({ ...aiForm, category: c })}
                    className={`py-3 font-engraved text-[10px] transition ${aiForm.category === c ? "bg-[var(--bordeaux)] text-[var(--ivory)]" : "bg-[rgba(17,19,26,0.8)] text-[var(--ivory-muted)] hover:text-[var(--gold)]"}`}
                    data-testid={`ai-cat-${c}`}
                  >
                    {c === "esoterisme" ? "rituels" : c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-px bg-[rgba(212,175,55,0.15)]">
                {["doux", "puissant", "intime"].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setAiForm({ ...aiForm, tone: t })}
                    className={`py-3 font-engraved text-[10px] transition ${aiForm.tone === t ? "bg-[var(--bordeaux)] text-[var(--ivory)]" : "bg-[rgba(17,19,26,0.8)] text-[var(--ivory-muted)] hover:text-[var(--gold)]"}`}
                    data-testid={`ai-tone-${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                required
                rows={5}
                value={aiForm.intention}
                onChange={(e) => setAiForm({ ...aiForm, intention: e.target.value })}
                placeholder="Décrivez l'intention, la situation, la personne…"
                className="sacred-input sharp resize-none"
                data-testid="ai-intention"
              />
              <button
                type="submit"
                disabled={generating}
                className="btn-sacred btn-sacred-filled sharp w-full"
                data-testid="ai-generate-btn"
              >
                {generating ? "Composition…" : "Composer la prière"}
              </button>
            </form>
          )}

          {latest && (
            <div className="mt-8 pt-8 border-t border-[rgba(212,175,55,0.15)]" data-testid="ai-latest">
              <p className="font-engraved text-[10px] text-[var(--gold)] mb-3">Oraison fraîchement tissée</p>
              <p className="font-serif-body text-[var(--ivory)] whitespace-pre-line leading-loose">{latest.prayer}</p>
            </div>
          )}
        </div>

        {/* My requests */}
        <div className="sacred-card sharp p-10">
          <div className="flex items-center gap-3 mb-6">
            <ScrollText className="text-[var(--gold)]" strokeWidth={1.1} size={28} />
            <h2 className="font-serif-display text-3xl text-[var(--ivory)]">Mes intentions</h2>
          </div>
          {requests.length === 0 ? (
            <p className="font-serif-body italic text-[var(--ivory-muted)]">
              Aucune intention déposée pour l'instant. <Link to="/contact" className="text-[var(--gold)] underline-offset-4 hover:underline">Nous écrire</Link>.
            </p>
          ) : (
            <ul className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
              {requests.map((r) => (
                <li key={r.id} className="border-l-2 border-[var(--gold)]/40 pl-4">
                  <p className="font-engraved text-[10px] text-[var(--gold)]">{r.category} · {new Date(r.created_at).toLocaleDateString("fr-FR")}</p>
                  <p className="font-serif-body text-[var(--ivory)] mt-1 leading-relaxed">{r.intention}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {user.is_donor && aiPrayers.length > 0 && (
        <div className="sacred-card sharp p-10" data-testid="ai-history">
          <h2 className="font-serif-display text-3xl text-[var(--ivory)] mb-6">Mes oraisons tissées</h2>
          <div className="space-y-8 max-h-[600px] overflow-y-auto pr-3">
            {aiPrayers.map((p) => (
              <div key={p.id} className="border-l-2 border-[var(--gold)]/40 pl-5">
                <p className="font-engraved text-[10px] text-[var(--gold)] mb-2">{p.category} · {p.tone} · {new Date(p.created_at).toLocaleDateString("fr-FR")}</p>
                <p className="font-serif-body italic text-[var(--ivory-muted)] text-sm mb-3">Intention : {p.intention}</p>
                <p className="font-serif-body text-[var(--ivory)] whitespace-pre-line leading-loose">{p.prayer_text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EspaceMembre;
