import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Flame } from "lucide-react";
import { toast } from "sonner";

const AuthPage = ({ mode }) => {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password, form.name);
      }
      const redirect = location.state?.from || "/espace-membre";
      nav(redirect);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Erreur d'authentification.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24" data-testid={`auth-${mode}-page`}>
      <div className="text-center mb-10">
        <Flame className="text-[var(--gold)] flicker mx-auto mb-4" strokeWidth={1.1} size={40} />
        <p className="font-engraved text-[var(--gold)] text-[11px] mb-2">
          {mode === "login" ? "Retour au espace" : "Rejoindre le espace"}
        </p>
        <h1 className="font-serif-display text-4xl text-[var(--ivory)]">
          {mode === "login" ? "Connexion" : "Inscription"}
        </h1>
      </div>

      <form onSubmit={submit} className="sacred-card sharp p-8 space-y-5">
        {mode === "register" && (
          <div>
            <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Votre nom</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="sacred-input sharp"
              data-testid="auth-name"
            />
          </div>
        )}
        <div>
          <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Courriel</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="sacred-input sharp"
            data-testid="auth-email"
          />
        </div>
        <div>
          <label className="font-engraved text-[10px] text-[var(--gold)] block mb-2">Mot de passe</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="sacred-input sharp"
            data-testid="auth-password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-sacred btn-sacred-filled sharp w-full"
          data-testid="auth-submit"
        >
          {submitting ? "Recueillement…" : mode === "login" ? "Entrer" : "Rejoindre"}
        </button>
      </form>

      <p className="text-center mt-8 font-serif-body text-[var(--ivory-muted)]">
        {mode === "login" ? (
          <>Pas encore membre ? <Link to="/inscription" className="text-[var(--gold)] underline-offset-4 hover:underline">Rejoindre</Link></>
        ) : (
          <>Déjà membre ? <Link to="/connexion" className="text-[var(--gold)] underline-offset-4 hover:underline">Connexion</Link></>
        )}
      </p>
    </div>
  );
};

export default AuthPage;
