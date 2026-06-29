/**
 * Shared priority flag icon — a single source of truth so P1–P4 flags look
 * identical in the list, pickers, context menu and detail panel.
 * Filled (solid colour) for P1–P3, outline for P4.
 */
export function PriorityFlag({
  color,
  filled,
  size = 16,
}: {
  color: string;
  filled: boolean;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill={filled ? color : "none"}
        fillOpacity={filled ? 0.9 : 0}
      />
      <path d="M4 22V15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
