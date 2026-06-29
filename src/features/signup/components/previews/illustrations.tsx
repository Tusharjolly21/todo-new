/**
 * Original flat illustrations in the unDraw style (single brand accent + soft
 * neutrals) for the onboarding preview panes. These are first-party assets —
 * swap in licensed unDraw SVGs here if exact scenes are preferred.
 */

const BRAND = "#dc4c3e";
const BRAND_SOFT = "#f6b8af";
const INK = "#2b2b2b";
const SKIN = "#f4c9a8";
const NEUTRAL = "#e7ddd6";

type IllustrationProps = { className?: string };

function Frame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

/** Step 1 — a person setting up their profile card. */
export function ProfileIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      <ellipse cx="200" cy="262" rx="150" ry="16" fill={NEUTRAL} />
      {/* profile card */}
      <rect
        x="120"
        y="70"
        width="160"
        height="150"
        rx="14"
        fill="#fff"
        stroke={NEUTRAL}
        strokeWidth="3"
      />
      <circle cx="200" cy="118" r="26" fill={BRAND_SOFT} />
      <circle cx="200" cy="110" r="9" fill={SKIN} />
      <path d="M182 134c2-10 9-15 18-15s16 5 18 15z" fill={INK} />
      <rect x="150" y="158" width="100" height="9" rx="4.5" fill={NEUTRAL} />
      <rect x="166" y="176" width="68" height="8" rx="4" fill={NEUTRAL} />
      <rect x="150" y="196" width="100" height="12" rx="6" fill={BRAND} />
      {/* floating check */}
      <circle cx="288" cy="78" r="20" fill={BRAND} />
      <path
        d="M279 78l6 6 12-13"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Frame>
  );
}

/** Step 2 — customizing settings with toggles and gears. */
export function CustomizeIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      <ellipse cx="200" cy="262" rx="150" ry="16" fill={NEUTRAL} />
      <rect
        x="110"
        y="84"
        width="180"
        height="120"
        rx="14"
        fill="#fff"
        stroke={NEUTRAL}
        strokeWidth="3"
      />
      {[112, 144, 176].map((y, i) => (
        <g key={y}>
          <rect x="128" y={y} width="78" height="10" rx="5" fill={NEUTRAL} />
          <rect
            x="234"
            y={y - 4}
            width="36"
            height="18"
            rx="9"
            fill={i === 1 ? BRAND : NEUTRAL}
          />
          <circle cx={i === 1 ? 261 : 243} cy={y + 5} r="7" fill="#fff" />
        </g>
      ))}
      {/* gear */}
      <g transform="translate(286 70)">
        <circle r="22" fill={BRAND} />
        <circle r="8" fill="#fff" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect
            key={a}
            x="-3"
            y="-26"
            width="6"
            height="9"
            rx="2"
            fill={BRAND}
            transform={`rotate(${a})`}
          />
        ))}
      </g>
    </Frame>
  );
}

/** Step 3 — a small team / shared workspace. */
export function TeamIllustration({ className }: IllustrationProps) {
  const people = [
    { x: 140, c: BRAND },
    { x: 200, c: INK },
    { x: 260, c: BRAND_SOFT },
  ];
  return (
    <Frame className={className}>
      <ellipse cx="200" cy="262" rx="150" ry="16" fill={NEUTRAL} />
      <rect
        x="120"
        y="96"
        width="160"
        height="96"
        rx="12"
        fill="#fff"
        stroke={NEUTRAL}
        strokeWidth="3"
      />
      {people.map((p, i) => (
        <g key={i}>
          <rect
            x={p.x - 30}
            y="150"
            width="60"
            height="60"
            rx="20"
            fill={p.c}
          />
          <circle cx={p.x} cy="138" r="18" fill={SKIN} />
          <circle cx={p.x} cy="130" r="8" fill={INK} />
        </g>
      ))}
      <rect x="150" y="118" width="100" height="10" rx="5" fill={NEUTRAL} />
    </Frame>
  );
}

/** Step 4 — inviting teammates by email. */
export function InviteIllustration({ className }: IllustrationProps) {
  return (
    <Frame className={className}>
      <ellipse cx="200" cy="262" rx="150" ry="16" fill={NEUTRAL} />
      {/* envelope */}
      <rect
        x="116"
        y="110"
        width="168"
        height="110"
        rx="12"
        fill="#fff"
        stroke={NEUTRAL}
        strokeWidth="3"
      />
      <path
        d="M116 122l84 58 84-58"
        fill="none"
        stroke={BRAND}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* paper plane */}
      <g transform="translate(250 60)">
        <path d="M0 24L48 0 34 50 22 34z" fill={BRAND} />
        <path d="M22 34L34 50 18 40z" fill={BRAND_SOFT} />
      </g>
      {/* plus badge */}
      <circle cx="132" cy="92" r="18" fill={BRAND} />
      <path
        d="M132 84v16M124 92h16"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </Frame>
  );
}
