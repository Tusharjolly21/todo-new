"use client";

import { useEffect, useRef, useState } from "react";
import { LABELS } from "../labels";

interface LabelPickerProps {
  value: string[];
  onChange: (labels: string[]) => void;
  onClose: () => void;
}

export function LabelPicker({ value, onChange, onClose }: LabelPickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");

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

  const q = query.trim().toLowerCase();
  const filtered = LABELS.filter((l) => l.toLowerCase().includes(q));

  function toggle(label: string) {
    onChange(
      value.includes(label)
        ? value.filter((l) => l !== label)
        : [...value, label],
    );
  }

  return (
    <div
      ref={ref}
      className="w-64 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl animate-pop-in"
    >
      <div className="border-b border-neutral-100 p-2.5">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a label"
          className="w-full rounded-md px-2 py-1.5 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      <ul className="max-h-64 overflow-y-auto py-1">
        {filtered.map((label) => {
          const checked = value.includes(label);
          return (
            <li key={label}>
              <button
                onClick={() => toggle(label)}
                className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-neutral-100"
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    checked
                      ? "border-brand bg-brand text-white"
                      : "border-neutral-300"
                  }`}
                >
                  {checked && (
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M5 12.5l4.5 4.5L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="text-neutral-400">@</span>
                <span className="flex-1 text-left text-[#202020]">{label}</span>
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-neutral-400">
            No labels found
          </li>
        )}
      </ul>
    </div>
  );
}
