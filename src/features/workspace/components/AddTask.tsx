"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatDue } from "../date";
import { getMember } from "../members";
import { PRIORITY_META } from "../priority";
import { DEFAULT_PROJECT_ID, getProject, PROJECTS } from "../projects";
import type { Priority, TaskDraft } from "../types";
import { AssigneePicker } from "./AssigneePicker";
import { DatePicker } from "./DatePicker";
import { LabelPicker } from "./LabelPicker";
import { MemberAvatar } from "./MemberAvatar";
import { PriorityFlag } from "./PriorityFlag";
import { PriorityPicker } from "./PriorityPicker";
import { ProjectGlyph, ProjectPicker } from "./ProjectPicker";
import { ReminderPicker } from "./ReminderPicker";

interface EditorProps {
  onSubmit: (draft: TaskDraft) => void;
  onCancel: () => void;
  /** Label of the destination shown in the footer chip (e.g. "Inbox"). */
  destination?: string;
  autoFocus?: boolean;
  hideProjectPicker?: boolean;
  defaultDueDate?: string | null;
  defaultProjectId?: string | null;
  /** Shows the "New: Task duration" promo banner (used in the quick-add modal). */
  showDurationTip?: boolean;
}

/**
 * Presentational Add-task editor: collects a {@link TaskDraft} (title,
 * description, due date, priority) and hands it to `onSubmit`. Reused by the
 * inline trigger, the team checklist, and the sidebar quick-add modal.
 */
