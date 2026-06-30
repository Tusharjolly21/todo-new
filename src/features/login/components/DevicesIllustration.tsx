/**
 * Original flat illustration of the app across devices for the login pane.
 * First-party asset — swap for a licensed unDraw scene if preferred.
 */

const BRAND = "#171717";
const INK = "#3f4a3c";
const SAGE = "#cdd8c6";
const SAGE_SOFT = "#e4ebe0";
const AMBER = "#f3c14b";

function Mark({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={s} height={s} rx={s * 0.24} fill={BRAND} />
      <path
        d={`M${s * 0.24} ${s * 0.5}l${s * 0.16} ${s * 0.16} ${s * 0.36}-${s * 0.4}`}
        stroke="#fff"
        strokeWidth={s * 0.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  );
}

export function DevicesIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 460 320"
      fill="none"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="230" cy="290" rx="190" ry="18" fill={SAGE_SOFT} />

      {/* amber swoosh */}
      <path
        d="M70 250c70-70 150 40 230-30s120-60 90 10"
        stroke={AMBER}
        strokeWidth="26"
        strokeLinecap="round"
        opacity="0.7"
        fill="none"
      />

      {/* monitor */}
      <rect
        x="170"
        y="96"
        width="150"
        height="108"
        rx="10"
        fill="#fff"
        stroke={SAGE}
        strokeWidth="4"
      />
      <rect x="228" y="204" width="34" height="20" fill={SAGE} />
      <rect x="208" y="222" width="74" height="8" rx="4" fill={INK} />
      <Mark x={222} y={120} s={46} />

      {/* laptop */}
      <rect x="80" y="200" width="108" height="62" rx="7" fill={INK} />
      <rect x="90" y="208" width="88" height="46" rx="3" fill="#fff" />
      <Mark x={118} y={216} s={30} />
      <path d="M70 262h128l10 12H60z" fill={SAGE} />

      {/* tablet */}
      <rect
        x="306"
        y="206"
        width="80"
        height="58"
        rx="8"
        fill={INK}
        transform="rotate(7 346 235)"
      />
      <rect
        x="316"
        y="214"
        width="60"
        height="42"
        rx="3"
        fill="#fff"
        transform="rotate(7 346 235)"
      />
      <g transform="rotate(7 346 235)">
        <Mark x={331} y={222} s={26} />
      </g>

      {/* phone */}
      <rect
        x="392"
        y="150"
        width="46"
        height="80"
        rx="9"
        fill="#fff"
        stroke={AMBER}
        strokeWidth="4"
      />
      <Mark x={404} y={172} s={22} />
    </svg>
  );
}
