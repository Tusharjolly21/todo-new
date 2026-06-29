"use client";

import { useEffect, useRef, useState } from "react";
import { MEMBERS } from "../members";
import { MemberAvatar } from "./MemberAvatar";

interface AssigneePickerProps {
  value: string | null;
  onSelect: (memberId: string | null) => void;
  onClose: () => void;
}

export function AssigneePicker({
  value,
  onSelect,
  onClose,
}: AssigneePickerProps) {
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
  const filtered = MEMBERS.filter((m) => m.name.toLowerCase().includes(q));

  function pick(id: string | null) {
    onSelect(id);
    onClose();
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
          placeholder="Type a name"
          className="w-full rounded-md px-2 py-1.5 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>
      <ul className="max-h-64 overflow-y-auto py-1">
        <li>
          <button
            onClick={() => pick(null)}
            className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-400">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="flex-1 text-left text-[#202020]">Unassigned</span>
            {value === null && <CheckIcon />}
          </button>
        </li>
        {filtered.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => pick(m.id)}
              className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              <MemberAvatar member={m} />
              <span className="flex-1 text-left text-[#202020]">{m.name}</span>
              {value === m.id && <CheckIcon />}
            </button>
          </li>
        ))}
      </ul>
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
