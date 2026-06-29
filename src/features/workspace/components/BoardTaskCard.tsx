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
        "group relative flex flex-col rounded-xl border border-neutral-200/80 bg-white p-3.5 shadow-sm hover:border-neutral-300 hover:shadow-md transition duration-200 ease-in-out cursor-pointer select-none",
        completing
          ? "scale-95 opacity-0 max-h-0 py-0 overflow-hidden"
          : "scale-100 opacity-100",
      )}
    >
      <div className="flex items-start gap-2.5">
        {/* Circle checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={completing}
          onClick={complete}
          style={{ borderColor: color, color }}
          className={cn(
            "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition",
            completing ? "" : "hover:bg-neutral-50",
          )}
        >
          {completing ? (
            <span
              className="flex h-full w-full items-center justify-center rounded-full bg-current"
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

        {/* Task details */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "text-sm font-semibold text-[#202020] leading-snug break-words transition",
              completing && "text-neutral-400 line-through",
            )}
          >
            {task.title}
          </h4>
          {task.description && (
            <p
              className={cn(
                "mt-1 text-xs text-neutral-500 leading-normal line-clamp-2 break-words",
                completing && "line-through",
              )}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info (Due date, Subtasks, Comments, Assignee) */}
      {(dueLabel || totalSubtasks > 0 || commentsCount > 0 || assignee) && (
        <div className="mt-3.5 flex items-center justify-between border-t border-neutral-100 pt-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Due date chip */}
            {due && dueLabel && (
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold"
                style={{ color: DUE_COLOR[due.color] }}
              >
                📅 {dueLabel}
              </span>
            )}

            {/* Subtasks progress */}
            {totalSubtasks > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500">
                📋 {completedSubtasks}/{totalSubtasks}
              </span>
            )}

            {/* Comments count */}
            {commentsCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold text-neutral-500">
                💬 {commentsCount}
              </span>
            )}
          </div>

          {/* Assignee Avatar */}
          {assignee && (
            <div className="shrink-0 scale-90">
              <MemberAvatar member={assignee} size={20} />
            </div>
          )}
        </div>
      )}
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
