"""
Generate a static sitemap.xml file for the frontend.

Run this whenever prayers are added/removed/renamed:
    python /app/backend/scripts/generate_sitemap.py

This fetches the dynamic sitemap from the backend API and saves it as
a static file at /app/frontend/public/sitemap.xml so that search engines
(Google, Bing) can access it at https://<domain>/sitemap.xml with proper
XML content-type.
"""
import sys
import urllib.request
from pathlib import Path

BACKEND_URL = "http://localhost:8001/api/sitemap.xml"
OUTPUT_PATH = Path("/app/frontend/public/sitemap.xml")


def main():
    try:
        with urllib.request.urlopen(BACKEND_URL, timeout=30) as resp:
            xml = resp.read().decode("utf-8")
    except Exception as e:
        print(f"[ERROR] Failed to fetch sitemap from {BACKEND_URL}: {e}")
        sys.exit(1)

    if "<urlset" not in xml:
        print("[ERROR] Response does not look like a valid sitemap XML")
        sys.exit(1)

    OUTPUT_PATH.write_text(xml, encoding="utf-8")
    url_count = xml.count("<loc>")
    print(f"[OK] Sitemap written to {OUTPUT_PATH} ({url_count} URLs)")


if __name__ == "__main__":
    main()
