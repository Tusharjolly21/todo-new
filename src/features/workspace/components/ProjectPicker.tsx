"use client";

import { useEffect, useRef, useState } from "react";
import { useTasks } from "../state";
import { type ProjectRef } from "../types";

interface ProjectPickerProps {
  value: string;
  onSelect: (projectId: string) => void;
  onClose: () => void;
}

const GROUP_LABEL: Record<ProjectRef["group"], string | null> = {
  favorites: null,
  my: "My Projects",
  team: "Team",
};

/** Destination picker for the add-task footer — searchable, grouped. */
export function ProjectPicker({
  value,
  onSelect,
  onClose,
}: ProjectPickerProps) {
  const { state } = useTasks();
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
  const filtered = state.projects.filter((p) =>
    p.name.toLowerCase().includes(q),
  );

  let lastGroup: ProjectRef["group"] | null = null;

  return (
    <div
      ref={ref}
      className="w-72 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl animate-pop-in"
    >
      <div className="border-b border-neutral-100 p-2.5">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a project name"
          className="w-full rounded-md px-2 py-1.5 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>

      <ul className="max-h-72 overflow-y-auto py-1">
        {filtered.map((p) => {
          const header =
            p.group !== lastGroup && GROUP_LABEL[p.group] ? (
              <li
                key={`${p.group}-h`}
                className="flex items-center gap-2 px-3 pb-0.5 pt-2 text-xs font-semibold text-neutral-500"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded bg-[#84cc16] text-[9px] font-bold text-white">
                  B
                </span>
                {GROUP_LABEL[p.group]}
              </li>
            ) : null;
          lastGroup = p.group;

          return (
            <div key={p.id}>
              {header}
              <li>
                <button
                  onClick={() => {
                    onSelect(p.id);
                    onClose();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-neutral-100"
                >
                  <ProjectGlyph project={p} />
                  <span className="flex-1 text-left text-[#202020]">
                    {p.name}
                    {p.emoji ? ` ${p.emoji}` : ""}
                  </span>
                  {value === p.id && <CheckIcon />}
                </button>
              </li>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-neutral-400">
            No projects found
          </li>
        )}
      </ul>
    </div>
  );
}

export function ProjectGlyph({ project }: { project: ProjectRef }) {
  if (project.icon === "inbox") {
    return (
      <span className="text-neutral-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 13l2-7h12l2 7v5H4v-5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M4 13h5l1 2h4l1-2h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span
      className="text-base font-bold leading-none"
      style={{ color: project.color }}
    >
      #
    </span>
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
