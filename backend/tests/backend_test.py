"""Backend API tests for Sanctuaire Sacré."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://spirit-shield-1.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

DONOR_EMAIL = "testuser1@example.com"
DONOR_PASS = "testpass123"


@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def donor_token(s):
    r = s.post(f"{API}/auth/login", json={"email": DONOR_EMAIL, "password": DONOR_PASS})
    if r.status_code != 200:
        pytest.skip(f"Donor login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def new_user(s):
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "secret123", "name": "Test User"})
    assert r.status_code == 200, r.text
    data = r.json()
    return {"email": email, "token": data["token"], "user": data["user"]}


# --------- Health ---------
def test_health(s):
    r = s.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# --------- Categories ---------
def test_categories(s):
    r = s.get(f"{API}/categories")
    assert r.status_code == 200
    cats = r.json()
    slugs = sorted([c["slug"] for c in cats])
    assert slugs == ["exorcisme", "protection", "soins"]


# --------- Prayers ---------
def test_prayers_anonymous_locked(s):
    r = s.get(f"{API}/prayers")
    assert r.status_code == 200
    prayers = r.json()
    assert len(prayers) == 12, f"Expected 12, got {len(prayers)}"
    premium = [p for p in prayers if p["is_premium"]]
    assert len(premium) == 6
    for p in premium:
        assert p["locked"] is True
        assert p["body"] == ""
    for p in prayers:
        if not p["is_premium"]:
            assert p["locked"] is False
            assert len(p["body"]) > 0


def test_prayers_non_donor_locked(s, new_user):
    r = s.get(f"{API}/prayers", headers={"Authorization": f"Bearer {new_user['token']}"})
    assert r.status_code == 200
    premium = [p for p in r.json() if p["is_premium"]]
    for p in premium:
        assert p["locked"] is True
        assert p["body"] == ""


def test_prayers_donor_unlocked(s, donor_token):
    r = s.get(f"{API}/prayers", headers={"Authorization": f"Bearer {donor_token}"})
    assert r.status_code == 200
    prayers = r.json()
    for p in prayers:
        assert p["locked"] is False
        assert len(p["body"]) > 0


# --------- Auth ---------
def test_register_returns_token_and_non_donor(new_user):
    assert new_user["user"]["is_donor"] is False
    assert isinstance(new_user["token"], str) and len(new_user["token"]) > 10


def test_register_duplicate(s, new_user):
    r = s.post(f"{API}/auth/register", json={"email": new_user["email"], "password": "secret123", "name": "Dup"})
    assert r.status_code == 400


def test_login_donor(s):
    r = s.post(f"{API}/auth/login", json={"email": DONOR_EMAIL, "password": DONOR_PASS})
    assert r.status_code == 200
    assert r.json()["user"]["is_donor"] is True


def test_login_bad_credentials(s):
    r = s.post(f"{API}/auth/login", json={"email": DONOR_EMAIL, "password": "wrong"})
    assert r.status_code == 401


def test_auth_me(s, donor_token):
    r = s.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {donor_token}"})
    assert r.status_code == 200
    assert r.json()["email"] == DONOR_EMAIL


def test_auth_me_no_token(s):
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


# --------- Prayer Requests ---------
def test_prayer_request_anonymous(s):
    r = s.post(f"{API}/prayer-requests", json={
        "name": "Anon Test", "email": "anon@example.com",
        "category": "soins", "intention": "Test intention"
    })
    assert r.status_code == 200, r.text
    assert "id" in r.json()


def test_prayer_requests_mine_requires_auth(s):
    r = s.get(f"{API}/prayer-requests/mine")
    assert r.status_code == 401


def test_prayer_requests_mine_with_auth(s, new_user):
    headers = {"Authorization": f"Bearer {new_user['token']}"}
    cr = s.post(f"{API}/prayer-requests", json={
        "name": "Me", "email": new_user["email"],
        "category": "protection", "intention": "Mon intention"
    }, headers=headers)
    assert cr.status_code == 200
    r = s.get(f"{API}/prayer-requests/mine", headers=headers)
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1
    assert any(i["intention"] == "Mon intention" for i in items)


# --------- AI Prayer Generation ---------
def test_ai_generate_requires_auth(s):
    r = s.post(f"{API}/ai/generate-prayer", json={"intention": "paix", "category": "soins", "tone": "doux"})
    assert r.status_code == 401


def test_ai_generate_non_donor_forbidden(s, new_user):
    r = s.post(f"{API}/ai/generate-prayer",
               json={"intention": "paix", "category": "soins", "tone": "doux"},
               headers={"Authorization": f"Bearer {new_user['token']}"})
    assert r.status_code == 403


def test_ai_generate_donor_success(s, donor_token):
    r = s.post(f"{API}/ai/generate-prayer",
               json={"intention": "paix intérieure et guérison", "category": "soins", "tone": "doux"},
               headers={"Authorization": f"Bearer {donor_token}"}, timeout=90)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "prayer" in data and len(data["prayer"]) > 50
    assert data["category"] == "soins"


def test_ai_my_prayers(s, donor_token):
    r = s.get(f"{API}/ai/my-prayers", headers={"Authorization": f"Bearer {donor_token}"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


# --------- Donations ---------
def test_donation_packages(s):
    r = s.get(f"{API}/donations/packages")
    assert r.status_code == 200
    pkgs = r.json()
    ids = {p["id"]: p for p in pkgs}
    assert set(ids.keys()) == {"lueur", "cierge", "sanctuaire", "gardien"}
    assert ids["lueur"]["amount"] == 7.0
    assert ids["cierge"]["amount"] == 21.0
    assert ids["sanctuaire"]["amount"] == 49.0
    assert ids["gardien"]["amount"] == 108.0


def test_donation_checkout_and_status(s, donor_token):
    r = s.post(f"{API}/donations/checkout",
               json={"package_id": "cierge", "origin_url": BASE_URL},
               headers={"Authorization": f"Bearer {donor_token}"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "url" in data and data["url"].startswith("http")
    assert "session_id" in data
    session_id = data["session_id"]

    st = s.get(f"{API}/donations/status/{session_id}")
    assert st.status_code == 200
    sd = st.json()
    assert sd["package_id"] == "cierge"
    assert sd["amount"] == 21.0
    assert sd["payment_status"] in ("pending", "unpaid", "open", "paid")


def test_donation_checkout_invalid_package(s):
    r = s.post(f"{API}/donations/checkout",
               json={"package_id": "invalid", "origin_url": BASE_URL})
    assert r.status_code == 400


# --------- Testimonies ---------
def test_testimonies(s):
    r = s.get(f"{API}/testimonies")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list) and len(items) >= 1
    assert "name" in items[0] and "text" in items[0]
