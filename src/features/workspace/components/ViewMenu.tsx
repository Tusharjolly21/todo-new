"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

export type SortKey = "smart" | "name" | "date" | "priority";
export type Layout = "list" | "board" | "calendar";
export type GroupingKey = "none" | "priority";
export type SortDirection = "asc" | "desc";
export type FilterDueDate = "all" | "today" | "upcoming" | "nodate";
export type FilterPriority = "all" | 1 | 2 | 3 | 4;

const SORTS: { value: SortKey; label: string }[] = [
  { value: "smart", label: "Smart" },
  { value: "name", label: "Name" },
  { value: "date", label: "Due date" },
  { value: "priority", label: "Priority" },
];

interface ViewMenuProps {
  layout: Layout;
  onLayout: (l: Layout) => void;
  showCompleted: boolean;
  onToggleCompleted: (val: boolean) => void;
  grouping: GroupingKey;
  onGrouping: (g: GroupingKey) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  sortDirection: SortDirection;
  onSortDirection: (d: SortDirection) => void;
  filterDueDate: FilterDueDate;
  onFilterDueDate: (f: FilterDueDate) => void;
  filterPriority: FilterPriority;
  onFilterPriority: (p: FilterPriority) => void;
  filterLabel: string;
  onFilterLabel: (l: string) => void;
  availableLabels: string[];
  onReset: () => void;
  onClose: () => void;
  isTodayView?: boolean;
  filterWorkspace?: string;
  onFilterWorkspace?: (val: string) => void;
  filterAssignee?: string;
  onFilterAssignee?: (val: string) => void;
}

