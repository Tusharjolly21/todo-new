"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { Task } from "../types";
import { useTasks } from "../state";
import { AddTaskEditor, AddTaskInline } from "./AddTask";
import { AllDone } from "./AllDone";
import { TaskItem } from "./TaskItem";
import { UndoToast } from "./UndoToast";
import {
  ViewMenu,
  type Layout,
  type SortKey,
  type GroupingKey,
  type SortDirection,
  type FilterDueDate,
  type FilterPriority,
} from "./ViewMenu";
import { PRIORITY_META } from "../priority";
import { matchFilterQuery } from "./FiltersLabelsView";
import { ProjectCommentsDrawer } from "./ProjectCommentsDrawer";
import { CalendarView } from "./CalendarView";
import { BoardTaskCard } from "./BoardTaskCard";
import { TemplatesModal } from "./TemplatesModal";
import {
  ProjectModal,
  ExportCsvModal,
  ImportCsvModal,
  EmailTasksModal,
  CalendarFeedModal,
  ArchiveProjectModal,
} from "./ProjectModals";
import { DEFAULT_PROJECT_ID } from "../projects";
import { QuickAddModal } from "./QuickAddModal";

function sortTasks(
  tasks: Task[],
  sort: SortKey,
  direction: SortDirection,
): Task[] {
  if (sort === "smart") {
    return direction === "asc" ? tasks : [...tasks].reverse();
  }
  const copy = [...tasks];
  if (sort === "name") {
    copy.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "priority") {
    // priority 1 is highest, 4 is lowest. ASC: P1 -> P4. DESC: P4 -> P1
    copy.sort((a, b) => a.priority - b.priority);
  } else if (sort === "date") {
    copy.sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  return direction === "asc" ? copy : copy.reverse();
}

import { toISO, startOfToday } from "../date";

export function InboxView({
  projectId = "inbox",
  title = "Inbox",
  onNavigate,
  onOpenSettings,
}: {
  projectId?: string;
  title?: string;
  onNavigate?: (view: string) => void;
  onOpenSettings?: (tab: string) => void;
}) {
  const { state, dispatch } = useTasks();
  const addAt = state.addingAtIndex;

  const isCustomView =
    projectId.startsWith("filter:") || projectId.startsWith("label:");
  const isTodayView = projectId === "today";
  const activeProject =
    isTodayView || isCustomView
      ? undefined
      : state.projects.find((p) => p.id === projectId);

  const [todayLayout, setTodayLayout] = useState<Layout>("list");

  useEffect(() => {
    if (isTodayView || isCustomView) {
      const saved = localStorage.getItem("todo_today_layout");
      if (saved === "list" || saved === "board") {
        setTodayLayout(saved as Layout);
      }
    }
  }, [isTodayView, isCustomView]);

  const layout =
    isTodayView || isCustomView ? todayLayout : activeProject?.layout || "list";
  const setLayout = (newLayout: Layout) => {
    if (isTodayView || isCustomView) {
      if (newLayout === "list" || newLayout === "board") {
        setTodayLayout(newLayout);
        localStorage.setItem("todo_today_layout", newLayout);
      }
    } else {
      dispatch({ type: "EDIT_PROJECT", id: projectId, layout: newLayout });
    }
  };
  const isFavorite = activeProject?.favorite || false;

  // View settings state
  const [viewOpen, setViewOpen] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [sort, setSort] = useState<SortKey>("smart");
  const [grouping, setGrouping] = useState<GroupingKey>("none");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filterDueDate, setFilterDueDate] = useState<FilterDueDate>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [filterLabel, setFilterLabel] = useState<string>("all");
  const [filterWorkspace, setFilterWorkspace] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsTab, setCommentsTab] = useState<"comments" | "activity">(
    "comments",
  );
  const [actionsOpen, setActionsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Modals state
  const [editProjOpen, setEditProjOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [emailTasksOpen, setEmailTasksOpen] = useState(false);
  const [calendarFeedOpen, setCalendarFeedOpen] = useState(false);
  const [archiveProjOpen, setArchiveProjOpen] = useState(false);
  const [calendarAddDate, setCalendarAddDate] = useState<string | null>(null);

  // Section state
  const [newSectionName, setNewSectionName] = useState("");
  const [addingSectionIndex, setAddingSectionIndex] = useState<number | null>(
    null,
  );
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionName, setEditSectionName] = useState("");
  const [sectionOptionsOpen, setSectionOptionsOpen] = useState<string | null>(
    null,
  );

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function handleSaveSection() {
    if (!newSectionName.trim()) return;
    dispatch({
      type: "ADD_SECTION",
      projectId,
      name: newSectionName.trim(),
    });
    setNewSectionName("");
    setAddingSectionIndex(null);
  }

  function handleRenameSection(sectionId: string) {
    if (!editSectionName.trim()) return;
    dispatch({
      type: "RENAME_SECTION",
      sectionId,
      name: editSectionName.trim(),
    });
    setEditingSectionId(null);
  }

  const inlineSectionAddForm = () => (
    <div className="w-[300px] shrink-0">
      <input
        autoFocus
        type="text"
        value={newSectionName}
        onChange={(e) => setNewSectionName(e.target.value)}
        placeholder="Name this section"
        className="mb-2.5 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-[#202020] outline-none focus:border-neutral-400"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSaveSection();
          if (e.key === "Escape") setAddingSectionIndex(null);
        }}
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveSection}
          disabled={!newSectionName.trim()}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-semibold text-white transition",
            newSectionName.trim()
              ? "bg-brand hover:bg-brand-dark"
              : "cursor-not-allowed bg-brand/50",
          )}
        >
          Add section
        </button>
        <button
          onClick={() => setAddingSectionIndex(null)}
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  function downloadCsv(useRelative: boolean) {
    const activeProjectTasks = state.tasks.filter(
      (t) => t.projectId === projectId,
    );
    const completedProjectTasks = completedTasks.filter(
      (t) => t.projectId === projectId,
    );
    const allProjectTasks = [...activeProjectTasks, ...completedProjectTasks];

    const rows = [
      ["Title", "Priority", "Due date", "Completed", "Section"],
      ...allProjectTasks.map((t) => {
        const sectionName =
          state.sections.find((s) => s.id === t.sectionId)?.name || "";
        let dueStr = t.dueDate ?? "";
        if (useRelative && t.dueDate) {
          const today = new Date(2026, 5, 28);
          const parts = t.dueDate.split("-").map(Number);
          const taskDate = new Date(parts[0], parts[1] - 1, parts[2]);
          const diffTime = taskDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 0) dueStr = "today";
          else if (diffDays === 1) dueStr = "tomorrow";
          else if (diffDays > 1) dueStr = `+${diffDays} days`;
          else dueStr = `${diffDays} days`;
        }
        return [
          t.title,
          `P${t.priority}`,
          dueStr,
          t.completed ? "yes" : "no",
          sectionName,
        ];
      }),
    ];

    const csv = rows
      .map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Exported as CSV");
  }

  // Completed tasks persistence state
  const prevTasksRef = useRef<Task[]>(state.tasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("todo_completed_tasks_store");
      if (saved) {
        setCompletedTasks(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const prevTasks = prevTasksRef.current;
    if (prevTasks.length > state.tasks.length) {
      if (state.pendingUndo?.kind === "completed") {
        const completedTask = state.pendingUndo.task;
        if (!completedTasks.some((t) => t.id === completedTask.id)) {
          const nextCompleted = [
            ...completedTasks,
            {
              ...completedTask,
              completed: true,
              completedAt:
                completedTask.completedAt || new Date().toISOString(),
            },
          ];
          setCompletedTasks(nextCompleted);
          localStorage.setItem(
            "todo_completed_tasks_store",
            JSON.stringify(nextCompleted),
          );
        }
      }
    }
    prevTasksRef.current = state.tasks;
  }, [state.tasks, state.pendingUndo, completedTasks]);

  useEffect(() => {
    // If a task in completedTasks gets re-added to state.tasks (because of undo), remove it from completedTasks!
    const restored = completedTasks.filter((ct) =>
      state.tasks.some((t) => t.id === ct.id),
    );
    if (restored.length > 0) {
      const nextCompleted = completedTasks.filter(
        (ct) => !state.tasks.some((t) => t.id === ct.id),
      );
      setCompletedTasks(nextCompleted);
      localStorage.setItem(
        "todo_completed_tasks_store",
        JSON.stringify(nextCompleted),
      );
    }
  }, [state.tasks, completedTasks]);

  // Extract all unique labels from active tasks
  const availableLabels = Array.from(
    new Set(state.tasks.flatMap((t) => t.labels || [])),
  );

  // Base list of project tasks
  let activeProjectTasks: Task[] = [];
  let completedProjectTasks: Task[] = [];

  if (isTodayView) {
    activeProjectTasks = state.tasks.filter(
      (t) => t.dueDate === toISO(startOfToday()),
    );
    completedProjectTasks = completedTasks.filter(
      (t) => t.dueDate === toISO(startOfToday()),
    );
  } else if (projectId.startsWith("filter:")) {
    const filterId = projectId.replace("filter:", "");
    const filter = state.customFilters?.find((f) => f.id === filterId);
    const query = filter ? filter.query : "";
    activeProjectTasks = state.tasks.filter((t) => matchFilterQuery(t, query));
    completedProjectTasks = completedTasks.filter((t) =>
      matchFilterQuery(t, query),
    );
  } else if (projectId.startsWith("label:")) {
    const labelName = projectId.replace("label:", "");
    activeProjectTasks = state.tasks.filter((t) =>
      t.labels?.includes(labelName),
    );
    completedProjectTasks = completedTasks.filter((t) =>
      t.labels?.includes(labelName),
    );
  } else {
    activeProjectTasks = state.tasks.filter((t) => t.projectId === projectId);
    completedProjectTasks = completedTasks.filter(
      (t) => t.projectId === projectId,
    );
  }

  const combinedTasks = [...activeProjectTasks, ...completedProjectTasks];

  // Apply filters
  const filteredTasks = combinedTasks.filter((t) => {
    // 1. Completed tasks toggle
    if (!showCompleted && t.completed) return false;

    // 2. Due date filter
    if (!isTodayView) {
      if (filterDueDate === "today") {
        const todayStr = toISO(startOfToday());
        if (t.dueDate !== todayStr) return false;
      } else if (filterDueDate === "upcoming") {
        const todayStr = toISO(startOfToday());
        if (!t.dueDate || t.dueDate <= todayStr) return false;
      } else if (filterDueDate === "nodate") {
        if (t.dueDate !== null) return false;
      }
    }

    // 3. Priority filter
    if (filterPriority !== "all") {
      if (t.priority !== filterPriority) return false;
    }

    // 4. Label filter
    if (filterLabel !== "all") {
      if (!t.labels || !t.labels.includes(filterLabel)) return false;
    }

    // 5. Workspace filter (Today view only)
    if (isTodayView && filterWorkspace !== "all") {
      const taskProj = state.projects.find((p) => p.id === t.projectId);
      if (filterWorkspace === "my") {
        if (taskProj && taskProj.group === "team") return false;
      } else if (filterWorkspace === "team") {
        if (!taskProj || taskProj.group !== "team") return false;
      }
    }

    // 6. Assignee filter (Today view only)
    if (isTodayView && filterAssignee !== "all") {
      if (filterAssignee === "none") {
        if (t.assigneeId !== null && t.assigneeId !== undefined) return false;
      } else if (filterAssignee === "me") {
        if (t.assigneeId !== "me") return false;
      }
    }

    return true;
  });

  // Apply sorting
  const tasks = sortTasks(filteredTasks, sort, sortDirection);

  const rawEmpty =
    activeProjectTasks.length === 0 && completedProjectTasks.length === 0;
  const noMatch = !rawEmpty && tasks.length === 0;

  const handleReset = () => {
    setSort("smart");
    setLayout("list");
    setGrouping("none");
    setSortDirection("asc");
    setFilterDueDate("all");
    setFilterPriority("all");
    setFilterLabel("all");
    setFilterWorkspace("all");
    setFilterAssignee("all");
  };

  const inlineEditor = (
    <div className="py-2">
      <AddTaskEditor
        onSubmit={(draft) =>
          dispatch({ type: "ADD_TASK_AT", index: addAt!, draft })
        }
        onCancel={() => dispatch({ type: "CANCEL_ADD_AT" })}
      />
    </div>
  );

  // Determine if active view settings are applied
  const activeFiltersCount =
    (sort !== "smart" ? 1 : 0) +
    (grouping !== "none" ? 1 : 0) +
    (sortDirection !== "asc" ? 1 : 0) +
    (!isTodayView && filterDueDate !== "all" ? 1 : 0) +
    (filterPriority !== "all" ? 1 : 0) +
    (filterLabel !== "all" ? 1 : 0) +
    (isTodayView && filterWorkspace !== "all" ? 1 : 0) +
    (isTodayView && filterAssignee !== "all" ? 1 : 0) +
    (showCompleted ? 1 : 0);

  return (
    <>
      {/* top bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 text-neutral-500 border-b border-neutral-100 select-none">
        <button
          onClick={() => onOpenSettings?.("members")}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold hover:bg-neutral-100 hover:text-neutral-700 transition"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-500"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
          Invite members
        </button>
        <button
          onClick={() => onOpenSettings?.("general")}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold hover:bg-neutral-100 hover:text-neutral-700 transition"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-500"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
          Settings
        </button>

        <div className="h-4 w-px bg-neutral-200 mx-1" />

        <div className="relative">
          <button
            onClick={() => setViewOpen((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold hover:bg-neutral-100 hover:text-neutral-700 transition",
              (viewOpen || activeFiltersCount > 0) && "text-brand",
            )}
          >
            <SlidersIcon />
            {activeFiltersCount > 0 ? (
              <span className="flex items-center justify-center bg-brand text-white rounded-full text-[9px] px-1.5 min-w-[16px] h-4 font-bold">
                {activeFiltersCount}
              </span>
            ) : (
              "View"
            )}
          </button>
          {viewOpen && (
            <ViewMenu
              layout={layout}
              onLayout={setLayout}
              showCompleted={showCompleted}
              onToggleCompleted={setShowCompleted}
              grouping={grouping}
              onGrouping={setGrouping}
              sort={sort}
              onSort={setSort}
              sortDirection={sortDirection}
              onSortDirection={setSortDirection}
              filterDueDate={filterDueDate}
              onFilterDueDate={setFilterDueDate}
              filterPriority={filterPriority}
              onFilterPriority={setFilterPriority}
              filterLabel={filterLabel}
              onFilterLabel={setFilterLabel}
              availableLabels={availableLabels}
              onReset={handleReset}
              onClose={() => setViewOpen(false)}
              isTodayView={isTodayView}
              filterWorkspace={filterWorkspace}
              onFilterWorkspace={setFilterWorkspace}
              filterAssignee={filterAssignee}
              onFilterAssignee={setFilterAssignee}
            />
          )}
        </div>
        {activeProject && (
          <>
            <IconButton
              label="Comments"
              onClick={() => {
                setCommentsTab("comments");
                setCommentsOpen(true);
              }}
            >
              <CommentIcon />
            </IconButton>
            <div className="relative">
              <IconButton
                label="More actions"
                onClick={() => setActionsOpen((v) => !v)}
              >
                <DotsIcon />
              </IconButton>
              {actionsOpen && (
                <ProjectActionsMenu
                  isFavorite={isFavorite}
                  projectId={projectId}
                  onClose={() => setActionsOpen(false)}
                  onToggleFavorite={() => {
                    dispatch({
                      type: "TOGGLE_PROJECT_FAVORITE",
                      id: projectId,
                    });
                    flash(
                      isFavorite
                        ? "Removed from favorites"
                        : "Added to favorites",
                    );
                  }}
                  onAddSection={() =>
                    setAddingSectionIndex(
                      state.sections.filter((s) => s.projectId === projectId)
                        .length,
                    )
                  }
                  onBrowseTemplates={() => setTemplatesOpen(true)}
                  onImportCsv={() => setImportModalOpen(true)}
                  onExportCsv={() => setExportModalOpen(true)}
                  onEmailTasks={() => setEmailTasksOpen(true)}
                  onCalendarFeed={() => setCalendarFeedOpen(true)}
                  onArchiveProject={() => setArchiveProjOpen(true)}
                  onEditProject={() => setEditProjOpen(true)}
                  onDeleteProject={() => {
                    dispatch({ type: "DELETE_PROJECT", id: projectId });
                    flash("Project deleted");
                    if (onNavigate) onNavigate("inbox");
                  }}
                  showCompleted={showCompleted}
                  onToggleCompleted={() => setShowCompleted((v) => !v)}
                  onActivityLog={() => {
                    setCommentsTab("activity");
                    setCommentsOpen(true);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-8 pb-10">
        <h1 className="text-2xl font-bold tracking-tight text-[#202020] mb-6">
          {title}
        </h1>

        {layout === "calendar" ? (
          <>
            <CalendarView
              tasks={tasks}
              onSelectTask={(id) => dispatch({ type: "OPEN_TASK", id })}
              onAddTaskOnDate={(dateStr) => setCalendarAddDate(dateStr)}
            />
            <QuickAddModal
              open={!!calendarAddDate}
              defaultDueDate={calendarAddDate}
              defaultProjectId={projectId}
              onSubmit={(draft) => dispatch({ type: "ADD_TASK", draft })}
              onClose={() => setCalendarAddDate(null)}
            />
          </>
        ) : rawEmpty ? (
          projectId === "inbox" || projectId === "today" ? (
            <div className="flex flex-col items-center">
              <AllDone
                name="Bertrand"
                type={projectId === "today" ? "today" : "inbox"}
              />
              <div className="w-full max-w-md mt-4">
                <AddTaskInline
                  destination="Inbox"
                  defaultDueDate={
                    projectId === "today" ? toISO(startOfToday()) : null
                  }
                  onSubmit={(draft) => {
                    dispatch({
                      type: "ADD_TASK",
                      draft: {
                        ...draft,
                        projectId: draft.projectId || "inbox",
                        dueDate:
                          draft.dueDate ||
                          (projectId === "today"
                            ? toISO(startOfToday())
                            : null),
                      },
                    });
                    flash("Task added to Inbox");
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <p className="py-8 text-center text-sm text-neutral-400">
                No tasks here yet.
              </p>
              <AddTaskInline
                destination={title}
                onSubmit={(draft) =>
                  dispatch({
                    type: "ADD_TASK",
                    draft: { ...draft, projectId },
                  })
                }
              />
            </div>
          )
        ) : noMatch ? (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p className="mt-3 text-sm font-semibold text-neutral-600">
              No matching tasks
            </p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Try adjustments or clear all filters to find your tasks.
            </p>
            <button
              onClick={handleReset}
              className="mt-4 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-hover transition active:scale-95 shadow-sm"
            >
              Reset all filters
            </button>
          </div>
        ) : layout === "board" ? (
          <div className="flex gap-6 mt-6 items-start overflow-x-auto pb-8 max-w-full no-scrollbar">
            {(
              [
                { id: "no-section", name: "(No Section)" },
                ...state.sections
                  .filter((s) => s.projectId === projectId)
                  .sort((a, b) => a.order - b.order),
              ] as const
            ).map((column, colIdx, allCols) => {
              const columnTasks = tasks.filter((t) =>
                column.id === "no-section"
                  ? !t.sectionId
                  : t.sectionId === column.id,
              );
              return (
                <div key={column.id} className="flex items-stretch">
                  {colIdx > 0 && (
                    <div className="group/div relative flex w-5 cursor-pointer items-center justify-center self-stretch">
                      <div className="absolute top-2 bottom-2 w-px bg-neutral-300 opacity-0 transition group-hover/div:opacity-100" />
                      <button
                        aria-label="Add section"
                        onClick={() => setAddingSectionIndex(colIdx)}
                        className="absolute z-10 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-500 opacity-0 shadow-sm transition hover:border-brand hover:text-brand group-hover/div:opacity-100"
                      >
                        <PlusIcon />
                      </button>
                    </div>
                  )}

                  {addingSectionIndex === colIdx ? (
                    <div className="self-start">{inlineSectionAddForm()}</div>
                  ) : (
                    <div className="w-[300px] shrink-0 flex flex-col group/sec">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-2 mb-4">
                        <div className="flex-1 min-w-0 pr-2">
                          {editingSectionId === column.id ? (
                            <input
                              autoFocus
                              type="text"
                              value={editSectionName}
                              onChange={(e) =>
                                setEditSectionName(e.target.value)
                              }
                              onBlur={() => handleRenameSection(column.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  handleRenameSection(column.id);
                                if (e.key === "Escape")
                                  setEditingSectionId(null);
                              }}
                              className="w-full text-xs font-bold text-[#202020] bg-white border border-neutral-300 rounded px-1.5 py-0.5 outline-none"
                            />
                          ) : (
                            <h3
                              onClick={() => {
                                if (column.id !== "no-section") {
                                  setEditingSectionId(column.id);
                                  setEditSectionName(column.name);
                                }
                              }}
                              className={cn(
                                "text-xs font-bold text-[#202020] truncate",
                                column.id !== "no-section" &&
                                  "cursor-pointer hover:underline",
                              )}
                            >
                              {column.name}
                            </h3>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-1 text-xs font-semibold text-neutral-400">
                            {columnTasks.length}
                          </span>
                          {column.id !== "no-section" && (
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setSectionOptionsOpen(
                                    sectionOptionsOpen === column.id
                                      ? null
                                      : column.id,
                                  )
                                }
                                className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 opacity-0 group-hover/sec:opacity-100 hover:bg-neutral-200 hover:text-neutral-700 transition"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  aria-hidden
                                >
                                  <circle
                                    cx="5"
                                    cy="12"
                                    r="1.8"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="12"
                                    cy="12"
                                    r="1.8"
                                    fill="currentColor"
                                  />
                                  <circle
                                    cx="19"
                                    cy="12"
                                    r="1.8"
                                    fill="currentColor"
                                  />
                                </svg>
                              </button>
                              {sectionOptionsOpen === column.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-20"
                                    onClick={() => setSectionOptionsOpen(null)}
                                  />
                                  <div className="absolute right-0 top-6 z-30 w-36 rounded-lg border border-neutral-200 bg-white py-1 text-xs shadow-lg animate-pop-in">
                                    <button
                                      onClick={() => {
                                        setEditingSectionId(column.id);
                                        setEditSectionName(column.name);
                                        setSectionOptionsOpen(null);
                                      }}
                                      className="flex w-full px-2.5 py-1.5 hover:bg-neutral-50 text-left font-medium text-neutral-700"
                                    >
                                      Rename section
                                    </button>
                                    <button
                                      onClick={() => {
                                        dispatch({
                                          type: "DELETE_SECTION",
                                          sectionId: column.id,
                                        });
                                        setSectionOptionsOpen(null);
                                      }}
                                      className="flex w-full px-2.5 py-1.5 hover:bg-red-50 text-left font-medium text-red-600 border-t border-neutral-100"
                                    >
                                      Delete section
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {columnTasks.map((task) => (
                          <BoardTaskCard key={task.id} task={task} />
                        ))}
                      </div>
                      <div className="mt-1.5">
                        <AddTaskInlineSection
                          destination={isTodayView ? "Inbox" : title}
                          sectionId={
                            column.id === "no-section" ? null : column.id
                          }
                          defaultDueDate={
                            isTodayView ? toISO(startOfToday()) : null
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {addingSectionIndex ===
            state.sections.filter((s) => s.projectId === projectId).length +
              1 ? (
              <div className="self-start">{inlineSectionAddForm()}</div>
            ) : (
              <button
                onClick={() =>
                  setAddingSectionIndex(
                    state.sections.filter((s) => s.projectId === projectId)
                      .length + 1,
                  )
                }
                className="group/add flex w-[300px] shrink-0 items-center gap-2.5 self-start rounded-xl px-3 py-2.5 text-sm font-semibold text-neutral-500 transition hover:bg-neutral-100"
              >
                <span className="text-neutral-400 group-hover/add:text-neutral-600">
                  <SectionAddIcon />
                </span>
                Add section
              </button>
            )}
          </div>
        ) : grouping === "priority" ? (
          <div className="space-y-6 mt-4">
            {([1, 2, 3, 4] as const).map((prio) => {
              const prioTasks = tasks.filter((t) => t.priority === prio);
              const prioColor = PRIORITY_META[prio].color;
              if (prioTasks.length === 0) return null;
              return (
                <div key={prio} className="animate-fade-in">
                  <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5 mb-2.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: prioColor }}
                    />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      {prio === 4 ? "No priority" : `Priority ${prio}`}
                    </h3>
                    <span className="text-[10px] bg-neutral-100 text-neutral-400 font-bold px-1.5 py-0.5 rounded ml-1">
                      {prioTasks.length}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {prioTasks.map((task) => (
                      <TaskItem key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List layout with dynamic custom sections support */
          <div className="mt-5 space-y-6">
            {(
              [
                { id: "no-section", name: "" },
                ...state.sections
                  .filter((s) => s.projectId === projectId)
                  .sort((a, b) => a.order - b.order),
              ] as const
            ).map((section) => {
              const secTasks = tasks.filter((t) =>
                section.id === "no-section"
                  ? !t.sectionId
                  : t.sectionId === section.id,
              );

              if (
                section.id === "no-section" &&
                secTasks.length === 0 &&
                state.sections.filter((s) => s.projectId === projectId).length >
                  0
              ) {
                return null;
              }

              return (
                <div key={section.id} className="space-y-2 group/sec">
                  {section.name && (
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-1 mb-2">
                      <div className="flex-1 min-w-0 pr-2">
                        {editingSectionId === section.id ? (
                          <input
                            autoFocus
                            type="text"
                            value={editSectionName}
                            onChange={(e) => setEditSectionName(e.target.value)}
                            onBlur={() => handleRenameSection(section.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleRenameSection(section.id);
                              if (e.key === "Escape") setEditingSectionId(null);
                            }}
                            className="text-xs font-bold text-[#202020] bg-white border border-neutral-300 rounded px-1.5 py-0.5 outline-none"
                          />
                        ) : (
                          <h3
                            onClick={() => {
                              setEditingSectionId(section.id);
                              setEditSectionName(section.name);
                            }}
                            className="text-xs font-bold text-neutral-400 uppercase tracking-wider cursor-pointer hover:underline"
                          >
                            {section.name}
                          </h3>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-neutral-400 px-1">
                          {secTasks.length}
                        </span>
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSectionOptionsOpen(
                                sectionOptionsOpen === section.id
                                  ? null
                                  : section.id,
                              )
                            }
                            className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 opacity-0 group-hover/sec:opacity-100 hover:bg-neutral-200 hover:text-neutral-700 transition"
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden
                            >
                              <circle
                                cx="5"
                                cy="12"
                                r="1.8"
                                fill="currentColor"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="1.8"
                                fill="currentColor"
                              />
                              <circle
                                cx="19"
                                cy="12"
                                r="1.8"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                          {sectionOptionsOpen === section.id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setSectionOptionsOpen(null)}
                              />
                              <div className="absolute right-0 top-6 z-30 w-36 rounded-lg border border-neutral-200 bg-white py-1 text-xs shadow-lg animate-pop-in">
                                <button
                                  onClick={() => {
                                    setEditingSectionId(section.id);
                                    setEditSectionName(section.name);
                                    setSectionOptionsOpen(null);
                                  }}
                                  className="flex w-full px-2.5 py-1.5 hover:bg-neutral-50 text-left font-medium text-neutral-700"
                                >
                                  Rename section
                                </button>
                                <button
                                  onClick={() => {
                                    dispatch({
                                      type: "DELETE_SECTION",
                                      sectionId: section.id,
                                    });
                                    setSectionOptionsOpen(null);
                                  }}
                                  className="flex w-full px-2.5 py-1.5 hover:bg-red-50 text-left font-medium text-red-600 border-t border-neutral-100"
                                >
                                  Delete section
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-0.5">
                    {secTasks.map((task) => {
                      const gi = state.tasks.indexOf(task);
                      return (
                        <div key={task.id}>
                          {addAt === gi && inlineEditor}
                          <TaskItem task={task} />
                        </div>
                      );
                    })}
                  </div>

                  <AddTaskInlineSection
                    destination={isTodayView ? "Inbox" : title}
                    sectionId={section.id === "no-section" ? null : section.id}
                    defaultDueDate={isTodayView ? toISO(startOfToday()) : null}
                  />
                </div>
              );
            })}

            {addingSectionIndex === -1 ? (
              inlineSectionAddForm()
            ) : (
              <button
                onClick={() => setAddingSectionIndex(-1)}
                className="group/adds flex w-full items-center gap-2 py-1 text-sm font-semibold text-neutral-400 transition hover:text-brand"
              >
                <span className="h-px flex-1 bg-transparent transition group-hover/adds:bg-brand/40" />
                <span className="flex items-center gap-1.5 opacity-0 transition group-hover/adds:opacity-100">
                  <PlusIcon /> Add section
                </span>
                <span className="h-px flex-1 bg-transparent transition group-hover/adds:bg-brand/40" />
              </button>
            )}
          </div>
        )}
      </div>

      <UndoToast />
      <ProjectCommentsDrawer
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        projectId={projectId}
        projectName={title}
        initialTab={commentsTab}
      />
      <TemplatesModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onUse={(name, sections) => {
          dispatch({ type: "IMPORT_PROJECT_TEMPLATE", projectId, sections });
          flash(`Imported template “${name}” into project`);
        }}
      />

      {activeProject && (
        <ProjectModal
          open={editProjOpen}
          onClose={() => setEditProjOpen(false)}
          project={activeProject}
          onSave={(data) => {
            dispatch({
              type: "EDIT_PROJECT",
              id: projectId,
              name: data.name,
              colorName: data.colorName,
              layout: data.layout,
              favorite: data.favorite,
            });
            flash("Project updated");
          }}
        />
      )}

      <ExportCsvModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        projectName={title}
        onDownloadCsv={downloadCsv}
      />

      <ImportCsvModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={(importedSections) => {
          dispatch({
            type: "IMPORT_PROJECT_TEMPLATE",
            projectId,
            sections: importedSections,
          });
          flash("Imported template successfully");
        }}
      />

      <EmailTasksModal
        open={emailTasksOpen}
        onClose={() => setEmailTasksOpen(false)}
        projectName={title}
      />

      <CalendarFeedModal
        open={calendarFeedOpen}
        onClose={() => setCalendarFeedOpen(false)}
        projectName={title}
      />

      <ArchiveProjectModal
        open={archiveProjOpen}
        onClose={() => setArchiveProjOpen(false)}
        projectName={title}
        onConfirm={() => {
          dispatch({ type: "ARCHIVE_PROJECT", id: projectId });
          flash(`${title} archived`);
          if (onNavigate) onNavigate("inbox");
        }}
      />

      {toast && (
        <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-3 rounded-lg bg-[#202020] px-4 py-3 text-sm text-white shadow-xl animate-pop-in">
          {toast}
        </div>
      )}
    </>
  );
}

function AddTaskInlineSection({
  destination,
  sectionId,
  defaultDueDate,
}: {
  destination: string;
  sectionId: string | null;
  defaultDueDate?: string | null;
}) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="mt-2">
        <AddTaskEditor
          destination={destination}
          hideProjectPicker={false}
          defaultDueDate={defaultDueDate}
          onSubmit={(draft) => {
            dispatch({
              type: "ADD_TASK",
              draft: {
                ...draft,
                projectId: draft.projectId || DEFAULT_PROJECT_ID,
                sectionId,
                dueDate: draft.dueDate || defaultDueDate || null,
              },
            });
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
      className="group flex w-full items-center gap-2 py-1.5 text-xs text-neutral-400 font-semibold hover:text-brand transition"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full text-brand transition group-hover:bg-brand group-hover:text-white">
        <PlusIcon />
      </span>
      Add task
    </button>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectActionsMenu({
  isFavorite,
  projectId,
  onClose,
  onToggleFavorite,
  onAddSection,
  onBrowseTemplates,
  onImportCsv,
  onExportCsv,
  onEmailTasks,
  onCalendarFeed,
  onArchiveProject,
  onEditProject,
  onDeleteProject,
  showCompleted,
  onToggleCompleted,
  onActivityLog,
}: {
  isFavorite: boolean;
  projectId: string;
  onClose: () => void;
  onToggleFavorite: () => void;
  onAddSection: () => void;
  onBrowseTemplates: () => void;
  onImportCsv: () => void;
  onExportCsv: () => void;
  onEmailTasks: () => void;
  onCalendarFeed: () => void;
  onArchiveProject: () => void;
  onEditProject: () => void;
  onDeleteProject: () => void;
  showCompleted: boolean;
  onToggleCompleted: () => void;
  onActivityLog: () => void;
}) {
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-9 z-50 w-60 rounded-lg border border-neutral-200 bg-white py-1.5 text-[#202020] shadow-xl animate-pop-in">
        {projectId !== "inbox" && (
          <>
            <MenuRow icon={<PencilIcon />} onClick={run(onEditProject)}>
              Edit project
            </MenuRow>
            <Sep />
          </>
        )}
        <MenuRow
          icon={<StarIcon filled={isFavorite} />}
          onClick={run(onToggleFavorite)}
        >
          {isFavorite ? "Remove from favorites" : "Add to favorites"}
        </MenuRow>
        <Sep />
        <MenuRow icon={<SectionIcon />} onClick={run(onAddSection)}>
          Add section
        </MenuRow>
        <Sep />
        <MenuRow icon={<TemplateIcon />} onClick={run(onBrowseTemplates)}>
          Browse templates
        </MenuRow>
        <MenuRow icon={<ImportIcon />} onClick={run(onImportCsv)}>
          Import from CSV
        </MenuRow>
        <MenuRow icon={<ExportIcon />} onClick={run(onExportCsv)}>
          Export as CSV
        </MenuRow>
        <MenuRow icon={<MailIcon />} onClick={run(onEmailTasks)}>
          Email tasks to this project
        </MenuRow>
        <MenuRow icon={<FeedIcon />} onClick={run(onCalendarFeed)}>
          Project calendar feed
        </MenuRow>
        <Sep />
        <MenuRow icon={<EyeIcon />} onClick={run(onToggleCompleted)}>
          {showCompleted ? "Hide completed tasks" : "Show completed tasks"}
        </MenuRow>
        <MenuRow icon={<ActivityIcon />} onClick={run(onActivityLog)}>
          Activity log
        </MenuRow>
        {projectId !== "inbox" && (
          <>
            <Sep />
            <MenuRow icon={<ArchiveIcon />} onClick={run(onArchiveProject)}>
              Archive project
            </MenuRow>
            <MenuRow icon={<TrashIcon />} danger onClick={run(onDeleteProject)}>
              Delete project
            </MenuRow>
          </>
        )}
      </div>
    </>
  );
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
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
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuRow({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm hover:bg-neutral-100",
        danger ? "text-brand" : "text-[#202020]",
      )}
    >
      <span className={cn(danger ? "text-brand" : "text-neutral-500")}>
        {icon}
      </span>
      {children}
    </button>
  );
}

function Sep() {
  return <div className="my-1 h-px bg-neutral-100" />;
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      {children}
    </button>
  );
}

function SlidersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.8" fill="currentColor" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      <circle cx="19" cy="12" r="1.8" fill="currentColor" />
    </svg>
  );
}
function SectionAddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="4"
        width="17"
        height="16"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 9v6M9 12h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
const m = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;
function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg {...m} aria-hidden>
      <path
        d="M12 4l2.4 5 5.6.6-4 3.8 1 5.6L12 16.6 6.9 19l1-5.6-4-3.8 5.6-.6z"
        stroke={filled ? "#eab308" : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={filled ? "#eab308" : "none"}
      />
    </svg>
  );
}
function SectionIcon() {
  return (
    <svg {...m} aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function TemplateIcon() {
  return (
    <svg {...m} aria-hidden>
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M4 9h16M9 9v11" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ImportIcon() {
  return (
    <svg {...m} aria-hidden>
      <path
        d="M12 3v11m0 0l-4-4m4 4l4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ExportIcon() {
  return (
    <svg {...m} aria-hidden>
      <path
        d="M12 14V3m0 0l-4 4m4-4l4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 19h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg {...m} aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ActivityIcon() {
  return (
    <svg {...m} aria-hidden>
      <path
        d="M3 12h4l2 6 4-14 2 8h6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg
      {...m}
      aria-hidden
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}
function FeedIcon() {
  return (
    <svg
      {...m}
      aria-hidden
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}
function ArchiveIcon() {
  return (
    <svg
      {...m}
      aria-hidden
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="21 8 21 21 3 21 3 8" />
      <rect x="1" y="3" width="22" height="5" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
