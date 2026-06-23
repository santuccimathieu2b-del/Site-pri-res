import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Flame, LogOut, User } from "lucide-react";

const baseLinks = [
  { to: "/", label: "Accueil" },
  { to: "/pratique", label: "Pratique et conseils" },
  { to: "/bibliotheque", label: "Bibliothèque" },
  { to: "/abonnement", label: "Abonnement" },
  { to: "/contact", label: "Contact" },
  { to: "/temoignages", label: "Témoignages" },
  { to: "/apropos", label: "À propos" },
];

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#08090C]/85 border-b border-[rgba(212,175,55,0.12)]" data-testid="main-nav">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
          <Flame className="text-[var(--gold)] flicker" strokeWidth={1.2} size={26} />
          <div className="leading-tight">
            <div className="font-engraved text-[var(--gold)] text-[12px] tracking-[0.22em]">Soins · Protections</div>
            <div className="font-engraved text-[var(--gold)] text-[12px] tracking-[0.22em] mt-0.5">Délivrances</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {baseLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              data-testid={`nav-${l.to.replace("/", "") || "home"}`}
              end={l.to === "/"}
            >
              {l.label}
            </NavLink>
          ))}
          {!user && (
            <NavLink
              to="/connexion"
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              data-testid="nav-connexion"
            >
              Connexion
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/espace-membre" className="nav-link flex items-center gap-2" data-testid="member-area-link">
                <User size={14} strokeWidth={1.4} /> {user.name?.split(" ")[0]}
                {user.is_donor && <span className="text-[var(--gold)] text-[10px]">✦</span>}
              </Link>
              <button onClick={logout} className="nav-link" data-testid="logout-btn" aria-label="Déconnexion">
                <LogOut size={14} strokeWidth={1.4} />
              </button>
            </>
          ) : (
            <Link to="/connexion" className="nav-link lg:hidden" data-testid="login-link-mobile">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
