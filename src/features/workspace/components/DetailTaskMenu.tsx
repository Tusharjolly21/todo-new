"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useTasks } from "../state";

interface DetailTaskMenuProps {
  taskId: string;
  onClose: () => void;
}

/**
 * The task detail modal's top-bar "⋯" menu — distinct from the row context
 * menu: it focuses on the whole-task actions (duplicate, share, activity,
 * print, delete) with an "added on" timestamp header.
 */
export function DetailTaskMenu({ taskId, onClose }: DetailTaskMenuProps) {
  const { dispatch } = useTasks();
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

  const added = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const run = (fn: () => void) => {
    fn();
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-40 mt-1 w-64 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-2xl animate-pop-in"
    >
      <p className="px-3 pb-1 pt-1 text-xs text-neutral-400">
        Added on {added} · {time}
      </p>

      <Item
        icon={<DuplicateIcon />}
        onClick={() =>
          run(() => dispatch({ type: "DUPLICATE_TASK", id: taskId }))
        }
      >
        Duplicate
      </Item>
      <Item
        icon={<LinkIcon />}
        shortcut="⇧⌘C"
        onClick={() =>
          run(() => {
            void navigator.clipboard
              ?.writeText(`${location.origin}/app?task=${taskId}`)
              .catch(() => {});
          })
        }
      >
        Copy link to task
      </Item>
      <Item icon={<MailIcon />}>Add comments via email</Item>
      <Item icon={<ActivityIcon />}>View task activity</Item>
      <Item icon={<PrintIcon />} onClick={() => run(() => window.print())}>
        Print
      </Item>

      <div className="my-1 h-px bg-neutral-100" />

      <Item
        icon={<TrashIcon />}
        danger
        shortcut="⌘⌫"
        onClick={() =>
          run(() => dispatch({ type: "REQUEST_DELETE", id: taskId }))
        }
      >
        Delete
      </Item>
    </div>
  );
}

function Item({
  icon,
  children,
  onClick,
  danger,
  shortcut,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  shortcut?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-1.5 text-sm hover:bg-neutral-100 ${
        danger ? "text-brand" : "text-[#202020]"
      }`}
    >
      <span className={danger ? "text-brand" : "text-neutral-500"}>{icon}</span>
      <span className="flex-1 text-left">{children}</span>
      {shortcut && <span className="text-xs text-neutral-400">{shortcut}</span>}
    </button>
  );
}

const ic = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;
function DuplicateIcon() {
  return (
    <svg {...ic} aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15V5a2 2 0 012-2h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg {...ic} aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
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
function TrashIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13h10l1-13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
