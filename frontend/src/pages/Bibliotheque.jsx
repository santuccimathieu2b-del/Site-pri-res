import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { HeartPulse, Shield, Flame, Sparkles as SparklesIcon, HandHelping, Moon, Lock, ScrollText, Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const ICONS = { soins: HeartPulse, protection: Shield, exorcisme: Flame, aide: HandHelping, esoterisme: SparklesIcon, wicca: Moon };

const emptyForm = { title: "", category_slug: "soins", excerpt: "", body: "", is_premium: false };

const Bibliotheque = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null); // null | "new" | prayer object
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const isAdmin = !!user?.is_admin;

  const activeCat = searchParams.get("cat") || "all";

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const loadPrayers = () => {
    setLoading(true);
    const params = activeCat !== "all" ? { category: activeCat } : {};
    api.get("/prayers", { params }).then(({ data }) => {
      setPrayers(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadPrayers(); /* eslint-disable-next-line */ }, [activeCat, user]);

  const tabs = useMemo(() => [{ slug: "all", name: "Toutes les prières" }, ...categories], [categories]);

  const openNew = () => { setForm(emptyForm); setEditing("new"); };
  const openEdit = (p) => {
    setForm({
      title: p.title, category_slug: p.category_slug, excerpt: p.excerpt,
      body: p.body || "", is_premium: !!p.is_premium,
    });
    setEditing(p);
  };
  const closeEdit = () => { setEditing(null); setForm(emptyForm); };

  const saveForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        await api.post("/admin/prayers", form);
        toast.success("Prière ajoutée au espace.");
      } else {
        await api.put(`/admin/prayers/${editing.id}`, form);
        toast.success("Prière mise à jour.");
      }
      closeEdit();
      loadPrayers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const deletePrayer = async (p) => {
    if (!window.confirm(`Supprimer définitivement « ${p.title} » ?`)) return;
    try {
      await api.delete(`/admin/prayers/${p.id}`);
      toast.success("Prière retirée du espace.");
      loadPrayers();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Suppression impossible.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20" data-testid="library-page">
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
            La <em className="text-[var(--gold)]">Bibliothèque</em> des prières et des pratiques
          </h1>
          <div className="mt-6 sacred-card sharp p-5 border-l-4 border-l-[var(--gold)] max-w-3xl" data-testid="library-disclaimer">
            <p className="font-serif-body text-[var(--ivory-muted)] text-sm leading-relaxed">
              <span className="font-engraved text-[var(--gold)] text-[10px] mr-2">Rappel :</span>
              Les prières et rituels présentés sur ce site ne constituent ni un avis médical ni une alternative à un
              suivi professionnel. Pour toute question concernant votre santé physique ou mentale, consultez un
              professionnel de santé.
            </p>
          </div>
          <p className="mt-6 max-w-2xl font-serif-body text-[var(--ivory-muted)] text-lg">
            Pour déverrouiller l'accès complet à la bibliothèque, il est nécessaire de s'abonner.
          </p>
        </div>
        {isAdmin && (
          <button onClick={openNew} className="btn-sacred sharp flex items-center gap-2" data-testid="admin-add-prayer-btn">
            <Plus size={14} strokeWidth={1.6} /> Ajouter une prière
          </button>
        )}
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
              <div key={p.id} className="sacred-card sharp p-8 flex flex-col gap-4 group relative" data-testid={`prayer-card-${p.id}`}>
                <button onClick={() => setSelected(p)} className="text-left flex flex-col gap-4 flex-1">
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
                {isAdmin && (
                  <div className="flex gap-2 pt-3 border-t border-[rgba(212,175,55,0.12)]">
                    <button
                      onClick={() => openEdit(p)}
                      className="nav-link flex items-center gap-1 text-[10px]"
                      data-testid={`admin-edit-${p.id}`}
                    >
                      <Pencil size={11} strokeWidth={1.4} /> Modifier
                    </button>
                    <button
                      onClick={() => deletePrayer(p)}
                      className="nav-link flex items-center gap-1 text-[10px] ml-auto hover:text-[#c0584b]"
                      data-testid={`admin-delete-${p.id}`}
                    >
                      <Trash2 size={11} strokeWidth={1.4} /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Read Modal */}
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
            <button onClick={() => setSelected(null)} className="absolute top-4 right-6 nav-link" data-testid="prayer-modal-close">
              Fermer ✕
            </button>
            <p className="font-engraved text-[var(--gold)] text-[10px] mb-4">
              {categories.find((c) => c.slug === selected.category_slug)?.name || ""}
            </p>
            <p className="font-serif-body italic text-[var(--ivory-muted)] text-sm mb-6 leading-relaxed border-l-2 border-[var(--gold)]/40 pl-3" data-testid="cross-info">
              Quand vous rencontrez le pictogramme <span className="text-[var(--gold)]">†</span>, cela signifie que vous devez vous signer d'un signe de croix.
            </p>
            <h2 className="font-serif-display text-4xl text-[var(--ivory)] mb-8 leading-tight">{selected.title}</h2>
            <div className="divider-ornament mb-8"><ScrollText size={14} strokeWidth={1.2} /></div>

            {selected.locked ? (
              <div className="locked-overlay sharp p-10 text-center">
                <Lock className="mx-auto text-[var(--gold)] mb-4" strokeWidth={1.2} size={32} />
                <h3 className="font-serif-display text-3xl text-[var(--ivory)] mb-3">Prière scellée</h3>
                <p className="font-serif-body text-[var(--ivory-muted)] mb-8 max-w-md mx-auto">
                  Cette prière est confiée aux abonnés. Abonnez-vous pour en recevoir l'accès.
                </p>
                <Link to="/abonnement" className="btn-sacred sharp" data-testid="locked-cta">S'abonner</Link>
              </div>
            ) : (
              <>
                {selected.pdf_url && (
                  <div className="mb-8 flex justify-center">
                    <a
                      href={selected.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sacred sharp inline-flex items-center gap-2"
                      data-testid="prayer-pdf-download"
                    >
                      📜 Télécharger le PDF intégral
                    </a>
                  </div>
                )}
                <p className="font-serif-body text-[var(--ivory)] text-lg leading-loose whitespace-pre-line">
                  {selected.body}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Admin Editor Modal */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={closeEdit}
          data-testid="admin-prayer-modal"
        >
          <form
            onSubmit={saveForm}
            className="sacred-card sharp max-w-3xl w-full p-10 max-h-[90vh] overflow-y-auto relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={closeEdit} className="absolute top-4 right-6 nav-link" data-testid="admin-modal-close">
              <X size={16} />
            </button>
            <p className="font-engraved text-[var(--gold)] text-[11px]">
              {editing === "new" ? "Nouvelle prière" : "Modifier la prière"}
            </p>
            <h2 className="font-serif-display text-3xl text-[var(--ivory)]">
              {editing === "new" ? "Déposer une nouvelle prière" : editing.title}
            </h2>

            <div>
              <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Titre</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="sacred-input sharp"
                data-testid="admin-title"
              />
            </div>

            <div>
              <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Catégorie</label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[rgba(212,175,55,0.15)]">
                {["soins", "protection", "exorcisme", "aide", "wicca", "esoterisme"].map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm({ ...form, category_slug: c })}
                    className={`py-3 font-engraved text-[10px] transition ${form.category_slug === c ? "bg-[var(--bordeaux)] text-[var(--ivory)]" : "bg-[rgba(17,19,26,0.8)] text-[var(--ivory-muted)] hover:text-[var(--gold)]"}`}
                    data-testid={`admin-cat-${c}`}
                  >
                    {c === "esoterisme" ? "rituels" : c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Extrait (résumé court)</label>
              <input
                required
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="sacred-input sharp"
                data-testid="admin-excerpt"
              />
            </div>

            <div>
              <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Texte de la prière</label>
              <textarea
                required
                rows={10}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="sacred-input sharp resize-none whitespace-pre-line"
                placeholder="Écrivez les versets, ligne par ligne…"
                data-testid="admin-body"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer" data-testid="admin-premium-label">
              <input
                type="checkbox"
                checked={form.is_premium}
                onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
                className="w-5 h-5 accent-[var(--gold)]"
                data-testid="admin-premium"
              />
              <span className="font-serif-body text-[var(--ivory)]">
                Prière scellée (réservée aux abonnés)
              </span>
            </label>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-sacred btn-sacred-filled sharp flex-1"
                data-testid="admin-save-btn"
              >
                {saving ? "Sauvegarde…" : editing === "new" ? "Déposer" : "Mettre à jour"}
              </button>
              <button
                type="button"
                onClick={closeEdit}
                className="btn-sacred sharp"
                data-testid="admin-cancel-btn"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Bibliotheque;
