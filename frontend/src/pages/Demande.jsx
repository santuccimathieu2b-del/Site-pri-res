import React, { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Send, ScrollText } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", intention: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // category is no longer asked from user; default to "soins" server-side
      await api.post("/prayer-requests", { ...form, category: "soins" });
      setDone(true);
      toast.success("Votre message a été reçu.");
      setForm({ name: "", email: "", intention: "" });
    } catch (err) {
      toast.error(err.response?.data?.detail || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-20" data-testid="contact-page">
      <p className="font-engraved text-[var(--gold)] text-[11px] mb-4">Nous écrire</p>
      <h1 className="font-serif-display text-5xl md:text-6xl text-[var(--ivory)] leading-tight">
        <em className="text-[var(--gold)]">Contact</em>
      </h1>
      <p className="mt-6 mb-12 font-serif-body text-[var(--ivory-muted)] text-lg leading-relaxed">
        Écrivez-nous avec vos mots, sans souci de forme. Votre message sera lu avec attention et vous recevrez une réponse.
      </p>

      <div className="divider-ornament mb-12"><ScrollText size={14} strokeWidth={1.2} /></div>

      {done ? (
        <div className="sacred-card sharp p-12 text-center" data-testid="contact-success">
          <h2 className="font-serif-display text-4xl text-[var(--gold)] mb-4">Votre message est arrivé.</h2>
          <p className="font-serif-body text-[var(--ivory-muted)] mb-8">
            Une confirmation vous a été envoyée. Nous reviendrons vers vous dans les meilleurs délais.
          </p>
          <button onClick={() => setDone(false)} className="btn-sacred sharp" data-testid="contact-new">
            Envoyer un autre message
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
                data-testid="contact-name"
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
                data-testid="contact-email"
              />
            </div>
          </div>

          <div>
            <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Votre message</label>
            <textarea
              required
              rows={8}
              value={form.intention}
              onChange={(e) => setForm({ ...form, intention: e.target.value })}
              className="sacred-input sharp resize-none"
              placeholder="Écrivez librement…"
              data-testid="contact-message"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-sacred btn-sacred-filled sharp w-full flex items-center justify-center gap-3"
            data-testid="contact-submit"
          >
            <Send size={14} strokeWidth={1.4} />
            {submitting ? "Envoi…" : "Envoyer le message"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
