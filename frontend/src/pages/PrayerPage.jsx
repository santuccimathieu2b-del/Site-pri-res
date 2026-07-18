import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft, Lock, ScrollText } from "lucide-react";
import { toast } from "sonner";

const PrayerPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [prayer, setPrayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/prayers/by-slug/${slug}`)
      .then((res) => setPrayer(res.data))
      .catch(() => setPrayer(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const jsonLd = prayer && !prayer.locked ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: prayer.title,
    description: prayer.excerpt,
    articleBody: prayer.body,
    inLanguage: "fr-FR",
    isFamilyFriendly: true,
    author: { "@type": "Organization", name: "MCS-Éditions" },
    publisher: { "@type": "Organization", name: "MCS-Éditions" },
    datePublished: prayer.created_at,
    articleSection: prayer.category_slug,
  } : null;

  useSEO({
    title: prayer ? prayer.title : "Prière",
    description: prayer ? prayer.excerpt : undefined,
    path: `/priere/${slug}`,
    jsonLd,
    keywords: prayer ? `prière, ${prayer.category_slug}, ${prayer.title.toLowerCase()}, prieres-soins-delivrance` : undefined,
  });

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-[var(--ivory-muted)] italic" data-testid="prayer-page-loading">
        Recueillement…
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center" data-testid="prayer-page-notfound">
        <h1 className="font-serif-display text-3xl text-[var(--ivory)] mb-4">Prière introuvable</h1>
        <p className="text-[var(--ivory-muted)] mb-8">La prière que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link to="/bibliotheque" className="btn-sacred sharp inline-block">Retour à la bibliothèque</Link>
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${prayer.title}\n\n${prayer.body}`);
      toast.success("Prière copiée");
    } catch {
      toast.error("Copie impossible");
    }
  };

  return (
    <article className="max-w-3xl mx-auto px-6 lg:px-10 py-16" data-testid="prayer-page">
      <button
        onClick={() => navigate("/bibliotheque")}
        className="inline-flex items-center gap-2 text-[var(--ivory-muted)] hover:text-[var(--gold)] transition mb-8 font-engraved text-[11px]"
        data-testid="prayer-back-btn"
      >
        <ArrowLeft size={14} /> Retour à la bibliothèque
      </button>

      <header className="mb-12 border-b border-[rgba(212,175,55,0.15)] pb-8">
        <p className="font-engraved text-[var(--gold)] text-[11px] tracking-widest mb-3">
          {prayer.category_slug}
        </p>
        <h1 className="font-serif-display text-4xl md:text-5xl text-[var(--ivory)] leading-tight" data-testid="prayer-page-title">
          {prayer.title}
        </h1>
        {prayer.excerpt && (
          <p className="mt-6 font-serif-body italic text-[var(--ivory-muted)] text-lg leading-relaxed">
            {prayer.excerpt}
          </p>
        )}
      </header>

      {prayer.locked ? (
        <div className="rounded-none border border-[rgba(212,175,55,0.3)] bg-[rgba(17,19,26,0.5)] p-10 text-center" data-testid="prayer-locked">
          <Lock className="text-[var(--gold)] mx-auto mb-4" size={32} />
          <h2 className="font-serif-display text-2xl text-[var(--ivory)] mb-3">Prière scellée</h2>
          <p className="text-[var(--ivory-muted)] mb-6">
            Cette prière est réservée à celles et ceux qui soutiennent le sanctuaire par leur abonnement.
          </p>
          <Link to="/abonnement" className="btn-sacred btn-sacred-filled sharp inline-block" data-testid="prayer-unlock-cta">
            Rejoindre pour la découvrir
          </Link>
        </div>
      ) : (
        <>
          {prayer.pdf_url && (
            <div className="mb-8 flex justify-center">
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const response = await fetch(prayer.pdf_url);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = blobUrl;
                    a.download = `${slug}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
                    toast.success("Téléchargement en cours…");
                  } catch {
                    window.open(prayer.pdf_url, "_blank", "noopener,noreferrer");
                  }
                }}
                className="btn-sacred sharp inline-flex items-center gap-2"
                data-testid="prayer-page-pdf-download"
              >
                <ScrollText size={16} /> Télécharger le PDF intégral
              </button>
            </div>
          )}

          <div
            className="font-serif-body text-[var(--ivory)] text-lg leading-loose whitespace-pre-wrap"
            data-testid="prayer-page-body"
          >
            {prayer.body}
          </div>

          <div className="mt-12 pt-8 border-t border-[rgba(212,175,55,0.12)] flex flex-wrap gap-4 justify-center">
            <button onClick={copy} className="btn-sacred sharp" data-testid="prayer-copy-btn">
              Copier la prière
            </button>
            <Link to="/bibliotheque" className="btn-sacred sharp">
              Autres prières
            </Link>
          </div>
        </>
      )}
    </article>
  );
};

export default PrayerPage;
