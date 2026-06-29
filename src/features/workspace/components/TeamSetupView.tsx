"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatDue } from "../date";
import type { TaskDraft } from "../types";
import { AddTaskInline } from "./AddTask";

const DUE_HEX: Record<string, string> = {
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#7c3aed",
  neutral: "#6b7280",
  red: "#dc4c3e",
};

const PRIO_HEX: Record<number, string> = {
  1: "#dc4c3e",
  2: "#f59e0b",
  3: "#3b82f6",
  4: "#9ca3af",
};

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  color: string;
  due?: { label: string; color: string };
  subtasks?: { id: string; title: string; description?: string }[];
}

const RED = "#dc4c3e";
const ORANGE = "#f59e0b";
const BLUE = "#3b82f6";
const GREY = "#9ca3af";

const ITEMS: ChecklistItem[] = [
  {
    id: "s1",
    title: "Invite your teammates",
    description:
      "Share a link or send email invites so they can join your shared workspace. (You can keep projects private, too.)",
    color: RED,
    due: { label: "Today", color: "#16a34a" },
  },
  {
    id: "s2",
    title: "Create your first team project",
    description:
      "Pick something big your team is working on and keep its tasks and deadlines organized in one place.",
    color: ORANGE,
    due: { label: "Today", color: "#16a34a" },
    subtasks: [
      {
        id: "s2a",
        title: "Break the work into tasks",
        description:
          "You can even split tasks into smaller sub-tasks, like this one.",
      },
      {
        id: "s2b",
        title: "Add due dates",
        description: "So everyone knows what needs to be done, and when.",
      },
      {
        id: "s2c",
        title: "Assign tasks to teammates",
        description:
          "Work flows more smoothly when every task has a clear owner.",
      },
    ],
  },
  {
    id: "s3",
    title: "Add your team logo",
    description:
      "Make the workspace feel like home by adding your logo in team settings.",
    color: BLUE,
    due: { label: "Tomorrow", color: "#ea580c" },
  },
  {
    id: "s4",
    title: "Archive the project when you're done",
    description:
      "You can always find and restore archived projects inside your team workspace.",
    color: GREY,
  },
];

interface Section {
  id: string;
  name: string;
  collapsed: boolean;
  items: ChecklistItem[];
}

const MORE_ITEMS: ChecklistItem[] = [
  {
    id: "m1",
    title: "Explore views: List, Board & Calendar",
    description: "Switch how a project looks from the View menu up top.",
    color: GREY,
  },
  {
    id: "m2",
    title: "Set up your integrations",
    description: "Connect the tools your team already uses.",
    color: GREY,
  },
];

const INITIAL_SECTIONS: Section[] = [
  {
    id: "sec-basics",
    name: "Start here with the basics 👇",
    collapsed: false,
    items: ITEMS,
  },
  {
    id: "sec-more",
    name: "Power up your workflow",
    collapsed: false,
    items: MORE_ITEMS,
  },
];

