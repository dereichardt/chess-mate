interface AppLogoProps {
  /** Height in px; width scales proportionally from the 44×30 viewBox. */
  size?: number;
  className?: string;
}

/**
 * Chess-Mate brand mark — a king and queen silhouette pair.
 * Uses `currentColor` so it inherits whatever text color the parent sets.
 */
export default function AppLogo({ size = 28, className = '' }: AppLogoProps) {
  const width = Math.round(size * (44 / 30));

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 44 30"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* ── Queen (left, centered at x=10) ─────────────────────────── */}

      {/* Three crown balls */}
      <circle cx="4"  cy="7"   r="2.4" />
      <circle cx="10" cy="4.5" r="2.4" />
      <circle cx="16" cy="7"   r="2.4" />

      {/* Crown band — curves up to meet the balls then closes at the body top */}
      <path d="M2 9 C4 7.8 7 6.7 10 6.7 C13 6.7 16 7.8 18 9 L17.5 12.5 L2.5 12.5 Z" />

      {/* Body */}
      <path d="M2.5 12.5 L4.5 24 L15.5 24 L17.5 12.5 Z" />

      {/* Base */}
      <rect x="1"  y="24" width="18" height="4.5" rx="2" />

      {/* ── King (right, centered at x=34) ─────────────────────────── */}

      {/* Cross — vertical bar */}
      <rect x="32.25" y="1"    width="3.5" height="11" rx="1.75" />
      {/* Cross — horizontal bar */}
      <rect x="28"    y="4"    width="12"  height="3.5" rx="1.75" />

      {/* Collar below cross */}
      <rect x="27"    y="10.5" width="14"  height="2.5" rx="1" />

      {/* Body */}
      <path d="M27.5 13 L29.5 24 L40.5 24 L42.5 13 Z" />

      {/* Base */}
      <rect x="26" y="24" width="18" height="4.5" rx="2" />
    </svg>
  );
}
