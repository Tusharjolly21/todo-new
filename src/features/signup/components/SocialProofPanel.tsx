import type { ReactNode } from "react";

interface Stat {
  value: string;
  label: string;
  icon: ReactNode;
}

const STATS: Stat[] = [
  { value: "30 million+", label: "app downloads", icon: <PeopleIcon /> },
  { value: "15 years+", label: "in business", icon: <TargetIcon /> },
  { value: "2 billion+", label: "tasks completed", icon: <ChecklistIcon /> },
  { value: "1 million+", label: "Pro users", icon: <BadgeIcon /> },
];

/**
 * Right-hand social-proof panel shown beside the signup form on desktop,
 * mirroring Todoist's signup layout. Illustrations are original line-art
 * (no third-party assets embedded).
 */
export function SocialProofPanel() {
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-10">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-24 items-center justify-center">
            {stat.icon}
          </div>
          <p className="mt-3 text-xl font-extrabold text-[#202020]">
            {stat.value}
          </p>
          <p className="text-sm text-neutral-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

const stroke = "#171717";

function PeopleIcon() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" aria-hidden>
      <circle cx="34" cy="22" r="9" stroke={stroke} strokeWidth="2.5" />
      <circle cx="62" cy="22" r="9" stroke={stroke} strokeWidth="2.5" />
      <path
        d="M18 64c0-10 7-17 16-17s16 7 16 17"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M46 64c0-10 7-17 16-17s16 7 16 17"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" aria-hidden>
      <circle cx="42" cy="40" r="26" stroke={stroke} strokeWidth="2.5" />
      <circle cx="42" cy="40" r="14" stroke={stroke} strokeWidth="2.5" />
      <circle cx="42" cy="40" r="3.5" fill={stroke} />
      <path
        d="M42 40l34-24"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M70 12l8 2-2 8"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" aria-hidden>
      {[20, 40, 60].map((y) => (
        <g key={y}>
          <circle cx="26" cy={y} r="7" stroke={stroke} strokeWidth="2.5" />
          <path
            d={`M22.5 ${y}l2.5 2.5 4-5`}
            stroke={stroke}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="40"
            y={y - 3}
            width="40"
            height="5"
            rx="2.5"
            fill={stroke}
            opacity="0.3"
          />
        </g>
      ))}
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="96" height="80" viewBox="0 0 96 80" fill="none" aria-hidden>
      <circle cx="48" cy="34" r="22" stroke={stroke} strokeWidth="2.5" />
      <path
        d="M40 34l6 6 11-12"
        stroke={stroke}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 52l-6 20 18-9 18 9-6-20"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}
