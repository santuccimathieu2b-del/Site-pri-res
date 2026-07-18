import { useEffect } from "react";

const SITE_URL = "https://prieres-soins-delivrance.fr";
const SITE_NAME = "Prières · Soins · Délivrance";
const DEFAULT_IMAGE = `${SITE_URL}/og-cover.jpg`;

function ensureMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => {
      if (k !== "content") el.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  if (attrs.content !== undefined) el.setAttribute("content", attrs.content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description, image, path = "", keywords, jsonLd }) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description || "Bibliothèque de prières traditionnelles pour la santé, la protection, la délivrance et la paix intérieure. Textes rares et exorcismes conservés avec soin.";
    const url = `${SITE_URL}${path}`;
    const img = image || DEFAULT_IMAGE;

    document.title = fullTitle;

    ensureMeta('meta[name="description"]', { name: "description", content: desc });
    if (keywords) ensureMeta('meta[name="keywords"]', { name: "keywords", content: keywords });

    // Open Graph
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: fullTitle });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: desc });
    ensureMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: url });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: img });
    ensureMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    ensureMeta('meta[property="og:locale"]', { property: "og:locale", content: "fr_FR" });

    // Twitter
    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title", content: fullTitle });
    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description", content: desc });
    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image", content: img });

    // Canonical
    setLink("canonical", url);

    // Robots
    ensureMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-image-preview:large" });

    // JSON-LD structured data
    let script = document.getElementById("jsonld-page");
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.id = "jsonld-page";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, image, path, keywords, JSON.stringify(jsonLd || null)]);
}

export const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MCS-Éditions",
  legalName: "MCS-Éditions SASU",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "200 rue de la Croix-Nivert",
    addressLocality: "Paris",
    postalCode: "75015",
    addressCountry: "FR",
  },
  vatID: "FR60995128642",
  taxID: "99512864200015",
};

export { SITE_URL, SITE_NAME };
