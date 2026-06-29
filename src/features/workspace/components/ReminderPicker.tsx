"use client";

import { useEffect, useRef } from "react";
import { REMINDER_OPTIONS } from "../labels";

interface ReminderPickerProps {
  value: string[];
  onChange: (reminders: string[]) => void;
  onClose: () => void;
}

export function ReminderPicker({
  value,
  onChange,
  onClose,
}: ReminderPickerProps) {
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

  function toggle(id: string) {
    onChange(
      value.includes(id) ? value.filter((r) => r !== id) : [...value, id],
    );
  }

  return (
    <div
      ref={ref}
      className="w-60 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1 shadow-2xl animate-pop-in"
    >
      {REMINDER_OPTIONS.map((opt) => {
        const checked = value.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            <span className="text-neutral-500">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="12"
                  cy="13"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 10v3l2 2M5 5l3-2M19 5l-3-2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="flex-1 text-left text-[#202020]">{opt.label}</span>
            {checked && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M5 12.5l4.5 4.5L19 7"
                  stroke="#dc4c3e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
