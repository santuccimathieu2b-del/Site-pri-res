# PRD - Sanctuaire des Prières (prieres-soins-delivrance.fr)

## Problème Initial / Vision
Site web spécialisé dans les prières de soins, de protection et d'exorcismes.
- Bibliothèque catégorisée (certaines prières réservées aux abonnés)
- Formulaire de contact + espace membre
- Style visuel : sacré et traditionnel
- Orientation spirituelle non-confessionnelle
- Paiement Stripe (abonnement à vie 29€)
- Emails via Resend
- Génération de prières personnelles via AI

## User Persona
- Personnes en recherche de soutien spirituel (soins, protection, délivrance)
- Non-confessionnel (chrétiens, praticiens ésotériques, wicca, etc.)
- Prêt à payer 29€ à vie pour accéder aux prières scellées

## Core Requirements
- Bibliothèque dynamique (109 prières, 5 catégories)
- Abonnement Stripe (29€ à vie, mode LIVE)
- SEO : slugs par prière, sitemap XML, meta tags
- Pages légales (Mentions, CGV, Confidentialité)
- Domaine custom (prieres-soins-delivrance.fr) via OVH

## État actuel
- **Site LIVE** : https://prieres-soins-delivrance.fr
- **Preview** : https://spirit-shield-1.preview.emergentagent.com
- **Stack** : FastAPI + React + MongoDB
- **Prières** : 109 (Soins, Protection, Exorcisme, Aide, Wicca/Celtique)
- **Stripe** : LIVE mode, invoice_creation activé, Stripe Link détecté
- **Analytics** : Google Analytics 4 (`G-LB6ZPMWW1H`)
- **SEO** : Google Search Console 119 URLs / Bing Webmaster 119 URLs

## Changelog

### 2026-07-20 - SEO & Analytics
- ✅ Sitemap XML statique généré (`/app/frontend/public/sitemap.xml`, 119 URLs)
- ✅ Script helper `/app/backend/scripts/generate_sitemap.py` pour régénération
- ✅ Google Search Console : 119 URLs découvertes
- ✅ Bing Webmaster Tools : 119 URLs découvertes
- ✅ Google Analytics 4 intégré dans `index.html` (ID : G-LB6ZPMWW1H)

### Sessions précédentes
- ✅ 109 prières ajoutées, 5 catégories
- ✅ JSON backup + script restore
- ✅ Push GitHub (Site-pri-res)
- ✅ Warning exorcisme sur page Pratique
- ✅ Download PDF via fetch/blob (bypass CORS)
- ✅ Stripe LIVE + invoice_creation
- ✅ Domaine custom via OVH DNS
- ✅ SEO : slugs, `/priere/:slug`, useSEO hook, robots.txt, llms.txt
- ✅ Pages légales + email SVG obfusqué

## Prioritized Backlog

### P1 (Important)
- [ ] Update JWT_SECRET en production (actuellement `jwt_secret_change_in_prod_2026`)
- [ ] Vérifier Google Analytics à J+2 (temps réel + rapports)
- [ ] Vérifier réception des messages du formulaire de contact

### P2 (Nice to have)
- [ ] Intégration Resend (emails de bienvenue personnalisés — Stripe envoie déjà les reçus)
- [ ] Refactor server.py (>700 lignes) → routes/models/services
- [ ] Bannière de confiance / témoignages sur home + abonnement (conversion)
- [ ] Comptes réseaux sociaux + backlinks
- [ ] Newsletter via Resend

## 3rd Party Integrations
- **Stripe** : LIVE key configurée (env var STRIPE_API_KEY), invoice + Link activés
- **Resend** : Placeholder `re_placeholder_key` (non utilisé, Stripe suffit pour reçus)
- **OpenAI GPT-4o** : via Emergent LLM Key (génération de prières personnelles)
- **Google Analytics 4** : G-LB6ZPMWW1H
- **Google Search Console** : validé via TXT DNS
- **Bing Webmaster Tools** : importé depuis GSC

## Files of reference
- `/app/backend/server.py` — FastAPI, Stripe, Auth, Sitemap XML endpoint
- `/app/backend/scripts/generate_sitemap.py` — régénération sitemap statique
- `/app/backend/scripts/restore_prayers.py` — restauration DB
- `/app/backend/data/prayers_backup.json` — backup complet
- `/app/frontend/public/sitemap.xml` — sitemap statique (119 URLs)
- `/app/frontend/public/index.html` — GA4 tag intégré
- `/app/frontend/public/robots.txt` + `llms.txt`
- `/app/frontend/src/hooks/useSEO.js`
- `/app/frontend/src/pages/PrayerPage.jsx`
- `/app/frontend/src/components/EmailImage.jsx`

## Key API Endpoints
- `GET /api/prayers/by-slug/:slug`
- `GET /api/sitemap.xml` (dynamique, source de vérité)
- `POST /api/stripe/create-checkout-session`
- `POST /api/stripe/webhook`

## Test Credentials
- Admin : `admin@sanctuaire.fr` / `adminpass123`

## Notes importantes
- Le sitemap statique `/sitemap.xml` doit être régénéré après ajout/modif de prières :
  `python /app/backend/scripts/generate_sitemap.py` puis redéploiement
- Le sitemap dynamique `/api/sitemap.xml` reste disponible et à jour automatiquement
- Pour tester en preview : REACT_APP_BACKEND_URL du .env
- Production ≠ Preview : les changements de code nécessitent un redéploiement manuel via Emergent