export function TeamSetupView() {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [confirmArchive, setConfirmArchive] = useState<Section | null>(null);
  const [undo, setUndo] = useState<{ section: Section; index: number } | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingSection, setAddingSection] = useState(false);

  const toggle = (id: string) =>
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  function addItem(sectionId: string, draft: TaskDraft) {
    const due = draft.dueDate ? formatDue(draft.dueDate) : undefined;
    const item: ChecklistItem = {
      id: `c${Date.now()}`,
      title: draft.title,
      description: draft.description || undefined,
      color: PRIO_HEX[draft.priority],
      due: due ? { label: due.label, color: DUE_HEX[due.color] } : undefined,
    };
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, item] } : s,
      ),
    );
  }

  function toggleCollapse(sectionId: string) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s,
      ),
    );
  }

  function archiveSection(section: Section) {
    const index = sections.findIndex((s) => s.id === section.id);
    setSections((prev) => prev.filter((s) => s.id !== section.id));
    setUndo({ section, index });
    setConfirmArchive(null);
  }

  function undoArchive() {
    if (!undo) return;
    setSections((prev) => {
      const next = [...prev];
      next.splice(undo.index, 0, undo.section);
      return next;
    });
    setUndo(null);
  }

  function deleteSection(sectionId: string) {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
  }

  function renameSection(sectionId: string, name: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, name } : s)),
    );
  }

  function addSection(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSections((prev) => [
      ...prev,
      { id: `sec-${Date.now()}`, name: trimmed, collapsed: false, items: [] },
    ]);
  }

  return (
    <>
      {/* top bar */}
      <div className="flex items-center justify-between px-6 py-3 text-sm text-neutral-500">
        <span>Nicelydone /</span>
        <div className="flex items-center gap-1">
          <TopBtn label="Share">
            <ShareIcon /> Share
          </TopBtn>
          <TopBtn label="View">
            <SlidersIcon /> View
          </TopBtn>
          <IconBtn label="Comments">
            <CommentIcon />
          </IconBtn>
          <IconBtn label="More">
            <DotsIcon />
          </IconBtn>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-8 pb-16">
        <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
          Set up your team
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-700">
          <span className="font-bold">Congrats on creating your team! 🎉</span>{" "}
          We&apos;ve kept everything simple and intuitive to get your team up
          and running fast. But there are plenty of powerful features just below
          the surface when you need them.
        </p>

        {sections.map((section) => (
          <div key={section.id} className="mt-6">
            {/* section header */}
            <div className="group/sec relative flex items-center gap-2 border-b border-neutral-100 pb-2">
              <button
                onClick={() => toggleCollapse(section.id)}
                className="text-neutral-500"
                aria-label={section.collapsed ? "Expand" : "Collapse"}
              >
                <Chevron open={!section.collapsed} />
              </button>
              {editingId === section.id ? (
                <input
                  autoFocus
                  value={section.name}
                  onChange={(e) => renameSection(section.id, e.target.value)}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape")
                      setEditingId(null);
                  }}
                  className="flex-1 rounded border border-brand bg-white px-1.5 py-0.5 text-sm font-bold text-[#202020] outline-none ring-2 ring-brand/20"
                />
              ) : (
                <>
                  <h2 className="text-sm font-bold text-[#202020]">
                    {section.name}
                  </h2>
                  <span className="text-sm text-neutral-400">
                    {section.items.length}
                  </span>
                </>
              )}
              <div className="relative ml-auto">
                <button
                  aria-label="Section actions"
                  onClick={() =>
                    setMenuFor(menuFor === section.id ? null : section.id)
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 opacity-0 transition hover:bg-neutral-100 hover:text-neutral-700 group-hover/sec:opacity-100"
                >
                  <DotsIcon />
                </button>
                {menuFor === section.id && (
                  <SectionMenu
                    onClose={() => setMenuFor(null)}
                    onEdit={() => {
                      setMenuFor(null);
                      setEditingId(section.id);
                    }}
                    onArchive={() => {
                      setMenuFor(null);
                      setConfirmArchive(section);
                    }}
                    onDelete={() => {
                      setMenuFor(null);
                      deleteSection(section.id);
                    }}
                  />
                )}
              </div>
            </div>

            {!section.collapsed && (
              <div>
                {section.items.map((item) => (
                  <div key={item.id}>
                    <Row
                      title={item.title}
                      description={item.description}
                      color={item.color}
                      due={item.due}
                      completed={done.has(item.id)}
                      subCount={
                        item.subtasks
                          ? {
                              done: item.subtasks.filter((s) => done.has(s.id))
                                .length,
                              total: item.subtasks.length,
                            }
                          : undefined
                      }
                      onToggle={() => toggle(item.id)}
                    />
                    {item.subtasks && (
                      <div className="ml-9">
                        {item.subtasks.map((sub) => (
                          <Row
                            key={sub.id}
                            title={sub.title}
                            description={sub.description}
                            color={GREY}
                            completed={done.has(sub.id)}
                            onToggle={() => toggle(sub.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-1">
                  <AddTaskInline
                    onSubmit={(draft) => addItem(section.id, draft)}
                    destination={section.name}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* add section */}
        <div className="mt-6">
          {addingSection ? (
            <AddSectionInput
              onAdd={(name) => {
                addSection(name);
                setAddingSection(false);
              }}
              onCancel={() => setAddingSection(false)}
            />
          ) : (
            <button
              onClick={() => setAddingSection(true)}
              className="group/add flex w-full items-center gap-2 py-1 text-sm font-semibold text-neutral-400 hover:text-brand"
            >
              <span className="h-px flex-1 bg-transparent transition group-hover/add:bg-brand/30" />
              <span className="flex items-center gap-1.5">
                <PlusMini /> Add section
              </span>
              <span className="h-px flex-1 bg-transparent transition group-hover/add:bg-brand/30" />
            </button>
          )}
        </div>
      </div>

      {confirmArchive && (
        <ArchiveSectionModal
          name={confirmArchive.name}
          onCancel={() => setConfirmArchive(null)}
          onArchive={() => archiveSection(confirmArchive)}
        />
      )}

      {undo && (
        <SectionUndoToast
          onUndo={undoArchive}
          onDismiss={() => setUndo(null)}
        />
      )}
    </>
  );
}

function AddSectionInput({
  onAdd,
  onCancel,
}: {
  onAdd: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="rounded-lg border border-neutral-200 p-3 shadow-sm">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd(name);
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Name this section"
        className="w-full text-sm font-bold text-[#202020] outline-none placeholder:font-normal placeholder:text-neutral-400"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onAdd(name)}
          disabled={!name.trim()}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold text-white transition",
            name.trim()
              ? "bg-brand hover:bg-brand-dark"
              : "cursor-not-allowed bg-brand/50",
          )}
        >
          Add section
        </button>
        <button
          onClick={onCancel}
          className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PlusMini() {
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

function SectionMenu({
  onClose,
  onEdit,
  onArchive,
  onDelete,
}: {
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute right-0 top-full z-30 mt-1 w-52 overflow-hidden rounded-xl border border-neutral-200 bg-white py-1.5 shadow-2xl animate-pop-in">
        <SectionItem icon={<EditPencil />} onClick={onEdit}>
          Edit
        </SectionItem>
        <SectionItem icon={<ArchiveIcon />} onClick={onArchive}>
          Archive section
        </SectionItem>
        <div className="my-1 h-px bg-neutral-100" />
        <SectionItem icon={<TrashIcon />} danger onClick={onDelete}>
          Delete section
        </SectionItem>
      </div>
    </>
  );
}

function SectionItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-1.5 text-sm hover:bg-neutral-100",
        danger ? "text-brand" : "text-[#202020]",
      )}
    >
      <span className={danger ? "text-brand" : "text-neutral-500"}>{icon}</span>
      {children}
    </button>
  );
}

function ArchiveSectionModal({
  name,
  onCancel,
  onArchive,
}: {
  name: string;
  onCancel: () => void;
  onArchive: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-6 pt-[18vh]"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md animate-pop-in rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold text-[#202020]">Archive section?</h2>
          <button
            aria-label="Close"
            onClick={onCancel}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg
              width="18"
              height="18"
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
          </button>
        </div>
        <p className="mt-3 text-[15px] leading-relaxed text-[#202020]">
          Are you sure you want to archive{" "}
          <span className="font-bold">{name}</span>?
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
          >
            Cancel
          </button>
          <button
            onClick={onArchive}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionUndoToast({
  onUndo,
  onDismiss,
}: {
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex animate-pop-in items-center gap-4 rounded-lg bg-[#202020] px-4 py-3 text-sm text-white shadow-xl">
      <span>1 section archived</span>
      <button
        onClick={onUndo}
        className="font-semibold text-brand hover:underline"
      >
        Undo
      </button>
      <button
        aria-label="Dismiss"
        onClick={onDismiss}
        className="text-neutral-400 hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function EditPencil() {
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
function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M10 13h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function Row({
  title,
  description,
  color,
  due,
  completed,
  subCount,
  onToggle,
}: {
  title: string;
  description?: string;
  color: string;
  due?: { label: string; color: string };
  completed: boolean;
  subCount?: { done: number; total: number };
  onToggle: () => void;
}) {
  return (
    <div className="group flex items-start gap-3 border-b border-neutral-100 py-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={completed}
        aria-label="Complete"
        onClick={onToggle}
        style={{ borderColor: color, color }}
        className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 hover:bg-black/[0.03]"
      >
        {completed ? (
          <span
            className="flex h-full w-full animate-check-pop items-center justify-center rounded-full"
            style={{ backgroundColor: color }}
          >
            <Check filled />
          </span>
        ) : (
          <Check className="opacity-0 transition group-hover:opacity-40" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm leading-snug text-[#202020]",
            completed && "text-neutral-400 line-through",
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              "mt-0.5 text-sm text-neutral-500",
              completed && "line-through",
            )}
          >
            {description}
          </p>
        )}
        {(due || subCount) && !completed && (
          <div className="mt-1 flex items-center gap-3 text-xs font-medium">
            {subCount && (
              <span className="flex items-center gap-1 text-neutral-500">
                <SubtaskIcon /> {subCount.done}/{subCount.total}
              </span>
            )}
            {due && (
              <span
                className="flex items-center gap-1"
                style={{ color: due.color }}
              >
                <CalendarMini /> {due.label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* icons */
function Check({
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
function SubtaskIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4v8a4 4 0 004 4h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 12l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("transition", !open && "-rotate-90")}
    >
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
function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="8" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 7a3 3 0 100 6M16 7l-5 3.5M16 17a3 3 0 11-5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SlidersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8h10M18 8h2M4 16h2M10 16h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="8" r="2.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="16" r="2.4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function CommentIcon() {
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
function TopBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}
function IconBtn({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}
