"use client";

import { useEffect, useRef } from "react";
import { PRIORITIES, PRIORITY_META } from "../priority";
import type { Priority } from "../types";
import { PriorityFlag } from "./PriorityFlag";

interface PriorityPickerProps {
  value: Priority;
  onSelect: (priority: Priority) => void;
  onClose: () => void;
}

export function PriorityPicker({
  value,
  onSelect,
  onClose,
}: PriorityPickerProps) {
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

  return (
    <div
      ref={ref}
      className="w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-2xl animate-pop-in"
    >
      {PRIORITIES.map((p) => {
        const meta = PRIORITY_META[p];
        return (
          <button
            key={p}
            onClick={() => {
              onSelect(p);
              onClose();
            }}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            <PriorityFlag color={meta.color} filled={p !== 4} />
            <span className="flex-1 text-left text-[#202020]">
              {meta.label}
            </span>
            {value === p && <CheckIcon />}
          </button>
        );
      })}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="#dc4c3e"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
