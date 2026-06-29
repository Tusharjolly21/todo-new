"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { quickOptions } from "../date";
import { PRIORITIES, PRIORITY_META } from "../priority";
import { useTasks } from "../state";
import { DatePicker } from "./DatePicker";
import { PriorityFlag } from "./PriorityFlag";
import { ProjectPicker } from "./ProjectPicker";
import { QuickDateIcon } from "./QuickDateIcon";

interface TaskContextMenuProps {
  taskId: string;
  onClose: () => void;
  align?: "left" | "right";
}

/**
 * Full task "more actions" (⋯) menu, mirroring Todoist: inline Date and
 * Priority icon rows plus the complete action set. Wired actions go through
 * reducer dispatches; not-yet-modelled rows (deadline, reminders, move…) are
 * present for fidelity.
 */
export function TaskContextMenu({
  taskId,
  onClose,
  align = "left",
}: TaskContextMenuProps) {
  const { state, dispatch } = useTasks();
  const ref = useRef<HTMLDivElement>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [recurOpen, setRecurOpen] = useState(false);

  const index = state.tasks.findIndex((t) => t.id === taskId);
  const task = state.tasks[index];

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

  if (!task) return null;

  const run = (action: () => void) => {
    action();
    onClose();
  };
  const setDue = (iso: string | null) =>
    run(() => dispatch({ type: "SET_DUE", id: taskId, dueDate: iso }));

  return (
    <div
      ref={ref}
      className={`absolute top-full z-30 mt-1 w-[320px] rounded-xl border border-neutral-200 bg-white py-1.5 text-[#202020] shadow-2xl animate-pop-in ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      <Item
        icon={<AddAboveIcon />}
        shortcut="↑"
        onClick={() => run(() => dispatch({ type: "START_ADD_AT", index }))}
      >
        Add task above
      </Item>
      <Item
        icon={<AddBelowIcon />}
        shortcut="↓"
        onClick={() =>
          run(() => dispatch({ type: "START_ADD_AT", index: index + 1 }))
        }
      >
        Add task below
      </Item>

      <Divider />

      <Item
        icon={<EditIcon />}
        shortcut="⌘E"
        onClick={() => run(() => dispatch({ type: "OPEN_TASK", id: taskId }))}
      >
        Edit
      </Item>

      <Divider />

      {/* Date */}
      <SectionLabel label="Date" shortcut="T" />
      <div className="relative flex items-center gap-1 px-3 pb-1.5 pt-0.5">
        {quickOptions().map((opt) => (
          <PickBtn
            key={opt.key}
            label={opt.label}
            onClick={() => setDue(opt.iso)}
          >
            <QuickDateIcon kind={opt.key} />
          </PickBtn>
        ))}
        <PickBtn label="No date" onClick={() => setDue(null)}>
          <NoDateIcon />
        </PickBtn>
        <PickBtn label="More dates" onClick={() => setDateOpen((v) => !v)}>
          <MoreDotsIcon />
        </PickBtn>
        {dateOpen && (
          <div className="absolute right-0 top-full z-40 mt-1">
            <DatePicker
              value={task.dueDate}
              onSelect={(iso) =>
                dispatch({ type: "SET_DUE", id: taskId, dueDate: iso })
              }
              onClose={() => {
                setDateOpen(false);
                onClose();
              }}
            />
          </div>
        )}
      </div>

      {/* Priority */}
      <SectionLabel label="Priority" shortcut="Y" />
      <div className="flex items-center gap-1 px-3 pb-2 pt-0.5">
        {PRIORITIES.map((p) => (
          <PickBtn
            key={p}
            label={PRIORITY_META[p].label}
            active={task.priority === p}
            onClick={() =>
              run(() =>
                dispatch({ type: "SET_PRIORITY", id: taskId, priority: p }),
              )
            }
          >
            <PriorityFlag
              color={PRIORITY_META[p].color}
              filled={p !== 4}
              size={18}
            />
          </PickBtn>
        ))}
      </div>

      <Divider />

      <Item icon={<DeadlineIcon />} shortcut="D">
        Deadline
      </Item>
      <Item icon={<ReminderIcon />}>
        <span className="flex items-center gap-1.5">
          Reminders
          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
        </span>
      </Item>

      <Divider />

      <div className="relative">
        <Item
          icon={<RecurringIcon />}
          hasSubmenu
          onClick={() => {
            setRecurOpen((v) => !v);
            setMoveOpen(false);
          }}
        >
          Complete recurring task
        </Item>
        {recurOpen && (
          <div className="absolute right-full top-0 z-40 mr-1 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg text-[#202020]">
            <button
              onClick={() =>
                run(() => {
                  dispatch({ type: "COMPLETE", id: taskId });
                })
              }
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-neutral-100 text-neutral-700 font-semibold"
            >
              ✓ Complete
            </button>
            <button
              onClick={() =>
                run(() => {
                  dispatch({ type: "COMPLETE", id: taskId });
                })
              }
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs hover:bg-neutral-100 text-neutral-700 font-semibold"
            >
              ✓ Complete forever
            </button>
          </div>
        )}
      </div>
      <div className="relative">
        <Item
          icon={<MoveIcon />}
          shortcut="V"
          hasSubmenu
          onClick={() => setMoveOpen((v) => !v)}
        >
          Move to…
        </Item>
        {moveOpen && (
          <div className="absolute right-full top-0 z-40 mr-1">
            <ProjectPicker
              value={task.projectId}
              onSelect={(projectId) =>
                run(() =>
                  dispatch({ type: "SET_PROJECT", id: taskId, projectId }),
                )
              }
              onClose={() => setMoveOpen(false)}
            />
          </div>
        )}
      </div>
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

      <Divider />

      <Item icon={<ExtensionIcon />}>Add extension…</Item>

      <Divider />

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

function Divider() {
  return <div className="my-1 h-px bg-neutral-100" />;
}

function SectionLabel({
  label,
  shortcut,
}: {
  label: string;
  shortcut: string;
}) {
  return (
    <div className="flex items-center justify-between px-3 pt-1.5">
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <span className="text-xs text-neutral-400">{shortcut}</span>
    </div>
  );
}

function Item({
  icon,
  children,
  onClick,
  danger,
  shortcut,
  hasSubmenu,
}: {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  shortcut?: string;
  hasSubmenu?: boolean;
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
      {hasSubmenu && <ChevronRight />}
      {shortcut && <span className="text-xs text-neutral-400">{shortcut}</span>}
    </button>
  );
}

/** A square icon button used in the inline Date / Priority rows. */
function PickBtn({
  children,
  label,
  onClick,
  active,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-md border transition hover:bg-neutral-100 ${
        active ? "border-brand bg-brand-tint" : "border-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

/* icons */
const ic = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;
function AddAboveIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M12 21V9M7 14l5-5 5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 4h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function AddBelowIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M12 3v12M7 10l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M4 20h4L19 9l-4-4L4 16v4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function NoDateIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="#6b7280" strokeWidth="2" />
      <path
        d="M6 6l12 12"
        stroke="#6b7280"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function MoreDotsIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="5" cy="12" r="1.7" fill="#6b7280" />
      <circle cx="12" cy="12" r="1.7" fill="#6b7280" />
      <circle cx="19" cy="12" r="1.7" fill="#6b7280" />
    </svg>
  );
}
function DeadlineIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M12 3l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.6 2.7.6 2.7-2.3 1.4-1 2.5-2.7-.2L12 21l-2.2-1.6-2.7.2-1-2.5L3.8 16l.6-2.7-.6-2.7 2.3-1.4 1-2.5 2.7.2z"
        stroke="#ea580c"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12l1.8 1.8 3.2-3.6"
        stroke="#ea580c"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ReminderIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 10v3l2 2M5 5l3-2M19 5l-3-2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function RecurringIcon() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 12.5l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MoveIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M4 6h10M4 12h10M4 18h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 15l3 3-3 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0 -9)"
      />
    </svg>
  );
}
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
function ExtensionIcon() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M9 4a2 2 0 014 0h3v3a2 2 0 010 4v3h-3a2 2 0 01-4 0H5v-3a2 2 0 000-4V4h4z"
        stroke="currentColor"
        strokeWidth="1.8"
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
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
