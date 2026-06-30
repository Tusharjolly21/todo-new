/**
 * Original flat security illustration (devices + padlock + warnings) for the
 * password-reset pane. First-party asset — swap for a licensed unDraw scene if
 * an exact look is preferred.
 */

const BRAND = "#171717";
const INK = "#3f4a3c";
const SAGE = "#cdd8c6";
const SAGE_SOFT = "#e4ebe0";
const AMBER = "#f3c14b";
const NEUTRAL = "#e7ddd6";

export function SecurityIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 320"
      fill="none"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="230" cy="292" rx="180" ry="18" fill={SAGE_SOFT} />

      {/* question-mark tags */}
      {[176, 212, 248, 284].map((x) => (
        <g key={x}>
          <rect x={x} y="36" width="26" height="34" rx="7" fill={SAGE} />
          <text
            x={x + 13}
            y="59"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fill="#fff"
          >
            ?
          </text>
        </g>
      ))}

      {/* monitor */}
      <rect
        x="168"
        y="92"
        width="140"
        height="104"
        rx="10"
        fill="#fff"
        stroke={SAGE}
        strokeWidth="4"
      />
      <rect x="224" y="196" width="28" height="20" fill={SAGE} />
      <rect x="206" y="214" width="64" height="8" rx="4" fill={INK} />

      {/* padlock */}
      <rect x="208" y="120" width="60" height="50" rx="10" fill={AMBER} />
      <path
        d="M220 120v-10a18 18 0 0136 0v10"
        stroke={INK}
        strokeWidth="6"
        fill="none"
      />
      <circle cx="238" cy="142" r="7" fill={INK} />
      <rect x="235" y="146" width="6" height="14" rx="3" fill={INK} />

      {/* laptop (left) */}
      <g>
        <rect x="74" y="196" width="104" height="64" rx="8" fill={INK} />
        <rect x="84" y="206" width="84" height="44" rx="4" fill="#fff" />
        <path d="M62 260h128l8 14H54z" fill={SAGE} />
      </g>

      {/* tablet (right) */}
      <rect
        x="300"
        y="206"
        width="78"
        height="58"
        rx="8"
        fill={INK}
        transform="rotate(8 339 235)"
      />
      <rect
        x="310"
        y="214"
        width="58"
        height="42"
        rx="3"
        fill="#fff"
        transform="rotate(8 339 235)"
      />

      {/* phone with alert */}
      <rect
        x="386"
        y="150"
        width="44"
        height="78"
        rx="9"
        fill="#fff"
        stroke={AMBER}
        strokeWidth="4"
      />
      <rect x="398" y="172" width="20" height="20" rx="5" fill={BRAND} />
      <rect x="406" y="176" width="4" height="9" rx="2" fill="#fff" />
      <circle cx="408" cy="188" r="2.4" fill="#fff" />

      {/* warning triangle */}
      <path d="M70 158l34 56H36z" fill={AMBER} />
      <rect x="66" y="176" width="8" height="20" rx="4" fill={INK} />
      <circle cx="70" cy="203" r="4" fill={INK} />

      {/* small spark */}
      <path d="M150 96l5 12 12 5-12 5-5 12-5-12-12-5 12-5z" fill={NEUTRAL} />
    </svg>
  );
}
