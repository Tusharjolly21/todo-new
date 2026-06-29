/**
 * Shared quick due-date icons (Today / Tomorrow / This weekend / Next week),
 * matching across the date picker and the context-menu Schedule submenu.
 */
export function QuickDateIcon({ kind }: { kind: string }) {
  if (kind === "today")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4"
          y="5"
          width="16"
          height="16"
          rx="3"
          stroke="#16a34a"
          strokeWidth="2"
        />
        <path
          d="M8 3v4M16 3v4M4 10h16"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  if (kind === "tomorrow")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4" stroke="#ea580c" strokeWidth="2" />
        <path
          d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"
          stroke="#ea580c"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  if (kind === "weekend")
    return (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 12a2 2 0 014 0v2h10v-2a2 2 0 114 0v6h-2v-2H5v2H3z"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M6 12V9a2 2 0 012-2h8a2 2 0 012 2v3"
          stroke="#3b82f6"
          strokeWidth="2"
        />
      </svg>
    );
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="#7c3aed"
        strokeWidth="2"
      />
      <path
        d="M9 12h6M13 9l3 3-3 3"
        stroke="#7c3aed"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
