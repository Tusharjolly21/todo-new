"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatDue } from "../date";
import { useTasks } from "../state";
import type { DueColor, Priority, Task } from "../types";
import { DatePicker } from "./DatePicker";
import { TaskContextMenu } from "./TaskContextMenu";

const PRIORITY_COLOR: Record<Priority, string> = {
  1: "#dc4c3e",
  2: "#f59e0b",
  3: "#3b82f6",
  4: "#9ca3af",
};

const DUE_COLOR: Record<DueColor, string> = {
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#7c3aed",
  neutral: "#6b7280",
  red: "#dc4c3e",
};

const COMPLETE_DELAY_MS = 480;

export function TaskItem({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [completing, setCompleting] = useState(task.completed || false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = PRIORITY_COLOR[task.priority];

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function complete() {
    if (completing) return;
    setCompleting(true); // play check + collapse animation
    timer.current = setTimeout(
      () => dispatch({ type: "COMPLETE", id: task.id }),
      COMPLETE_DELAY_MS,
    );
  }

  return (
    <div
      className={cn(
        "transition-all duration-300 ease-in-out",
        completing
          ? "max-h-0 overflow-hidden opacity-0"
          : "max-h-40 opacity-100",
      )}
    >
      <div className="group flex items-start gap-3 border-b border-neutral-100 py-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={completing}
          aria-label="Complete task"
          onClick={complete}
          style={{ borderColor: color, color }}
          className={cn(
            "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-1",
            completing ? "" : "hover:bg-black/[0.03]",
          )}
        >
          {completing ? (
            <span
              className="flex h-full w-full animate-check-pop items-center justify-center rounded-full"
              style={{ backgroundColor: color }}
            >
              <CheckIcon filled />
            </span>
          ) : (
            <CheckIcon className="opacity-0 transition group-hover:opacity-40" />
          )}
        </button>

        <div
          className="min-w-0 flex-1 cursor-pointer"
          onClick={() => dispatch({ type: "OPEN_TASK", id: task.id })}
        >
          <p
            className={cn(
              "text-sm leading-snug text-[#202020] transition",
              completing && "text-neutral-400 line-through",
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p
              className={cn(
                "mt-0.5 text-xs text-neutral-500",
                completing && "line-through",
              )}
            >
              {task.description}
            </p>
          )}
          {task.dueDate && !completing && <DueChip task={task} />}
        </div>

        {/* hover actions */}
        {!completing && (
          <div className="relative flex shrink-0 items-center">
            {/* icon buttons — fade in on hover only */}
            <div
              className={cn(
                "flex items-center gap-0.5 transition",
                menuOpen || dateOpen
                  ? "opacity-100"
                  : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
              )}
            >
              <ActionBtn
                label="Edit"
                onClick={() => dispatch({ type: "OPEN_TASK", id: task.id })}
              >
                <PencilIcon />
              </ActionBtn>
              <ActionBtn
                label="Schedule"
                onClick={() => {
                  setDateOpen((v) => !v);
                  setMenuOpen(false);
                }}
              >
                <CalendarMini />
              </ActionBtn>
              <ActionBtn
                label="Comments"
                onClick={() => dispatch({ type: "OPEN_TASK", id: task.id })}
              >
                <CommentDots />
              </ActionBtn>
              <ActionBtn
                label="Assignee"
                onClick={() => dispatch({ type: "OPEN_TASK", id: task.id })}
              >
                <PersonIcon />
              </ActionBtn>
              <ActionBtn
                label="More actions"
                onClick={() => {
                  setMenuOpen((v) => !v);
                  setDateOpen(false);
                }}
              >
                <DotsIcon />
              </ActionBtn>
            </div>

            {/* popovers — visibility driven only by their open state */}
            {dateOpen && (
              <div className="absolute right-0 top-full z-20 mt-1">
                <DatePicker
                  value={task.dueDate}
                  onSelect={(iso) =>
                    dispatch({ type: "SET_DUE", id: task.id, dueDate: iso })
                  }
                  onClose={() => setDateOpen(false)}
                />
              </div>
            )}
            {menuOpen && (
              <TaskContextMenu
                taskId={task.id}
                align="right"
                onClose={() => setMenuOpen(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      {children}
    </button>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4L19 9l-4-4L4 16v4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CommentDots() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 5h14v10H9l-4 4V5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="19" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}

function DueChip({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const { label: dateLabel, color } = formatDue(task.dueDate!);
  const label = task.dueTime ? `${dateLabel} ${task.dueTime}` : dateLabel;

  return (
    <span className="relative mt-1 inline-block">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs font-medium transition hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        style={{ color: DUE_COLOR[color] }}
      >
        <CalendarMini />
        {label}
      </button>
      {open && (
        <span
          className="absolute left-0 top-full z-20 mt-1 block"
          onClick={(e) => e.stopPropagation()}
        >
          <DatePicker
            value={task.dueDate}
            onSelect={(iso) =>
              dispatch({ type: "SET_DUE", id: task.id, dueDate: iso })
            }
            onClose={() => setOpen(false)}
          />
        </span>
      )}
    </span>
  );
}

function CheckIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke={filled ? "#fff" : "currentColor"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarMini() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 9h16M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