export function ViewMenu({
  layout,
  onLayout,
  showCompleted,
  onToggleCompleted,
  grouping,
  onGrouping,
  sort,
  onSort,
  sortDirection,
  onSortDirection,
  filterDueDate,
  onFilterDueDate,
  filterPriority,
  onFilterPriority,
  filterLabel,
  onFilterLabel,
  availableLabels,
  onReset,
  onClose,
  isTodayView = false,
  filterWorkspace = "all",
  onFilterWorkspace,
  filterAssignee = "all",
  onFilterAssignee,
}: ViewMenuProps) {
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

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-[60] mt-1 w-80 rounded-xl border border-neutral-200 bg-white p-5 shadow-2xl animate-pop-in text-[#202020]"
    >
      {/* Layout Header */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Layout
        </p>
        <button
          className="text-neutral-400 hover:text-neutral-600 transition"
          title="Help"
        >
          <HelpIcon />
        </button>
      </div>

      <div
        className={cn(
          "grid gap-1.5 mb-4",
          isTodayView ? "grid-cols-2" : "grid-cols-3",
        )}
      >
        <LayoutBtn
          active={layout === "list"}
          onClick={() => onLayout("list")}
          icon={<ListIcon />}
        >
          List
        </LayoutBtn>
        <LayoutBtn
          active={layout === "board"}
          onClick={() => onLayout("board")}
          icon={<BoardIcon />}
        >
          Board
        </LayoutBtn>
        {!isTodayView && (
          <LayoutBtn
            active={layout === "calendar"}
            onClick={() => onLayout("calendar")}
            icon={<CalendarIcon />}
            isPremium
          >
            Calendar
          </LayoutBtn>
        )}
      </div>

      {/* Completed tasks toggle */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5 mb-3.5 text-sm">
        <span className="flex items-center gap-2">
          <CheckIcon />
          <span className="text-[#202020] text-[13px] font-normal">
            Completed tasks
          </span>
        </span>
        <button
          onClick={() => onToggleCompleted(!showCompleted)}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
            showCompleted ? "bg-brand" : "bg-neutral-200",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              showCompleted ? "translate-x-4" : "translate-x-0",
            )}
          />
        </button>
      </div>

      {/* Sort by */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Sort by
        </p>
        <button
          className="text-neutral-400 hover:text-neutral-600 transition"
          title="Help"
        >
          <HelpIcon />
        </button>
      </div>

      <div className="space-y-1">
        <Row icon={<GroupIcon />} label="Grouping">
          <SelectField
            value={grouping}
            onChange={onGrouping}
            options={[
              { value: "none", label: "None" },
              { value: "priority", label: "Priority" },
            ]}
          />
        </Row>

        <Row icon={<SortIcon />} label="Sorting">
          <SelectField value={sort} onChange={onSort} options={SORTS} />
        </Row>

        <Row icon={<DirectionIcon />} label="Direction">
          <SelectField
            value={sortDirection}
            onChange={onSortDirection}
            options={[
              { value: "asc", label: "Ascending (default)" },
              { value: "desc", label: "Descending" },
            ]}
          />
        </Row>
      </div>

      {/* Filter by */}
      <div className="flex items-center justify-between mb-2 mt-4.5">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Filter by
        </p>
        <button
          className="text-neutral-400 hover:text-neutral-600 transition"
          title="Help"
        >
          <HelpIcon />
        </button>
      </div>

      <div className="space-y-1">
        {isTodayView && onFilterAssignee && (
          <Row icon={<PersonIconMini />} label="Assignee">
            <SelectField
              value={filterAssignee}
              onChange={onFilterAssignee}
              options={[
                { value: "all", label: "Default" },
                { value: "none", label: "No one" },
                { value: "me", label: "Only me" },
              ]}
            />
          </Row>
        )}

        {!isTodayView && (
          <Row icon={<CalendarIconMini />} label="Due date">
            <SelectField
              value={filterDueDate}
              onChange={onFilterDueDate}
              options={[
                { value: "all", label: "All (default)" },
                { value: "today", label: "Today" },
                { value: "upcoming", label: "Upcoming" },
                { value: "nodate", label: "No date" },
              ]}
            />
          </Row>
        )}

        <Row icon={<PriorityIcon />} label="Priority">
          <SelectField
            value={filterPriority}
            onChange={onFilterPriority}
            options={[
              { value: "all", label: "All (default)" },
              { value: 1, label: "Priority 1" },
              { value: 2, label: "Priority 2" },
              { value: 3, label: "Priority 3" },
              { value: 4, label: "Priority 4" },
            ]}
          />
        </Row>

        <Row icon={<TagIcon />} label="Label">
          <SelectField
            value={filterLabel}
            onChange={onFilterLabel}
            options={[
              { value: "all", label: "All (default)" },
              ...availableLabels.map((l) => ({ value: l, label: l })),
            ]}
          />
        </Row>

        {isTodayView && onFilterWorkspace && (
          <Row icon={<WorkspaceIconMini />} label="Workspace">
            <SelectField
              value={filterWorkspace}
              onChange={onFilterWorkspace}
              options={[
                { value: "all", label: "All (default)" },
                { value: "my", label: "My Projects" },
                { value: "team", label: "Nicelydone" },
              ]}
            />
          </Row>
        )}
      </div>

      {/* Reset Button */}
      <div className="mt-4.5 border-t border-neutral-100 pt-3 flex justify-start">
        <button
          onClick={onReset}
          className="text-sm font-bold text-brand hover:text-[#b23b30] active:scale-95 transition"
        >
          Reset all
        </button>
      </div>
    </div>
  );
}

function LayoutBtn({
  active,
  onClick,
  icon,
  children,
  isPremium,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  isPremium?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-1 rounded-lg border py-2 text-xs font-semibold transition w-full select-none",
        active
          ? "border-brand text-brand bg-brand/[0.02]"
          : "border-neutral-200 text-neutral-500 hover:bg-neutral-50",
      )}
    >
      <span className="relative inline-block">
        <span className={active ? "text-brand" : "text-neutral-400"}>
          {icon}
        </span>
        {isPremium && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 border border-white"></span>
          </span>
        )}
      </span>
      {children}
    </button>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-[13px]">
      <span className="flex items-center gap-2.5 text-neutral-700 font-normal">
        <span className="text-neutral-400">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}

function SelectField<T extends string | number>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (val: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="relative inline-flex items-center cursor-pointer select-none">
      <select
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          // Parse number if numeric
          if (!isNaN(Number(val)) && val !== "all") {
            onChange(Number(val) as unknown as T);
          } else {
            onChange(val as unknown as T);
          }
        }}
        style={{ backgroundImage: "none" }}
        className="appearance-none bg-none bg-transparent pr-4.5 text-right text-[13px] font-normal text-neutral-500 hover:text-neutral-800 outline-none cursor-pointer border-none p-0 focus:ring-0"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="text-[#202020] bg-white"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-0 flex items-center text-neutral-400">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

const ic = { width: 14, height: 14, viewBox: "0 0 24 24" } as const;

function ListIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <path
        d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BoardIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="6"
        height="16"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="4"
        width="6"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 2v4M8 2v4M3 10h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function HelpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.5 9a2.5 2.5 0 014.5-.5c0 1.2-1.2 1.8-1.8 2.5M12 16.5h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function GroupIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="14"
        width="16"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function SortIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <path
        d="M7 4v16M7 20l-3-3M7 4l3 3M17 4v16M17 4l-3 3M17 20l3-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DirectionIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12l7 7 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CalendarIconMini() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function PriorityIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <path
        d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1v12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg {...ic} fill="none" aria-hidden>
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
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 12l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonIconMini() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function WorkspaceIconMini() {
  return (
    <svg {...ic} fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
