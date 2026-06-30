"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatDue } from "../date";
import { useTasks } from "../state";
import { PRIORITY_META } from "../priority";
import type { DueColor, Task } from "../types";
import { MemberAvatar } from "./MemberAvatar";
import { getMember } from "../members";

interface BoardTaskCardProps {
  task: Task;
}

const DUE_COLOR: Record<DueColor, string> = {
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#7c3aed",
  neutral: "#6b7280",
  red: "#dc4c3e",
};

export function BoardTaskCard({ task }: BoardTaskCardProps) {
  const { dispatch } = useTasks();
  const [completing, setCompleting] = useState(task.completed || false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = PRIORITY_META[task.priority].color;
  const assignee = getMember(task.assigneeId);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function complete(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent opening modal
    if (completing) return;
    setCompleting(true);
    timer.current = setTimeout(
      () => dispatch({ type: "COMPLETE", id: task.id }),
      400,
    );
  }

  const due = task.dueDate ? formatDue(task.dueDate) : null;
  const dueLabel = due
    ? task.dueTime
      ? `${due.label} ${task.dueTime}`
      : due.label
    : null;

  // Count subtasks completeness
  const totalSubtasks = task.subtasks?.length ?? 0;
  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length ?? 0;
  const commentsCount = task.comments?.length ?? 0;

  return (
    <div
      onClick={() => dispatch({ type: "OPEN_TASK", id: task.id })}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-neutral-200/80 bg-white p-4 hover:border-neutral-300 hover:shadow-[0px_8px_24px_rgba(0,0,0,0.05)] transition duration-200 ease-in-out cursor-pointer select-none",
        completing
          ? "scale-95 opacity-0 max-h-0 py-0 overflow-hidden"
          : "scale-100 opacity-100",
      )}
    >
      {/* Top Labels Bar */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.labels.map((lbl) => (
            <span
              key={lbl}
              className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-indigo-50 border border-indigo-100/50 text-indigo-600 uppercase tracking-wider"
            >
              {lbl}
            </span>
          ))}
        </div>
      )}

      {/* Task details */}
      <div className="flex-1 min-w-0">
        <h4
          className={cn(
            "text-sm font-semibold text-[#171717] leading-snug break-words transition",
            completing && "text-neutral-400 line-through",
          )}
        >
          {task.title}
        </h4>
        {task.description && (
          <p
            className={cn(
              "mt-1 text-xs text-neutral-400 leading-normal line-clamp-2 break-words",
              completing && "line-through",
            )}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Footer Info (Checkbox, Due date, Subtasks, Comments, Priority, Assignee) */}
      <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Rounded Square Checkbox in footer */}
          <button
            type="button"
            role="checkbox"
            aria-checked={completing}
            onClick={complete}
            style={{ borderColor: color, color }}
            className={cn(
              "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition",
              completing ? "" : "hover:bg-neutral-50",
            )}
          >
            {completing ? (
              <span
                className="flex h-full w-full items-center justify-center rounded-[3px] bg-current"
                style={{ backgroundColor: color }}
              >
                <CheckIcon />
              </span>
            ) : (
              <span className="opacity-0 group-hover:opacity-40 transition-opacity">
                <CheckIcon />
              </span>
            )}
          </button>

          {/* Due date chip */}
          {due && dueLabel && (
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold"
              style={{ color: DUE_COLOR[due.color] }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {dueLabel}
            </span>
          )}

          {/* Subtasks progress */}
          {totalSubtasks > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-neutral-105 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 border border-neutral-200/40">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              </svg>
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}

          {/* Comments count */}
          {commentsCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-neutral-105 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500 border border-neutral-200/40">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {commentsCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Priority Badge */}
          {task.priority !== 4 && (
            <span
              className="inline-flex items-center rounded border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
              style={{
                color: color,
                borderColor: `${color}25`,
                backgroundColor: `${color}06`,
              }}
            >
              P{task.priority}
            </span>
          )}

          {/* Assignee Avatar */}
          {assignee && (
            <div className="shrink-0 scale-90">
              <MemberAvatar member={assignee} size={20} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="#fff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
