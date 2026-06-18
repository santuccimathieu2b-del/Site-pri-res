import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Flame, Check } from "lucide-react";

const DonsMerci = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState({ state: "checking", data: null });
  const attemptsRef = useRef(0);
  const { refresh } = useAuth();

  useEffect(() => {
    if (!sessionId) return setStatus({ state: "error", data: null });
    let cancelled = false;

    const poll = async () => {
      attemptsRef.current++;
      try {
        const { data } = await api.get(`/donations/status/${sessionId}`);
        if (cancelled) return;
        if (data.payment_status === "paid") {
          setStatus({ state: "paid", data });
          refresh();
          return;
        }
        if (data.status === "expired") {
          setStatus({ state: "expired", data });
          return;
        }
        if (attemptsRef.current >= 8) {
          setStatus({ state: "pending", data });
          return;
        }
        setTimeout(poll, 2000);
      } catch (e) {
        setStatus({ state: "error", data: null });
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [sessionId, refresh]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-32 text-center" data-testid="dons-merci-page">
      <Flame className="text-[var(--gold)] flicker mx-auto mb-8" strokeWidth={1.1} size={60} />

      {status.state === "checking" && (
        <>
          <h1 className="font-serif-display text-4xl text-[var(--ivory)] mb-4">Recueillement…</h1>
          <p className="font-serif-body text-[var(--ivory-muted)]">Nous vérifions la lumière que vous avez déposée.</p>
        </>
      )}
      {status.state === "paid" && (
        <>
          <div className="divider-ornament mb-8"><Check size={16} /></div>
          <h1 className="font-serif-display text-5xl text-[var(--gold)] mb-4" data-testid="merci-title">
            Merci infiniment.
          </h1>
          <p className="font-serif-body text-lg text-[var(--ivory-muted)] mb-8 leading-relaxed">
            Votre offrande de {status.data?.amount} {status.data?.currency?.toUpperCase()} a été reçue. Votre âme rejoint
            le cercle des gardiens du sanctuaire. Une confirmation vous a été envoyée.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/bibliotheque" className="btn-sacred sharp" data-testid="merci-cta-library">
              Accéder aux prières sacrées
            </Link>
            <Link to="/espace-membre" className="btn-sacred btn-sacred-filled sharp" data-testid="merci-cta-member">
              Mon espace
            </Link>
          </div>
        </>
      )}
      {status.state === "pending" && (
        <>
          <h1 className="font-serif-display text-4xl text-[var(--ivory)] mb-4">Votre offrande est en cours…</h1>
          <p className="font-serif-body text-[var(--ivory-muted)]">
            La confirmation peut prendre quelques instants. Vous recevrez un courriel dès qu'elle sera complète.
          </p>
        </>
      )}
      {(status.state === "expired" || status.state === "error") && (
        <>
          <h1 className="font-serif-display text-4xl text-[var(--ivory)] mb-4">L'offrande n'a pu aboutir.</h1>
          <p className="font-serif-body text-[var(--ivory-muted)] mb-8">Vous pouvez reprendre le chemin quand vous le souhaitez.</p>
          <Link to="/dons" className="btn-sacred sharp">Retourner aux offrandes</Link>
        </>
      )}
    </div>
  );
};

export default DonsMerci;
