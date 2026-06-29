import { cn } from "@/lib/utils/cn";

/**
 * Line-icon set for the marketing page — replaces the emoji that were
 * previously used as structural icons so rendering is consistent across
 * platforms and themeable via `currentColor`.
 */
export type IconName =
  | "inbox"
  | "download"
  | "code"
  | "chat"
  | "sparkles"
  | "calendar"
  | "calendarUpcoming"
  | "users"
  | "lock"
  | "chart"
  | "laptop"
  | "window"
  | "terminal"
  | "phone"
  | "android"
  | "rocket"
  | "star"
  | "timer"
  | "moon"
  | "zap"
  | "brain"
  | "folder"
  | "flame"
  | "image"
  | "camera"
  | "check"
  | "utensils"
  | "megaphone"
  | "target";

const PATHS: Record<IconName, React.ReactNode> = {
  inbox: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 6.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-5.5A2 2 0 0 0 16.8 5H7.2a2 2 0 0 0-1.7 1.5z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m0 0l-4-4m4 4l4-4" />
      <path d="M5 20h14" />
    </>
  ),
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />,
  chat: <path d="M21 12a8 8 0 0 1-11.7 7.1L4 20.5l1.4-5.3A8 8 0 1 1 21 12z" />,
  sparkles: (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" />
      <path d="M18.5 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </>
  ),
  calendarUpcoming: (
    <>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4M11 13l2 2-2 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6M21 20c0-2.5-1.3-4.3-3.5-5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  chart: <path d="M5 21V10M12 21V4M19 21v-7" />,
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M2 20h20" />
    </>
  ),
  window: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16M9 9v11" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </>
  ),
  phone: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  android: (
    <>
      <rect x="5" y="9" width="14" height="9" rx="2" />
      <path d="M8 9V7.5a4 4 0 0 1 8 0V9M8.5 5.5L7 3.5M15.5 5.5L17 3.5" />
      <circle cx="9.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3 1.6 5 4.6 5 8 0 1.6-.4 3-1 4H8c-.6-1-1-2.4-1-4 0-3.4 2-6.4 5-8z" />
      <circle cx="12" cy="10" r="1.6" />
      <path d="M9 16l-2 4 3-1.5M15 16l2 4-3-1.5" />
    </>
  ),
  star: (
    <path d="M12 4l2.3 5 5.2.5-4 3.5 1.2 5L12 20.5 7.3 18l1.2-5-4-3.5 5.2-.5z" />
  ),
  timer: (
    <>
      <circle cx="12" cy="13" r="7" />
      <path d="M12 13V9M9 3h6M18.5 6.5L17 8" />
    </>
  ),
  moon: <path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z" />,
  zap: <path d="M13 3l-7 9h5l-1 9 7-9h-5l1-9z" />,
  brain: (
    <>
      <path d="M9.5 4a2.5 2.5 0 0 0-2.5 2.5A3 3 0 0 0 5 12a3 3 0 0 0 2 4 2.5 2.5 0 0 0 5 .5V4.5A.5.5 0 0 0 9.5 4z" />
      <path d="M14.5 4a2.5 2.5 0 0 1 2.5 2.5A3 3 0 0 1 19 12a3 3 0 0 1-2 4 2.5 2.5 0 0 1-5 .5" />
    </>
  ),
  folder: (
    <path d="M4 7a2 2 0 0 1 2-2h3l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
  ),
  flame: (
    <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.7 1-3 1-3 .4 1.4 1.4 2 1.4 2C10.5 8 11 5.2 12 3z" />
  ),
  image: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="M5 17l4-4 3 3 3-3 4 4" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7l1.5-2h5L16 7" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  utensils: (
    <path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v6M10 3v6M17 3c-1.5 0-2.5 2-2.5 5s1 4 2.5 4v6" />
  ),
  megaphone: (
    <>
      <path d="M3 11v2l11 4V7L3 11z" />
      <path d="M14 8.5a3 3 0 0 1 0 7M6 13.5V17a2 2 0 0 0 4 0" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export function LandingIcon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {PATHS[name]}
    </svg>
  );
}
