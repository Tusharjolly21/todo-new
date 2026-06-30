"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";

/** Account dropdown opened from the sidebar's user name. */
export function ProfileMenu({
  onClose,
  onSettings,
  onUpgrade,
  onNavigate,
  onResources,
}: {
  onClose: () => void;
  onSettings: () => void;
  onUpgrade: () => void;
  onNavigate: (view: string) => void;
  onResources?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const [completedTodayCount, setCompletedTodayCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("todo_completed_tasks_store");
      const list = saved ? JSON.parse(saved) : [];
      const todayStr = new Date().toISOString().split("T")[0];
      const count = list.filter(
        (t: any) => t.completedAt && t.completedAt.split("T")[0] === todayStr,
      ).length;
      setCompletedTodayCount(count);

      const savedGoal = localStorage.getItem("todo_goal_daily");
      if (savedGoal) setDailyGoal(Number(savedGoal));
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-2xl animate-pop-in select-none text-[#202020]"
    >
      {/* account header */}
      <div
        onClick={() => {
          onSettings();
          onClose();
        }}
        className="flex items-center justify-between px-3 py-2.5 hover:bg-neutral-50 cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d6409f] text-base font-bold text-white shrink-0">
            T
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#202020]">
              Tushar Jolly
            </p>
            <p className="truncate text-xs text-neutral-500 font-semibold">
              {completedTodayCount}/{dailyGoal} tasks
            </p>
          </div>
        </div>
        <span className="text-xs text-neutral-400 font-medium">O then P</span>
      </div>

      <Divider />

      <Item
        icon={<SettingsIcon />}
        shortcut="O then S"
        onClick={() => {
          onSettings();
          onClose();
        }}
      >
        Settings
      </Item>

      <Item
        icon={<AddPeopleIcon />}
        onClick={() => {
          onUpgrade();
          onClose();
        }}
      >
        <span className="flex flex-1 items-center justify-between font-semibold text-neutral-700">
          <span>Add a team</span>
        </span>
      </Item>

      <Divider />

      <Item
        icon={<ActivityIcon />}
        shortcut="G then A"
        onClick={() => {
          onNavigate("reporting");
          onClose();
        }}
      >
        Reporting
      </Item>

      <Item icon={<PrintIcon />} shortcut="⌘ P" onClick={onClose}>
        Print
      </Item>

      <Item
        icon={
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        }
        onClick={onClose}
      >
        What&apos;s new
      </Item>

      <Divider />

      <Item
        icon={<StarIcon />}
        onClick={() => {
          onUpgrade();
          onClose();
        }}
      >
        <span className="text-[#ea580c] font-bold">Try Pro for free</span>
      </Item>

      <Divider />

      <Item icon={<SyncIcon />} onClick={onClose}>
        <span className="flex flex-1 items-center justify-between">
          <span>Sync</span>
          <span className="text-xs text-neutral-400 font-semibold">
            22 minutes ago
          </span>
        </span>
      </Item>

      <Item icon={<LogoutIcon />} onClick={onClose}>
        Log out
      </Item>

      <Divider />

      <div className="px-3 py-1.5 text-[10px] text-neutral-400 font-bold flex items-center gap-1.5">
        <span>v10958</span>
        <span className="h-1 w-1 rounded-full bg-neutral-300" />
        <button
          onClick={onClose}
          className="hover:underline text-neutral-500 font-bold"
        >
          Changelog
        </button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="my-1 h-px bg-neutral-100" />;
}

function Item({
  icon,
  children,
  shortcut,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  shortcut?: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-3 py-1.5 text-sm text-[#202020] hover:bg-neutral-100"
    >
      <span className="text-neutral-500">{icon}</span>
      <span className="flex flex-1 items-center">{children}</span>
      {shortcut && <span className="text-xs text-neutral-400">{shortcut}</span>}
    </button>
  );
}

const ic = {
  width: 17,
  height: 17,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;
function SettingsIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 00-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 00-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 000 2l-2 1.5 2 3.4 2.3-1a7 7 0 001.7 1l.3 2.6h4l.3-2.6a7 7 0 001.7-1l2.3 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AddPeopleIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 19c0-3 2.5-5 6-5s6 2 6 5M18 8v6M21 11h-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M4 13h3l2 5 4-12 2 7h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M6 9V3h12v6M6 18H4v-6a2 2 0 012-2h12a2 2 0 012 2v6h-2M8 14h8v7H8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M20 14a8 8 0 01-10-10 8 8 0 1010 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SyncIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 3v4h-4M6 21v-4h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9.5 9a2.5 2.5 0 013.5-2c1.5.7 1.5 2.3.5 3l-1.5 1v1M12 17h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l-5-5 5-5M5 12h12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-amber-500"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-neutral-400"
    >
      <path
        d="M9 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
