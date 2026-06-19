import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/index.css";
import "@/App.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Bibliotheque from "@/pages/Bibliotheque";
import Demande from "@/pages/Demande";
import Dons from "@/pages/Dons";
import DonsMerci from "@/pages/DonsMerci";
import AuthPage from "@/pages/AuthPage";
import EspaceMembre from "@/pages/EspaceMembre";
import Temoignages from "@/pages/Temoignages";
import APropos from "@/pages/APropos";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#11131A",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#F4ECD8",
              fontFamily: "EB Garamond, serif",
              borderRadius: 0,
            },
          }}
        />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bibliotheque" element={<Bibliotheque />} />
            <Route path="/demande" element={<Demande />} />
            <Route path="/abonnement" element={<Dons />} />
            <Route path="/abonnement/merci" element={<DonsMerci />} />
            <Route path="/dons" element={<Dons />} />
            <Route path="/dons/merci" element={<DonsMerci />} />
            <Route path="/connexion" element={<AuthPage mode="login" />} />
            <Route path="/inscription" element={<AuthPage mode="register" />} />
            <Route path="/espace-membre" element={<EspaceMembre />} />
            <Route path="/temoignages" element={<Temoignages />} />
            <Route path="/apropos" element={<APropos />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
