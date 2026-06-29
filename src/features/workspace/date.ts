import type { DueColor } from "./types";

/**
 * Date helpers for the scheduler. Tasks store a plain ISO date string
 * (`yyyy-mm-dd`) — the value a backend will persist — and the UI derives the
 * human label + colour from it. Pure functions, no side effects.
 */

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function diffInDays(iso: string, base = startOfToday()): number {
  const ms = fromISO(iso).getTime() - base.getTime();
  return Math.round(ms / 86_400_000);
}

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function shortDate(d: Date): string {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export function weekdayLong(d: Date): string {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][d.getDay()];
}

/** Display label + colour for a stored ISO due date, relative to today. */
export function formatDue(
  iso: string,
  base = startOfToday(),
): { label: string; color: DueColor } {
  const diff = diffInDays(iso, base);
  const d = fromISO(iso);
  if (diff < 0) return { label: shortDate(d), color: "red" };
  if (diff === 0) return { label: "Today", color: "green" };
  if (diff === 1) return { label: "Tomorrow", color: "orange" };
  if (diff <= 6) return { label: weekdayLong(d), color: "purple" };
  return { label: shortDate(d), color: "neutral" };
}

export interface QuickOption {
  key: "today" | "tomorrow" | "weekend" | "nextweek";
  label: string;
  /** Right-aligned hint shown in the menu (e.g. "Mon", "Mon 12 Feb"). */
  hint: string;
  iso: string;
}

function nextSaturday(base: Date): Date {
  const days = (6 - base.getDay() + 7) % 7; // 0 when today is Saturday
  return addDays(base, days);
}

function nextMonday(base: Date): Date {
  const days = (1 - base.getDay() + 7) % 7 || 7; // strictly the upcoming Monday
  return addDays(base, days);
}

export function quickOptions(base = startOfToday()): QuickOption[] {
  const today = base;
  const tomorrow = addDays(base, 1);
  const weekend = nextSaturday(base);
  const week = nextMonday(base);
  return [
    {
      key: "today",
      label: "Today",
      hint: WEEKDAY_SHORT[today.getDay()],
      iso: toISO(today),
    },
    {
      key: "tomorrow",
      label: "Tomorrow",
      hint: WEEKDAY_SHORT[tomorrow.getDay()],
      iso: toISO(tomorrow),
    },
    {
      key: "weekend",
      label: "This weekend",
      hint: WEEKDAY_SHORT[weekend.getDay()],
      iso: toISO(weekend),
    },
    {
      key: "nextweek",
      label: "Next week",
      hint: `${WEEKDAY_SHORT[week.getDay()]} ${shortDate(week)}`,
      iso: toISO(week),
    },
  ];
}

/** Days (1-31) plus leading blanks for a month grid, Monday-first. */
export function monthGrid(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // convert Sun-first to Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
