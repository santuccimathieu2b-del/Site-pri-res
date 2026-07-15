import React from "react";

/**
 * Anti-bot email displayed as inline SVG.
 * Text glyphs are converted to SVG <text> which most crawlers/bots do not parse
 * for email harvesting. Users can still read (and click-to-copy manually).
 */
export const EmailImage = ({ user = "contact", domain = "mcs-editions.com", label, className = "" }) => {
  const email = `${user}@${domain}`;
  const displayed = label || email;
  return (
    <span
      role="img"
      aria-label="adresse e-mail protégée"
      className={`inline-block align-middle select-none ${className}`}
      data-testid="protected-email"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="240"
        height="22"
        viewBox="0 0 240 22"
        style={{ pointerEvents: "none" }}
      >
        <text
          x="0"
          y="16"
          fontFamily="EB Garamond, serif"
          fontSize="15"
          fill="#D4AF37"
          letterSpacing="0.5"
        >
          {displayed}
        </text>
      </svg>
    </span>
  );
};

export default EmailImage;
