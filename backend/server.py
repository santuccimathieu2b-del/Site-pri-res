"""Soins Protections Délivrances - Backend API for spiritual prayers platform."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
import uuid
import bcrypt
import jwt
import resend
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
from datetime import datetime, timezone, timedelta

from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout, CheckoutSessionRequest
)
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Config
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', '')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
RESEND_API_KEY = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
JWT_SECRET = os.environ.get('JWT_SECRET', 'change-me')
JWT_ALGO = 'HS256'
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', '').lower().strip()

resend.api_key = RESEND_API_KEY

# DB
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# App
app = FastAPI(title="Soins Protections Délivrances API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ----------- Subscription package (single annual offer) -----------
DONATION_PACKAGES = {
    "vie": {"amount": 29.0, "currency": "eur", "label": "Abonnement à vie"},
}
DONOR_THRESHOLD = 29.0  # threshold to grant full access

# ----------- Models -----------
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserPublic(BaseModel):
    id: str
    email: EmailStr
    name: str
    is_donor: bool
    created_at: str

class PrayerCategory(BaseModel):
    id: str
    slug: str
    name: str
    description: str
    icon: str

class Prayer(BaseModel):
    id: str
    title: str
    category_slug: Literal["soins", "protection", "exorcisme", "aide", "esoterisme", "wicca"]
    excerpt: str
    body: str
    is_premium: bool
    created_at: str

class PrayerRequestCreate(BaseModel):
    name: str
    email: EmailStr
    category: Literal["soins", "protection", "exorcisme", "aide", "esoterisme", "wicca"]
    intention: str

class PrayerRequest(BaseModel):
    id: str
    name: str
    email: EmailStr
    category: str
    intention: str
    user_id: Optional[str] = None
    created_at: str

class AIPrayerRequest(BaseModel):
    intention: str
    category: Literal["soins", "protection", "exorcisme", "aide", "esoterisme", "wicca"]
    tone: Literal["doux", "puissant", "intime"] = "doux"

class CheckoutCreateRequest(BaseModel):
    package_id: str
    origin_url: str

# ----------- Helpers -----------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(days=30),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def to_public_user(doc: dict) -> dict:
    return {
        "id": doc["id"],
        "email": doc["email"],
        "name": doc["name"],
        "is_donor": doc.get("is_donor", False),
        "is_admin": doc.get("is_admin", False),
        "created_at": doc["created_at"],
    }

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentification requise")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        user_id = payload.get("sub")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Jeton invalide")

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
):
    if not credentials:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        return await db.users.find_one({"id": payload.get("sub")}, {"_id": 0})
    except Exception:
        return None

async def require_admin(user=Depends(get_current_user)):
    if not user.get("is_admin"):
        raise HTTPException(403, "Accès réservé aux gardiens de l'espace (admin).")
    return user

async def send_email_async(to: str, subject: str, html: str):
    if not RESEND_API_KEY or RESEND_API_KEY == "re_placeholder_key":
        logger.info(f"[Email mock - aucune clé Resend valide] Pour: {to} - Sujet: {subject}")
        return {"status": "mocked", "to": to}
    try:
        params = {"from": SENDER_EMAIL, "to": [to], "subject": subject, "html": html}
        result = await asyncio.to_thread(resend.Emails.send, params)
        return {"status": "sent", "id": result.get("id")}
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return {"status": "error", "error": str(e)}

# ----------- Routes: Health -----------
@api_router.get("/")
async def root():
    return {"message": "Soins Protections Délivrances API", "status": "ok"}

# ----------- Routes: Auth -----------
@api_router.post("/auth/register")
async def register(payload: UserRegister):
    existing = await db.users.find_one({"email": payload.email.lower()})
    if existing:
        raise HTTPException(400, "Un compte existe déjà avec cet email.")
    user_id = str(uuid.uuid4())
    email_lc = payload.email.lower()
    is_admin = bool(ADMIN_EMAIL and email_lc == ADMIN_EMAIL)
    doc = {
        "id": user_id,
        "email": email_lc,
        "name": payload.name.strip(),
        "password_hash": hash_password(payload.password),
        "is_donor": is_admin,
        "is_admin": is_admin,
        "total_donated": 0.0,
        "created_at": now_iso(),
    }
    await db.users.insert_one(doc)
    token = create_token(user_id)

    # welcome email (async, best-effort)
    asyncio.create_task(send_email_async(
        doc["email"],
        "Bienvenue à Soins Protections Délivrances",
        f"<div style='font-family:Georgia,serif;background:#08090C;color:#F4ECD8;padding:32px;'>"
        f"<h1 style='color:#D4AF37;font-weight:300;'>Bienvenue, {doc['name']}</h1>"
        f"<p>Votre âme rejoint notre cercle de lumière. Que la paix vous accompagne.</p>"
        f"<p style='color:#C8BAA1;'>— Soins Protections Délivrances</p></div>"
    ))
    return {"token": token, "user": to_public_user(doc)}

@api_router.post("/auth/login")
async def login(payload: UserLogin):
    user = await db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Email ou mot de passe incorrect.")
    # Idempotent admin upgrade for the configured admin email
    if ADMIN_EMAIL and user["email"] == ADMIN_EMAIL and not user.get("is_admin"):
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"is_admin": True, "is_donor": True}},
        )
        user["is_admin"] = True
        user["is_donor"] = True
    token = create_token(user["id"])
    return {"token": token, "user": to_public_user(user)}

@api_router.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return to_public_user(user)

# ----------- Routes: Categories & Prayers -----------
CATEGORIES = [
    {
        "id": "cat-soins", "slug": "soins", "name": "Prières de Soins",
        "description": "Pour la guérison du corps, de l'esprit et de l'âme.",
        "icon": "heart-pulse",
    },
    {
        "id": "cat-protection", "slug": "protection", "name": "Prières de Protection",
        "description": "Bouclier sacré contre les énergies négatives et les influences malveillantes.",
        "icon": "shield",
    },
    {
        "id": "cat-exorcisme", "slug": "exorcisme", "name": "Prières d'exorcisme et de délivrance",
        "description": "Libération des entités obscures et purification spirituelle profonde.",
        "icon": "flame",
    },
    {
        "id": "cat-aide", "slug": "aide", "name": "Prières d'aide et de remerciements",
        "description": "Pour appeler le soutien divin dans les moments d'épreuve et rendre grâce pour les bienfaits reçus.",
        "icon": "hand-helping",
    },
    {
        "id": "cat-wicca", "slug": "wicca", "name": "Prières wicca, celtiques et gaéliques",
        "description": "Prières, invocations et pratiques des traditions wicca, celtiques et gaéliques.",
        "icon": "moon",
    },
]

@api_router.get("/categories", response_model=List[PrayerCategory])
async def get_categories():
    return CATEGORIES

@api_router.get("/prayers")
async def list_prayers(
    category: Optional[str] = None,
    user=Depends(get_optional_user),
):
    query = {}
    if category:
        query["category_slug"] = category
    prayers = await db.prayers.find(query, {"_id": 0}).to_list(500)
    is_donor = bool(user and user.get("is_donor"))
    # mask premium body for non-donors
    for p in prayers:
        if p.get("is_premium") and not is_donor:
            p["body"] = ""
            p["locked"] = True
        else:
            p["locked"] = False
        p["slug"] = slugify_title(p.get("title", "")) if p.get("title") else ""
    return prayers

@api_router.get("/prayers/{prayer_id}")
async def get_prayer(prayer_id: str, user=Depends(get_optional_user)):
    prayer = await db.prayers.find_one({"id": prayer_id}, {"_id": 0})
    if not prayer:
        raise HTTPException(404, "Prière introuvable")
    is_donor = bool(user and user.get("is_donor"))
    if prayer.get("is_premium") and not is_donor:
        prayer["body"] = ""
        prayer["locked"] = True
    else:
        prayer["locked"] = False
    prayer["slug"] = slugify_title(prayer.get("title", "")) if prayer.get("title") else ""
    return prayer

# ----------- Slug helpers & routes -----------
def slugify_title(title: str) -> str:
    import unicodedata, re
    if not title:
        return ""
    s = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-zA-Z0-9\s-]", "", s).strip().lower()
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-")[:80]

@api_router.get("/prayers/by-slug/{slug}")
async def get_prayer_by_slug(slug: str, user=Depends(get_optional_user)):
    prayers = await db.prayers.find({}, {"_id": 0}).to_list(500)
    match = next((p for p in prayers if slugify_title(p.get("title", "")) == slug), None)
    if not match:
        raise HTTPException(404, "Prière introuvable")
    is_donor = bool(user and user.get("is_donor"))
    if match.get("is_premium") and not is_donor:
        match["body"] = ""
        match["locked"] = True
    else:
        match["locked"] = False
    match["slug"] = slug
    return match

@api_router.get("/sitemap-data")
async def sitemap_data():
    """Returns machine-readable list of URLs for sitemap generation."""
    prayers = await db.prayers.find({}, {"_id": 0, "id": 1, "title": 1, "category_slug": 1, "created_at": 1}).to_list(500)
    urls = []
    for p in prayers:
        s = slugify_title(p.get("title", ""))
        if s:
            urls.append({
                "loc": f"/priere/{s}",
                "lastmod": p.get("created_at", "")[:10] if p.get("created_at") else "",
                "changefreq": "monthly",
                "priority": 0.7,
            })
    return {"prayers": urls, "total": len(urls)}


# ----------- Sitemap XML (public, no /api prefix would be better but we keep /api for Kubernetes routing) -----------
from fastapi.responses import Response

SITE_DOMAIN = "https://prieres-soins-delivrance.fr"

@api_router.get("/sitemap.xml", include_in_schema=False)
async def sitemap_xml():
    prayers = await db.prayers.find({}, {"_id": 0, "title": 1, "category_slug": 1, "created_at": 1}).to_list(500)
    static_pages = [
        ("", "1.0", "weekly"),
        ("/bibliotheque", "0.9", "weekly"),
        ("/pratique", "0.7", "monthly"),
        ("/abonnement", "0.8", "monthly"),
        ("/temoignages", "0.6", "monthly"),
        ("/apropos", "0.5", "monthly"),
        ("/contact", "0.5", "yearly"),
        ("/mentions-legales", "0.3", "yearly"),
        ("/confidentialite", "0.3", "yearly"),
        ("/cgv", "0.3", "yearly"),
    ]
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, prio, freq in static_pages:
        lines.append(f"<url><loc>{SITE_DOMAIN}{path}</loc><changefreq>{freq}</changefreq><priority>{prio}</priority></url>")
    for p in prayers:
        s = slugify_title(p.get("title", ""))
        if s:
            lastmod = (p.get("created_at") or "")[:10]
            lm = f"<lastmod>{lastmod}</lastmod>" if lastmod else ""
            lines.append(f"<url><loc>{SITE_DOMAIN}/priere/{s}</loc>{lm}<changefreq>monthly</changefreq><priority>0.7</priority></url>")
    lines.append("</urlset>")
    return Response(content="\n".join(lines), media_type="application/xml")


# ----------- Routes: Admin Prayer Management -----------
class PrayerCreate(BaseModel):
    title: str
    category_slug: Literal["soins", "protection", "exorcisme", "aide", "esoterisme", "wicca"]
    excerpt: str
    body: str
    is_premium: bool = False
    pdf_url: Optional[str] = None

class PrayerUpdate(BaseModel):
    title: Optional[str] = None
    category_slug: Optional[Literal["soins", "protection", "exorcisme", "aide", "esoterisme", "wicca"]] = None
    excerpt: Optional[str] = None
    body: Optional[str] = None
    is_premium: Optional[bool] = None
    pdf_url: Optional[str] = None

@api_router.post("/admin/prayers")
async def admin_create_prayer(payload: PrayerCreate, user=Depends(require_admin)):
    doc = {
        "id": str(uuid.uuid4()),
        "title": payload.title.strip(),
        "category_slug": payload.category_slug,
        "excerpt": payload.excerpt.strip(),
        "body": payload.body.strip(),
        "is_premium": payload.is_premium,
        "created_at": now_iso(),
    }
    await db.prayers.insert_one(doc)
    return {**{k: v for k, v in doc.items() if k != "_id"}, "locked": False}

@api_router.put("/admin/prayers/{prayer_id}")
async def admin_update_prayer(prayer_id: str, payload: PrayerUpdate, user=Depends(require_admin)):
    update = {k: v for k, v in payload.model_dump(exclude_unset=True).items() if v is not None}
    if not update:
        raise HTTPException(400, "Aucune modification fournie.")
    for f in ("title", "excerpt", "body"):
        if f in update and isinstance(update[f], str):
            update[f] = update[f].strip()
    result = await db.prayers.update_one({"id": prayer_id}, {"$set": update})
    if result.matched_count == 0:
        raise HTTPException(404, "Prière introuvable")
    doc = await db.prayers.find_one({"id": prayer_id}, {"_id": 0})
    return {**doc, "locked": False}

@api_router.delete("/admin/prayers/{prayer_id}")
async def admin_delete_prayer(prayer_id: str, user=Depends(require_admin)):
    result = await db.prayers.delete_one({"id": prayer_id})
    if result.deleted_count == 0:
        raise HTTPException(404, "Prière introuvable")
    return {"deleted": prayer_id}

# ----------- Routes: Prayer Requests -----------
@api_router.post("/prayer-requests")
async def create_prayer_request(
    payload: PrayerRequestCreate,
    user=Depends(get_optional_user),
):
    req_id = str(uuid.uuid4())
    doc = {
        "id": req_id,
        "name": payload.name.strip(),
        "email": payload.email.lower(),
        "category": payload.category,
        "intention": payload.intention.strip(),
        "user_id": user["id"] if user else None,
        "created_at": now_iso(),
    }
    await db.prayer_requests.insert_one(doc)

    asyncio.create_task(send_email_async(
        doc["email"],
        "Votre demande de prière a été reçue",
        f"<div style='font-family:Georgia,serif;background:#08090C;color:#F4ECD8;padding:32px;'>"
        f"<h1 style='color:#D4AF37;font-weight:300;'>Votre intention est entendue</h1>"
        f"<p>Cher(e) {doc['name']},</p>"
        f"<p>Votre demande de prière pour <em>{doc['category']}</em> a été reçue avec recueillement. "
        f"Nos prières s'élèvent désormais avec votre intention.</p>"
        f"<blockquote style='border-left:2px solid #D4AF37;padding-left:16px;color:#C8BAA1;'>"
        f"{doc['intention']}</blockquote>"
        f"<p style='color:#C8BAA1;'>— Soins Protections Délivrances</p></div>"
    ))

    return {"id": req_id, "message": "Demande reçue. Votre intention est entre nos mains."}

@api_router.get("/prayer-requests/mine")
async def my_requests(user=Depends(get_current_user)):
    items = await db.prayer_requests.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return items

# ----------- Routes: AI Prayer Generation (members + donors only) -----------
@api_router.post("/ai/generate-prayer")
async def generate_prayer(payload: AIPrayerRequest, user=Depends(get_current_user)):
    if not user.get("is_donor"):
        raise HTTPException(403, "Cette fonctionnalité est réservée aux abonnés.")
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "Service IA indisponible.")

    system_msg = (
        "Tu es un guide spirituel non-confessionnel, érudit en traditions mystiques universelles. "
        "Tu composes des prières en français, dans un style sacré, poétique, intemporel, "
        "inspirées des manuscrits anciens. Tu n'utilises pas d'émojis. "
        "Tu réponds UNIQUEMENT par la prière demandée, sans préambule ni explication, "
        "structurée en versets courts, avec une invocation initiale et une bénédiction finale."
    )
    category_label = {"soins": "guérison et soins", "protection": "protection spirituelle", "exorcisme": "libération et exorcisme", "aide": "aide et soutien divin", "esoterisme": "rituel et matériel mystique", "wicca": "wicca, celtique et gaélique"}[payload.category]
    tone_hint = {
        "doux": "Ton apaisant, doux, contemplatif.",
        "puissant": "Ton ferme, résolu, lumineux et puissant.",
        "intime": "Ton intime, personnel, comme une confidence à la Source.",
    }[payload.tone]
    user_msg = (
        f"Compose une prière de {category_label}. {tone_hint}\n"
        f"Intention de la personne : {payload.intention}\n"
        f"Longueur : 8 à 14 versets."
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"prayer-{user['id']}-{uuid.uuid4().hex[:8]}",
        system_message=system_msg,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        result = await chat.send_message(UserMessage(text=user_msg))
        text = result if isinstance(result, str) else getattr(result, "text", str(result))
    except Exception as e:
        logger.error(f"AI generation failed: {e}")
        raise HTTPException(500, "La composition de la prière a échoué.")

    # store
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "category": payload.category,
        "tone": payload.tone,
        "intention": payload.intention,
        "prayer_text": text,
        "created_at": now_iso(),
    }
    await db.ai_prayers.insert_one(doc)
    return {"id": doc["id"], "prayer": text, "category": payload.category, "tone": payload.tone}

@api_router.get("/ai/my-prayers")
async def my_ai_prayers(user=Depends(get_current_user)):
    items = await db.ai_prayers.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return items

# ----------- Routes: Stripe Donations -----------
@api_router.get("/donations/packages")
async def get_packages():
    return [{"id": k, **v} for k, v in DONATION_PACKAGES.items()]

@api_router.post("/donations/checkout")
async def create_checkout(payload: CheckoutCreateRequest, http_request: Request, user=Depends(get_optional_user)):
    import stripe as stripe_sdk
    pkg = DONATION_PACKAGES.get(payload.package_id)
    if not pkg:
        raise HTTPException(400, "Formule inconnue.")
    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/abonnement/merci?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/abonnement"

    host_url = str(http_request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"

    metadata = {
        "source": "sanctuaire_sacre",
        "package_id": payload.package_id,
        "webhook_url": webhook_url,
    }
    if user:
        metadata["user_id"] = user["id"]
        metadata["user_email"] = user["email"]

    stripe_sdk.api_key = STRIPE_API_KEY

    session_params = {
        "payment_method_types": ["card"],
        "line_items": [{
            "price_data": {
                "currency": pkg["currency"],
                "product_data": {
                    "name": "Abonnement — Prières Soins Délivrance",
                    "description": "Accès illimité à l'ensemble de la bibliothèque de prières.",
                },
                "unit_amount": int(float(pkg["amount"]) * 100),
            },
            "quantity": 1,
        }],
        "mode": "payment",
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata": metadata,
        "invoice_creation": {
            "enabled": True,
            "invoice_data": {
                "description": "Abonnement à la bibliothèque de prières prieres-soins-delivrance.fr",
                "metadata": {"package_id": payload.package_id},
                "footer": "MCS-Éditions — SIRET 995 128 642 00015 — TVA FR60995128642",
            },
        },
    }
    if user and user.get("email"):
        session_params["customer_email"] = user["email"]

    session = stripe_sdk.checkout.Session.create(**session_params)

    tx = {
        "id": str(uuid.uuid4()),
        "session_id": session.id,
        "user_id": user["id"] if user else None,
        "user_email": user["email"] if user else None,
        "package_id": payload.package_id,
        "amount": float(pkg["amount"]),
        "currency": pkg["currency"],
        "metadata": metadata,
        "payment_status": "pending",
        "status": "initiated",
        "processed": False,
        "created_at": now_iso(),
    }
    await db.payment_transactions.insert_one(tx)
    return {"url": session.url, "session_id": session.id}

@api_router.get("/donations/status/{session_id}")
async def donation_status(session_id: str):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(404, "Transaction introuvable.")

    if tx.get("processed"):
        return {
            "payment_status": tx["payment_status"],
            "status": tx["status"],
            "amount": tx["amount"],
            "currency": tx["currency"],
            "package_id": tx["package_id"],
        }

    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    try:
        result = await stripe_checkout.get_checkout_status(session_id)
    except Exception as e:
        logger.error(f"Status check failed: {e}")
        raise HTTPException(500, "Vérification impossible.")

    update = {
        "payment_status": result.payment_status,
        "status": result.status,
    }

    if result.payment_status == "paid" and not tx.get("processed"):
        update["processed"] = True
        update["paid_at"] = now_iso()
        # Grant donor status
        user_id = tx.get("user_id")
        if user_id:
            await db.users.update_one(
                {"id": user_id},
                {"$inc": {"total_donated": tx["amount"]}, "$set": {"is_donor": True}}
            )
        # Send thank you email
        email_to = tx.get("user_email") or (tx.get("metadata") or {}).get("user_email")
        if email_to:
            asyncio.create_task(send_email_async(
                email_to,
                "Merci pour votre abonnement",
                f"<div style='font-family:Georgia,serif;background:#08090C;color:#F4ECD8;padding:32px;'>"
                f"<h1 style='color:#D4AF37;font-weight:300;'>Votre lumière éclaire l'Espace</h1>"
                f"<p>Votre abonnement de {tx['amount']} {tx['currency'].upper()} a été activé avec gratitude.</p>"
                f"<p>Tous les contenus du site vous sont désormais ouverts, sans restriction.</p>"
                f"<p style='color:#C8BAA1;'>— Soins Protections Délivrances</p></div>"
            ))

    await db.payment_transactions.update_one({"session_id": session_id}, {"$set": update})
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    return {
        "payment_status": tx["payment_status"],
        "status": tx["status"],
        "amount": tx["amount"],
        "currency": tx["currency"],
        "package_id": tx["package_id"],
    }

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="")
    try:
        event = await stripe_checkout.handle_webhook(body, signature)
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        raise HTTPException(400, "Webhook invalide")

    if event.session_id:
        tx = await db.payment_transactions.find_one({"session_id": event.session_id})
        if tx and not tx.get("processed") and event.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": event.session_id},
                {"$set": {
                    "payment_status": event.payment_status,
                    "status": "completed",
                    "processed": True,
                    "paid_at": now_iso(),
                }},
            )
            user_id = tx.get("user_id")
            if user_id:
                await db.users.update_one(
                    {"id": user_id},
                    {"$inc": {"total_donated": tx["amount"]}, "$set": {"is_donor": True}}
                )
    return {"received": True}

# ----------- Testimonies -----------
TESTIMONIES = []

@api_router.get("/testimonies")
async def get_testimonies():
    return TESTIMONIES

# ----------- Seeding -----------
@api_router.post("/admin/seed")
async def seed():
    """Idempotent seed of prayers."""
    existing = await db.prayers.count_documents({})
    if existing >= 12:
        return {"status": "already_seeded", "count": existing}

    seed_prayers = [
        # Soins
        {"title": "Invocation de la Lumière Guérisseuse", "category_slug": "soins",
         "excerpt": "Pour ouvrir le cœur à la guérison intérieure et apaiser les douleurs anciennes.",
         "body": "Ô Source de toute lumière,\n\nDescends sur ce corps fatigué,\nTraverse ces veines blessées,\nDissous ce qui pèse sur l'âme.\n\nQue chaque souffle devienne baume,\nQue chaque battement devienne prière.\nQue la paix s'installe où régnait la douleur,\nEt que la vie retrouve sa source claire.\n\nJe me confie. Je me dépose. Je guéris.",
         "is_premium": False},
        {"title": "Litanie du Corps Restauré", "category_slug": "soins",
         "excerpt": "Pour la convalescence et la régénération profonde des cellules.",
         "body": "Que mes os retrouvent leur force,\nQue mon sang retrouve son chant,\nQue ma chair se renouvelle.\n\nÔ Présence invisible et bienveillante,\nTisse à nouveau ce qui s'est défait,\nApaise ce qui brûle,\nÉteins ce qui consume.\n\nJe suis vivant. Je suis aimé. Je suis restauré.",
         "is_premium": True},
        {"title": "Oraison du Cœur Brisé", "category_slug": "soins",
         "excerpt": "Pour traverser les deuils et les peines de l'âme.",
         "body": "Sur ce cœur fissuré,\nDépose ta main de soie.\nDans cette nuit du dedans,\nAllume une seule étoile.\n\nJe pleure, et tu m'entends.\nJe tombe, et tu me reçois.\nJe me brise, et tu me recomposes.",
         "is_premium": False},
        {"title": "Bénédiction des Enfants Malades", "category_slug": "soins",
         "excerpt": "Une prière douce pour les âmes innocentes qui souffrent.",
         "body": "Sur cette petite tête, dépose ta paix.\nSur ces petites mains, mets ta force.\nSur ce petit cœur, verse ta tendresse.\n\nQue l'ange du soin veille sur ce sommeil,\nQue la lumière du jour ramène le sourire.",
         "is_premium": True},

        # Protection
        {"title": "Bouclier des Sept Lumières", "category_slug": "protection",
         "excerpt": "Pour ériger un rempart sacré autour de soi et de ses proches.",
         "body": "Que sept lumières m'entourent :\nDevant moi, la clarté.\nDerrière moi, la vigilance.\nÀ ma droite, la force.\nÀ ma gauche, la sagesse.\nAu-dessus de moi, la grâce.\nEn dessous de moi, la stabilité.\nEn moi, la paix.\n\nAucune ombre ne franchira ce cercle.",
         "is_premium": False},
        {"title": "Prière de Scellement du Foyer", "category_slug": "protection",
         "excerpt": "Pour bénir et protéger la maison contre toute énergie malveillante.",
         "body": "Aux quatre coins de cette demeure,\nJe dépose une flamme invisible.\nAux portes, je trace un signe d'or.\nAux fenêtres, je murmure un nom sacré.\n\nQue rien d'impur n'entre ici.\nQue rien d'obscur n'y demeure.\nQue cette maison soit temple et refuge.",
         "is_premium": True},
        {"title": "Invocation contre les Mauvais Regards", "category_slug": "protection",
         "excerpt": "Pour dissiper les jalousies et les intentions néfastes.",
         "body": "Que les yeux qui me veulent du mal\nSe détournent et s'apaisent.\nQue les paroles tissées contre moi\nRetournent à leur source sans m'atteindre.\n\nJe suis enveloppé d'une lumière douce et ferme.\nJe marche dans la paix.",
         "is_premium": False},
        {"title": "Garde des Voyageurs", "category_slug": "protection",
         "excerpt": "Pour les déplacements, les voyages et les chemins incertains.",
         "body": "Que la route s'ouvre devant moi sans embûche.\nQue les vents me soient favorables.\nQue les routes me ramènent à bon port.\n\nJe ne marche pas seul. Une main invisible me guide.",
         "is_premium": True},

        # Exorcisme
        {"title": "Litanie de Libération Légère", "category_slug": "exorcisme",
         "excerpt": "Pour la purification des espaces et des âmes troublées par des présences fines.",
         "body": "Toi qui n'as pas ta place ici,\nRetourne à la lumière qui t'attend.\n\nCe lieu n'est pas le tien.\nCette âme n'est pas la tienne.\nCe corps n'est pas le tien.\n\nPar la force de la Source,\nPar la flamme qui purifie,\nPar le nom qui ne se nomme pas,\nQuitte. Pars. Sois libéré.",
         "is_premium": False},
        {"title": "Grande Oraison de Délivrance", "category_slug": "exorcisme",
         "excerpt": "Rituel sacré pour les âmes captives d'attaches anciennes.",
         "body": "Ô Force des Origines,\nDescends en cet instant,\nTranche les liens invisibles,\nDélie les nœuds anciens.\n\nQue tombent les chaînes,\nQue se brisent les sceaux,\nQue s'ouvrent les cachots de l'âme.\n\nJe te rends ta liberté.\nJe te rends ta lumière.\nJe te rends à toi-même.",
         "is_premium": True},
        {"title": "Purification des Objets", "category_slug": "exorcisme",
         "excerpt": "Pour nettoyer un héritage, un bijou, un meuble chargé d'énergies.",
         "body": "Sur cet objet je pose mes mains.\nJe le lave de toute mémoire pesante.\nJe le rends à sa pureté première.\n\nQue tout ce qui s'y est accroché\nRetourne au néant ou à la lumière.",
         "is_premium": False},
        {"title": "Bannissement des Cauchemars", "category_slug": "exorcisme",
         "excerpt": "Pour les nuits troublées par des présences ou des visions.",
         "body": "Que les nuits redeviennent douces.\nQue les rêves redeviennent purs.\nQue rien ne vienne hanter ce sommeil.\n\nUn ange veille au pied du lit.\nUn ange veille à la tête.\nJe dors. Je suis en paix.",
         "is_premium": True},
    ]

    for p in seed_prayers:
        await db.prayers.insert_one({
            "id": str(uuid.uuid4()),
            **p,
            "created_at": now_iso(),
        })
    return {"status": "seeded", "count": len(seed_prayers)}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # No auto-seed: prayers are managed by admin via /admin/prayers endpoints
    logger.info("Soins Protections Délivrances backend started.")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
