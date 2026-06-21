import React from "react";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-[rgba(212,175,55,0.12)] mt-32" data-testid="main-footer">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-12">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Flame className="text-[var(--gold)] flicker" strokeWidth={1.2} size={22} />
          <span className="font-engraved text-[var(--gold)] text-xs">Soins · Protections · Délivrances</span>
        </div>
        <p className="text-sm text-[var(--ivory-muted)] leading-relaxed font-serif-body italic">
          Un refuge spirituel non-confessionnel pour les âmes en quête de soins, de protection et de libération.
        </p>
      </div>
      <div>
        <h4 className="font-engraved text-[var(--gold)] text-[11px] mb-4">Chemins</h4>
        <ul className="space-y-2 text-sm text-[var(--ivory-muted)]">
          <li><Link to="/bibliotheque" className="hover:text-[var(--gold)] transition">Bibliothèque</Link></li>
          <li><Link to="/contact" className="hover:text-[var(--gold)] transition">Contact</Link></li>
          <li><Link to="/abonnement" className="hover:text-[var(--gold)] transition">Abonnement</Link></li>
          <li><Link to="/temoignages" className="hover:text-[var(--gold)] transition">Témoignages</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-engraved text-[var(--gold)] text-[11px] mb-4">Compte</h4>
        <ul className="space-y-2 text-sm text-[var(--ivory-muted)]">
          <li><Link to="/apropos" className="hover:text-[var(--gold)] transition">Notre mission</Link></li>
          <li><Link to="/espace-membre" className="hover:text-[var(--gold)] transition">Espace membre</Link></li>
          <li><Link to="/inscription" className="hover:text-[var(--gold)] transition">Rejoindre</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-engraved text-[var(--gold)] text-[11px] mb-4">Recueillement</h4>
        <p className="text-sm text-[var(--ivory-muted)] italic font-serif-body">
          « Que ta lumière soit le chemin, ta paix soit la demeure. »
        </p>
      </div>
    </div>
    <div className="border-t border-[rgba(212,175,55,0.08)] py-6 text-center text-xs text-[var(--ivory-muted)] font-engraved">
      © {new Date().getFullYear()} Soins Protections Délivrances — Tous chemins préservés
    </div>
  </footer>
);

export default Footer;
