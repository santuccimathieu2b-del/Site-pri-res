import React, { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Send, ScrollText } from "lucide-react";

const Demande = () => {
  const [form, setForm] = useState({ name: "", email: "", category: "soins", intention: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/prayer-requests", form);
      setDone(true);
      toast.success("Votre intention a été reçue.");
      setForm({ name: "", email: "", category: "soins", intention: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20" data-testid="demande-page">
      <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Confier une intention</p>
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
        Déposez votre <em className="text-[var(--gold)]">intention</em>
      </h1>
      <p className="mt-6 mb-12 font-serif-body text-[var(--ivory-muted)] text-lg leading-relaxed">
        Écrivez avec vos mots, sans souci de forme. Votre demande sera reçue avec recueillement et portée dans nos prières
        quotidiennes.
      </p>

      <div className="divider-ornament mb-12"><ScrollText size={14} strokeWidth={1.2} /></div>

      {done ? (
        <div className="sacred-card sharp p-12 text-center" data-testid="demande-success">
          <h2 className="font-serif-display text-4xl text-[var(--gold)] mb-4">Votre intention est entendue.</h2>
          <p className="font-serif-body text-[var(--ivory-muted)] mb-8">
            Une confirmation vous a été envoyée. Nos prières s'élèvent désormais avec vous.
          </p>
          <button onClick={() => setDone(false)} className="btn-sacred sharp" data-testid="demande-new">
            Déposer une autre intention
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="sacred-card sharp p-8 md:p-12 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Votre nom</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="sacred-input sharp"
                placeholder="Marie, Étienne…"
                data-testid="demande-name"
              />
            </div>
            <div>
              <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Votre courriel</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="sacred-input sharp"
                placeholder="votre@email.fr"
                data-testid="demande-email"
              />
            </div>
          </div>

          <div>
            <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Type de prière</label>
            <div className="grid grid-cols-3 gap-px bg-[rgba(212,175,55,0.15)]">
              {["soins", "protection", "exorcisme"].map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setForm({ ...form, category: c })}
                  className={`py-4 font-engraved text-[10px] transition ${form.category === c ? "bg-[var(--bordeaux)] text-[var(--ivory)]" : "bg-[rgba(17,19,26,0.8)] text-[var(--ivory-muted)] hover:text-[var(--gold)]"}`}
                  data-testid={`demande-cat-${c}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Votre intention</label>
            <textarea
              required
              rows={7}
              value={form.intention}
              onChange={(e) => setForm({ ...form, intention: e.target.value })}
              className="sacred-input sharp resize-none"
              placeholder="Écrivez librement. Pour qui priez-vous ? Que souhaitez-vous voir advenir ?"
              data-testid="demande-intention"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-sacred btn-sacred-filled sharp w-full flex items-center justify-center gap-3"
            data-testid="demande-submit"
          >
            <Send size={14} strokeWidth={1.4} />
            {submitting ? "Recueillement…" : "Déposer l'intention"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Demande;
