"use client";

import { useState } from "react";

/** Empty "all done" celebration shown when the task list is cleared. */
export function AllDone({
  name,
  type = "inbox",
}: {
  name?: string;
  type?: "inbox" | "today";
}) {
  const isToday = type === "today";
  const hashtag = isToday ? "#TodoistZero" : "#TodoZero";
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(`Sharing my ${hashtag} awesomeness!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center pt-16 text-center select-none animate-fade-up">
      <AllDoneIllustration className="w-[180px]" />
      <h2 className="mt-6 text-lg font-bold text-[#202020]">
        You&apos;re all done for today{name ? `, ${name}` : ""}!
      </h2>
      <p className="mt-2 max-w-xs text-sm text-neutral-500">
        Enjoy the rest of your day and don&apos;t forget to share your {hashtag}{" "}
        awesomeness ↓
      </p>
      <button
        onClick={handleShare}
        aria-live="polite"
        className="mt-3 rounded px-1 text-sm font-bold text-brand transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        {copied ? "Copied to clipboard ✓" : `Share ${hashtag}`}
      </button>
    </div>
  );
}

const SAGE = "#cdd8c6";
const SAGE_DEEP = "#9bb38f";
const AMBER = "#f3c14b";
const BRAND = "#171717";

function AllDoneIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* wings */}
      <path d="M100 70C78 38 44 40 50 78c4 26 30 34 50 30z" fill={AMBER} />
      <path d="M100 70c22-32 56-30 50 8-4 26-30 34-50 30z" fill={AMBER} />
      <ellipse cx="70" cy="70" rx="7" ry="9" fill={SAGE_DEEP} opacity="0.5" />
      <ellipse cx="130" cy="70" rx="7" ry="9" fill={SAGE_DEEP} opacity="0.5" />
      {/* body */}
      <ellipse
        cx="100"
        cy="104"
        rx="20"
        ry="34"
        fill="#fff"
        stroke={SAGE}
        strokeWidth="3"
      />
      <circle cx="92" cy="96" r="3" fill={SAGE_DEEP} />
      <circle cx="108" cy="96" r="3" fill={SAGE_DEEP} />
      <path
        d="M94 106c3 3 9 3 12 0"
        stroke={SAGE_DEEP}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* antennae */}
      <path
        d="M94 72c-4-8-10-10-16-8M106 72c4-8 10-10 16-8"
        stroke={SAGE_DEEP}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* foliage + dots */}
      <path
        d="M60 150c-10-6-14-18-10-30 8 6 12 18 10 30z"
        fill={SAGE_DEEP}
        opacity="0.7"
      />
      <path
        d="M140 150c10-6 14-18 10-30-8 6-12 18-10 30z"
        fill={SAGE_DEEP}
        opacity="0.7"
      />
      <circle cx="56" cy="120" r="3" fill={AMBER} />
      <circle cx="150" cy="116" r="3" fill={BRAND} />
      <circle cx="68" cy="138" r="2.5" fill={BRAND} />
      <circle cx="140" cy="134" r="2.5" fill={AMBER} />
    </svg>
  );
}