export function AddTaskEditor({
  onSubmit,
  onCancel,
  destination = "Inbox",
  autoFocus = true,
  hideProjectPicker = false,
  defaultDueDate = null,
  defaultProjectId = null,
  showDurationTip = false,
}: EditorProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | null>(
    () => defaultDueDate || null,
  );
  const [dueTime, setDueTime] = useState<string | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [priority, setPriority] = useState<Priority>(4);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [reminders, setReminders] = useState<string[]>([]);
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(false);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [destinationId, setDestinationId] = useState(
    () =>
      defaultProjectId ??
      PROJECTS.find((p) => p.name === destination)?.id ??
      DEFAULT_PROJECT_ID,
  );
  const [projectOpen, setProjectOpen] = useState(false);

  const due = dueDate ? formatDue(dueDate) : null;
  const dueLabel = due
    ? dueTime
      ? `${due.label} ${dueTime}${
          duration ? `-${addMinutes(dueTime, duration)}` : ""
        }`
      : due.label
    : null;
  const prioMeta = PRIORITY_META[priority];
  const project = getProject(destinationId);
  const assignee = getMember(assigneeId);

  function submit() {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      description,
      projectId: destinationId,
      dueDate,
      dueTime,
      duration,
      priority,
      assigneeId,
      labels,
      reminders,
    });
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="px-4 pt-3">
        <input
          autoFocus={autoFocus}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onCancel();
          }}
          placeholder="Task name"
          className="w-full text-lg font-semibold text-[#202020] outline-none placeholder:font-semibold placeholder:text-neutral-400"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="mt-1 w-full text-sm text-neutral-600 outline-none placeholder:text-neutral-400"
        />
        <div className="mt-4 flex flex-wrap items-center gap-2 pb-3">
          {/* due date */}
          <div className="relative">
            <Chip
              active={!!due}
              color={due ? dueColor(due.color) : undefined}
              icon={<CalendarMini />}
              label={dueLabel ?? "Due date"}
              onOpen={() => setDateOpen((v) => !v)}
              onClear={
                due
                  ? () => {
                      setDueDate(null);
                      setDueTime(null);
                      setDuration(null);
                    }
                  : undefined
              }
            />
            {dateOpen && (
              <div className="absolute left-0 top-full z-20 mt-1">
                <DatePicker
                  value={dueDate}
                  onSelect={setDueDate}
                  time={dueTime}
                  duration={duration}
                  onTime={(t, d) => {
                    setDueTime(t);
                    setDuration(d);
                  }}
                  onClose={() => setDateOpen(false)}
                />
              </div>
            )}
          </div>

          {/* priority */}
          <div className="relative">
            <Chip
              active={priority !== 4}
              color={priority !== 4 ? prioMeta.color : undefined}
              icon={
                <PriorityFlag
                  color={prioMeta.color}
                  filled={priority !== 4}
                  size={14}
                />
              }
              label={priority !== 4 ? `P${priority}` : "Priority"}
              onOpen={() => setPriorityOpen((v) => !v)}
              onClear={priority !== 4 ? () => setPriority(4) : undefined}
            />
            {priorityOpen && (
              <div className="absolute left-0 top-full z-20 mt-1">
                <PriorityPicker
                  value={priority}
                  onSelect={setPriority}
                  onClose={() => setPriorityOpen(false)}
                />
              </div>
            )}
          </div>

          {/* reminders */}
          <div className="relative">
            <Chip
              active={reminders.length > 0}
              brand
              icon={<BellMini />}
              label={
                reminders.length > 0 ? String(reminders.length) : "Reminders"
              }
              onOpen={() => setRemindersOpen((v) => !v)}
              onClear={
                reminders.length > 0 ? () => setReminders([]) : undefined
              }
            />
            {remindersOpen && (
              <div className="absolute left-0 top-full z-20 mt-1">
                <ReminderPicker
                  value={reminders}
                  onChange={setReminders}
                  onClose={() => setRemindersOpen(false)}
                />
              </div>
            )}
          </div>

          {/* labels chip — shown only once labels are set */}
          {labels.length > 0 && (
            <Chip
              active
              brand
              icon={<TagMini />}
              label={
                labels.length === 1 ? labels[0] : `${labels.length} labels`
              }
              onOpen={() => setLabelsOpen(true)}
              onClear={() => setLabels([])}
            />
          )}

          {/* more menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((v) => !v)}
              aria-label="More"
              className="inline-flex h-[26px] items-center gap-1.5 rounded-md border border-neutral-200 px-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              <DotsMini />
            </button>
            {moreOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMoreOpen(false)}
                />
                <div className="absolute left-0 top-full z-20 mt-1 w-52 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-2xl animate-pop-in">
                  <button
                    type="button"
                    onClick={() => {
                      setMoreOpen(false);
                      setLabelsOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-[#202020] hover:bg-neutral-100"
                  >
                    <TagMini /> <span className="flex-1 text-left">Labels</span>
                    <span className="text-xs text-neutral-400">@</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-[#202020] hover:bg-neutral-100"
                  >
                    <LocationMini /> Location
                  </button>
                  <button
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm text-[#202020] hover:bg-neutral-100"
                  >
                    <ExtensionMini /> Add extension…
                  </button>
                  <div className="my-1 h-px bg-neutral-100" />
                  <button
                    type="button"
                    onClick={() => setMoreOpen(false)}
                    className="flex w-full items-center gap-2.5 px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-tint"
                  >
                    Edit task actions
                  </button>
                </div>
              </>
            )}
            {labelsOpen && (
              <div className="absolute left-0 top-full z-30 mt-1">
                <LabelPicker
                  value={labels}
                  onChange={setLabels}
                  onClose={() => setLabelsOpen(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Task duration promo banner */}
        {showDurationTip && !tipDismissed && (
          <div className="mb-3 flex items-start gap-3 rounded-lg bg-neutral-50 p-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
              <ClockMini />
            </span>
            <div className="min-w-0 flex-1 text-xs leading-relaxed text-neutral-600">
              <p className="font-bold text-[#202020]">New: Task duration</p>
              <p className="mt-0.5">
                Decide what time you&apos;ll start a task and how long it will
                take. Try typing “at 2pm for 30 min”.
              </p>
              <p className="mt-1.5">
                <button
                  type="button"
                  className="font-medium text-[#202020] underline hover:text-brand"
                >
                  Learn more
                </button>{" "}
                ·{" "}
                <button
                  type="button"
                  className="font-medium text-[#202020] underline hover:text-brand"
                >
                  Send feedback
                </button>
              </p>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setTipDismissed(true)}
              className="text-neutral-400 hover:text-neutral-600"
            >
              <XMini />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 px-3 py-2.5">
        <div className="relative">
          {!hideProjectPicker && (
            <>
              <button
                type="button"
                onClick={() => setProjectOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
              >
                <ProjectGlyph project={project} />
                {project.name}
                {project.emoji ? ` ${project.emoji}` : ""}
                <Chevron />
              </button>
              {projectOpen && (
                <div className="absolute bottom-full left-0 z-30 mb-1">
                  <ProjectPicker
                    value={destinationId}
                    onSelect={setDestinationId}
                    onClose={() => setProjectOpen(false)}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* assignee */}
          <div className="relative">
            <button
              type="button"
              aria-label="Assign to"
              onClick={() => setAssigneeOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100"
            >
              {assignee ? (
                <MemberAvatar member={assignee} size={22} />
              ) : (
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full border border-dashed border-neutral-300 text-neutral-400">
                  <PersonMini />
                </span>
              )}
            </button>
            {assigneeOpen && (
              <div className="absolute bottom-full right-0 z-30 mb-1">
                <AssigneePicker
                  value={assigneeId}
                  onSelect={setAssigneeId}
                  onClose={() => setAssigneeOpen(false)}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!title.trim()}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-semibold text-white transition",
              title.trim()
                ? "bg-brand hover:bg-brand-dark"
                : "cursor-not-allowed bg-brand/50",
            )}
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
}

/** Collapsed "+ Add task" trigger that expands into the editor inline. */
export function AddTaskInline({
  onSubmit,
  destination,
  defaultDueDate = null,
}: {
  onSubmit: (draft: TaskDraft) => void;
  destination?: string;
  defaultDueDate?: string | null;
}) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="mt-2">
        <AddTaskEditor
          destination={destination}
          defaultDueDate={defaultDueDate}
          onSubmit={(draft) => {
            onSubmit(draft);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group mt-2 flex w-full items-center gap-2.5 py-2 text-sm text-neutral-500 hover:text-brand"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full text-brand transition group-hover:bg-brand group-hover:text-white">
        <PlusIcon />
      </span>
      Add task
    </button>
  );
}

/** Adds `mins` to a "HH:MM" time string, returning "HH:MM". */
function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor((total % 1440) / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function dueColor(c: string): string {
  return (
    {
      green: "#16a34a",
      orange: "#ea580c",
      purple: "#7c3aed",
      neutral: "#6b7280",
      red: "#dc4c3e",
    }[c] ?? "#6b7280"
  );
}

/** A chip in the add-task toolbar; shows a clear (✕) button when active. */
function Chip({
  active,
  color,
  brand,
  icon,
  label,
  onOpen,
  onClear,
}: {
  active?: boolean;
  color?: string;
  brand?: boolean;
  icon: React.ReactNode;
  label: string;
  onOpen: () => void;
  onClear?: () => void;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[26px] items-center rounded-md border text-xs font-medium",
        active
          ? brand
            ? "border-brand text-brand"
            : "border-current"
          : "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
      )}
      style={active && color ? { color } : undefined}
    >
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-1.5 py-1 pl-2.5 pr-1.5"
      >
        {icon}
        {label}
      </button>
      {onClear && (
        <button
          type="button"
          aria-label="Clear"
          onClick={onClear}
          className="flex h-full items-center pr-1.5 opacity-70 hover:opacity-100"
        >
          <XMini />
        </button>
      )}
    </span>
  );
}

function BellMini() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9a6 6 0 0112 0c0 7 2 7 2 9H4c0-2 2-2 2-9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 21h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TagMini() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12l9-9h8v8l-9 9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
function PersonMini() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
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
function DotsMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
function ExtensionMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4a2 2 0 014 0h3v3a2 2 0 010 4v3h-3a2 2 0 01-4 0H5v-3a2 2 0 000-4V4h4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockMini() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function XMini() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LocationMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
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
function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
