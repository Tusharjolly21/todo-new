import type { Priority } from "./types";

/** Single source of truth for priority colour + label, shared across the UI. */
export const PRIORITY_META: Record<Priority, { color: string; label: string }> =
  {
    1: { color: "#dc4c3e", label: "Priority 1" },
    2: { color: "#f59e0b", label: "Priority 2" },
    3: { color: "#3b82f6", label: "Priority 3" },
    4: { color: "#9ca3af", label: "Priority 4" },
  };

export const PRIORITIES: Priority[] = [1, 2, 3, 4];
