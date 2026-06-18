# Sanctuaire Sacré — PRD

## Problem Statement
Un site web spécialisé dans les prières de soins, de protections et d'exorcismes.

## User Choices
- Plateforme complète
- Bibliothèque de prières (catégorisées, certaines réservées aux donateurs)
- Formulaire de demande de prière + espace membre
- Style sacré et traditionnel
- Spiritualité générale non confessionnelle
- Intégrations: Stripe (dons), Resend (emails), Claude Sonnet 4.5 (génération de prières IA)

## Architecture
- Backend: FastAPI + MongoDB + JWT auth (bcrypt) + emergentintegrations (Stripe + Claude)
- Frontend: React + Tailwind + custom sacred theme (Cormorant Garamond, EB Garamond, Cinzel)
- Stripe Checkout sessions with payment_transactions tracking + donor status grant
- AI prayer composition via Claude Sonnet 4.5 (donor-gated)
- Resend transactional emails (welcome, prayer-request confirmation, donation thank-you)

## User Personas
1. **Le Pèlerin** — visiteur libre cherchant l'apaisement et lisant la bibliothèque
2. **L'Âme Confiante** — soumet une intention de prière personnelle
3. **Le Gardien** — membre donateur (≥21€), accès aux prières scellées et oraisons IA personnelles

## What's Implemented (2026-06-18)
- Auth (register, login, /me) JWT
- 3 catégories (soins, protection, exorcisme) + 12 prières seedées (6 premium scellées)
- Bibliothèque avec verrouillage premium dynamique pour non-donateurs
- Formulaire de demande de prière + email confirmation
- Espace membre avec historique des demandes et oraisons IA
- Génération de prière IA (Claude Sonnet 4.5, 3 tons, 3 catégories) — donor-only
- Stripe Checkout (4 packages: 7€, 21€, 49€, 108€) + polling + donor status grant + email merci
- Témoignages, page À propos
- Design sacré (typo serif, dark candlelit, parchemin overlay, animations flicker/reveal)

## Backlog (Prioritized)
### P0
- Resend real API key (currently placeholder, emails mocked/logged)
- JWT_SECRET rotation in production
- Admin guard sur /api/admin/seed

### P1
- Recherche & filtrage dans la bibliothèque
- Téléchargement PDF d'une prière / oraison IA
- Compteur de prières quotidiennes priées par la communauté
- Page d'abonnement récurrent mensuel (au lieu de don ponctuel)

### P2
- Mode audio (lecture vocale des prières par TTS)
- Espace forum entre membres gardiens
- Calendrier liturgique non-confessionnel des intentions
- Multilangue (EN/ES/IT)

## Next Tasks
1. Obtenir clé Resend valide pour activer les emails réels
2. Tester en preview live le flux de don Stripe complet
3. Ajouter recherche & favoris sur la bibliothèque
