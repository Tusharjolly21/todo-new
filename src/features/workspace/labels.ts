/** Available labels and reminder presets for tasks. */

export const LABELS: string[] = [
  "work",
  "personal",
  "urgent",
  "reading",
  "errand",
  "waiting",
];

export interface ReminderOption {
  id: string;
  label: string;
}

export const REMINDER_OPTIONS: ReminderOption[] = [
  { id: "at-time", label: "At time of task" },
  { id: "10m", label: "10 minutes before" },
  { id: "30m", label: "30 minutes before" },
  { id: "1h", label: "1 hour before" },
  { id: "1d", label: "1 day before" },
];

/** Duration presets (minutes) for time-blocked tasks. */
export const DURATIONS: { value: number; label: string }[] = [
  { value: 15, label: "15m" },
  { value: 30, label: "30m" },
  { value: 45, label: "45m" },
  { value: 60, label: "1h" },
  { value: 90, label: "1h 30m" },
  { value: 120, label: "2h" },
];

/** "09:15" + 15 → "09:30" */
export function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}
