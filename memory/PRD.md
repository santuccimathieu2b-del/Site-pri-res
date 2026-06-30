# Soins Protections Délivrances — PRD

## Problem statement
Plateforme web spécialisée dans les prières de soins, de protections et d'exorcismes. Bibliothèque catégorisée de prières (certaines réservées aux donateurs), formulaire de contact, et espace membre. Style visuel sacré et traditionnel. Orientation spirituelle non-confessionnelle.

## Stack
- Backend: FastAPI + Motor (MongoDB)
- Frontend: React + Tailwind + Shadcn UI
- Auth: JWT custom
- Paiement: Stripe Checkout (29€ abonnement à vie) — clés test
- Email: Resend — clé placeholder (à remplacer)
- IA: OpenAI GPT-4o via Emergent LLM Key (prières IA)

## Catégories de prières
- soins
- protection
- exorcisme
- aide
- esoterisme

## Pages frontend
Home, Bibliothèque, Pratique & Conseils, Abonnement, Contact, Témoignages, À propos, Connexion, Espace Membre

## Statut implémenté
- 65 prières en base (dont 7 dans "exorcisme et délivrance")
- Auth admin opérationnelle
- Stripe checkout fonctionnel (test)
- Page Pratique et conseils
- PDF d'exorcisme intégré + texte de 26k+ caractères
- Renommage : "Soins Protections Délivrances"

## Changelog
- 2026-02 : Ajout de la 65ème prière "Le protocole médiéval de délivrance de trois jours" dans catégorie "exorcisme"
- 2026-02 : 64 prières seedées, refonte de navigation, PDF intégré

## Backlog (P1)
- Remplacer clés Stripe test → live
- Configurer vraie clé API Resend
- Changer JWT_SECRET pour production
- Déploiement Emergent (URL permanente)

## Backlog (P2)
- Refactor server.py (devient volumineux)
- Page admin pour gestion des prières (UI)

## Credentials de test
Voir `/app/memory/test_credentials.md`
