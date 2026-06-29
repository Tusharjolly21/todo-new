"use client";

import { useState, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { useTasks } from "../state";
import { ProjectModal } from "./ProjectModals";
import { ProfileMenu } from "./ProfileMenu";
import { UpgradeModal } from "./UpgradeModal";
import { TemplatesModal } from "./TemplatesModal";
import { AddTeamModal } from "./AddTeamModal";
import { toISO, startOfToday } from "../date";
import { ProductivityModal } from "./ProductivityModal";
import { matchFilterQuery } from "./FiltersLabelsView";
import { NotificationsPopover } from "./NotificationsPopover";

export type WorkspaceView = string;

interface SidebarProps {
  inboxCount: number;
  activeView: WorkspaceView;
  onNavigate: (view: WorkspaceView) => void;
  onAddTask: () => void;
  onOpenSettings: (tab: string) => void;
  onOpenResources?: () => void;
}

export function Sidebar({
  inboxCount,
  activeView,
  onNavigate,
  onAddTask,
  onOpenSettings,
  onOpenResources,
}: SidebarProps) {
  const { state, dispatch } = useTasks();
  const [profileOpen, setProfileOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const [addTeamOpen, setAddTeamOpen] = useState(false);
  const [collapsedTeams, setCollapsedTeams] = useState<Record<string, boolean>>(
    {},
  );
  const [toast, setToast] = useState<string | null>(null);
  const [productivityOpen, setProductivityOpen] = useState(false);
  const [completedList, setCompletedList] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("todo_completed_tasks_store");
      if (saved) {
        setCompletedList(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [state.tasks]);

  const todayStr = toISO(startOfToday());
  const completedTodayCount = completedList.filter(
    (t) => t.completedAt && t.completedAt.split("T")[0] === todayStr,
  ).length;
  const dailyGoal = state.productivityGoalDaily ?? 5;
  const dailyPercentage = Math.min(
    100,
    Math.round((completedTodayCount / dailyGoal) * 100),
  );

  const favorites = state.projects.filter(
    (p) => p.favorite && p.id !== "inbox" && !p.archived,
  );
  const hasFavorites =
    favorites.length > 0 ||
    (state.customFilters || []).some((f) => f.favorite) ||
    (state.customLabels || []).some((l) => l.favorite);
  // All personal projects live under "My Projects" (team workspace concept removed).
  const myProjects = state.projects.filter(
    (p) =>
      p.id !== "inbox" &&
      p.id !== "setup-team" &&
      !p.archived &&
      (p.group === "my" || p.group === "team"),
  );

  const getTaskCount = (projectId: string) => {
    return state.tasks.filter((t) => t.projectId === projectId && !t.completed)
      .length;
  };

  function addFromTemplate(
    name: string,
    sections: { name: string; tasks: string[] }[],
  ) {
    const newProjId = `p${Date.now()}`;
    dispatch({
      type: "ADD_PROJECT",
      id: newProjId,
      name,
      colorName: "Grape",
      layout: "board",
      favorite: false,
    });

    dispatch({
      type: "IMPORT_PROJECT_TEMPLATE",
      projectId: newProjId,
      sections,
    });

    onNavigate(newProjId);
    setToast(`“${name}” added to your projects`);
    setTimeout(() => setToast(null), 2600);
  }

  function handleSaveProject(data: {
    name: string;
    colorName: string;
    layout: "list" | "board" | "calendar";
    favorite: boolean;
  }) {
    const newProjId = `p${Date.now()}`;
    dispatch({
      type: "ADD_PROJECT",
      id: newProjId,
      name: data.name,
      colorName: data.colorName,
      layout: data.layout,
      favorite: data.favorite,
    });
    onNavigate(newProjId);
  }
  return (
    <aside className="flex w-[300px] shrink-0 flex-col bg-[#fcfaf8] px-3 py-3">
      {/* user row */}
      <div className="flex items-center justify-between px-2 py-1.5">
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-neutral-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d6409f] text-sm font-bold text-white">
              T
            </span>
            <span className="text-sm font-bold text-[#202020]">Tushar</span>
            <ChevronDown />
          </button>
          {profileOpen && (
            <ProfileMenu
              onClose={() => setProfileOpen(false)}
              onSettings={() => onOpenSettings("general")}
              onUpgrade={() => setUpgradeOpen(true)}
              onNavigate={onNavigate}
              onResources={onOpenResources}
            />
          )}
        </div>
        <UpgradeModal
          open={upgradeOpen}
          onClose={() => setUpgradeOpen(false)}
        />
        <div className="flex items-center gap-1 text-neutral-500">
          <div className="relative">
            <button
              onClick={() => setProductivityOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-500 relative transition"
              title="Productivity stats"
            >
              <svg className="-rotate-90 w-5 h-5">
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  className="stroke-neutral-200"
                  strokeWidth="2"
                  fill="transparent"
                />
                <circle
                  cx="10"
                  cy="10"
                  r="7"
                  className="stroke-[#dc4c3e] transition-all duration-300"
                  strokeWidth="2"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 7}
                  strokeDashoffset={
                    2 * Math.PI * 7 -
                    (dailyPercentage / 100) * (2 * Math.PI * 7)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[8px] font-extrabold text-[#202020] inset-0 flex items-center justify-center pt-0.5 select-none">
                {completedTodayCount}
              </span>
            </button>
            {productivityOpen && (
              <ProductivityModal
                onClose={() => setProductivityOpen(false)}
                onOpenSettings={onOpenSettings}
              />
            )}
          </div>
          <div className="relative">
            <IconButton
              onClick={() => onNavigate("notifications")}
              title="Notifications"
            >
              <BellIcon />
              {state.notifications &&
                state.notifications.some((n) => !n.read) && (
                  <span className="absolute right-1 top-1 flex h-1.5 w-1.5 rounded-full bg-brand" />
                )}
            </IconButton>
          </div>
          <IconButton>
            <PanelIcon />
          </IconButton>
        </div>
      </div>

      {/* add task */}
      <button
        id="sidebar-add-task"
        onClick={onAddTask}
        className="mt-2 flex items-center gap-2 px-2 py-1.5 text-sm font-bold text-brand"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white">
          <PlusIcon />
        </span>
        Add task
      </button>

      {/* primary nav */}
      <nav className="mt-1 space-y-0.5">
        <NavRow icon={<SearchIcon />} label="Search" />
        <NavRow
          id="sidebar-inbox"
          icon={<InboxIcon />}
          label="Inbox"
          count={inboxCount}
          active={activeView === "inbox"}
          onClick={() => onNavigate("inbox")}
        />
        <NavRow
          id="sidebar-today"
          icon={<CalendarIcon />}
          label="Today"
          count={
            state.tasks.filter(
              (t) => t.dueDate === toISO(startOfToday()) && !t.completed,
            ).length
          }
          active={activeView === "today"}
          onClick={() => onNavigate("today")}
        />
        <NavRow
          icon={<UpcomingIcon />}
          label="Upcoming"
          active={activeView === "upcoming"}
          onClick={() => onNavigate("upcoming")}
        />
        <NavRow
          icon={<FiltersIcon />}
          label="Filters & Labels"
          active={activeView === "filters-labels"}
          onClick={() => onNavigate("filters-labels")}
        />
      </nav>

      {/* favorites */}
      {hasFavorites && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span>Favorites</span>
            <ChevronDown />
          </div>
          <div className="mt-0.5 space-y-0.5">
            {favorites.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                  activeView === p.id
                    ? "bg-brand-tint font-semibold text-brand"
                    : "text-[#202020] hover:bg-neutral-100",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="font-bold"
                    style={{ color: activeView === p.id ? undefined : p.color }}
                  >
                    #
                  </span>
                  {p.name} {p.emoji && <span>{p.emoji}</span>}
                </span>
                <span className="text-xs text-neutral-400">
                  {getTaskCount(p.id)}
                </span>
              </button>
            ))}

            {(state.customFilters || [])
              .filter((f) => f.favorite)
              .map((f) => {
                const count = state.tasks.filter(
                  (t) => !t.completed && matchFilterQuery(t, f.query),
                ).length;
                return (
                  <button
                    key={f.id}
                    onClick={() => onNavigate(`filter:${f.id}`)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                      activeView === `filter:${f.id}`
                        ? "bg-brand-tint font-semibold text-brand"
                        : "text-[#202020] hover:bg-neutral-100",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: f.color }}
                      />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <span className="text-xs text-neutral-400">{count}</span>
                  </button>
                );
              })}

            {(state.customLabels || [])
              .filter((l) => l.favorite)
              .map((l) => {
                const count = state.tasks.filter(
                  (t) => !t.completed && t.labels?.includes(l.name),
                ).length;
                return (
                  <button
                    key={l.id}
                    onClick={() => onNavigate(`label:${l.name}`)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                      activeView === `label:${l.name}`
                        ? "bg-brand-tint font-semibold text-brand"
                        : "text-[#202020] hover:bg-neutral-100",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-neutral-400 text-xs">@</span>
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="truncate">{l.name}</span>
                    </span>
                    <span className="text-xs text-neutral-400">{count}</span>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* projects */}
      <div className="mt-5">
        <div
          className={cn(
            "group/hd flex items-center justify-between rounded-md px-2 py-1 text-xs font-semibold",
            activeView === "my-projects-overview"
              ? "bg-brand-tint text-brand"
              : "text-neutral-500",
          )}
        >
          <button
            onClick={() => onNavigate("my-projects-overview")}
            className="flex flex-1 items-center gap-2 rounded-md py-0.5 text-left hover:text-[#202020]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#84cc16] text-[10px] font-bold text-white">
              B
            </span>
            My Projects
          </button>
          <span className="flex items-center gap-0.5 relative">
            <button
              aria-label="Add project or browse templates"
              onClick={() => setPlusMenuOpen((v) => !v)}
              className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 opacity-0 transition hover:bg-neutral-200 hover:text-neutral-700 group-hover/hd:opacity-100"
            >
              <PlusIcon />
            </button>
            {plusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPlusMenuOpen(false)}
                />
                <div className="absolute right-0 top-6 z-50 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-xl animate-pop-in text-[#202020]">
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm hover:bg-neutral-100 font-semibold"
                  >
                    ➕ Add project
                  </button>
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      setTemplatesOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm hover:bg-neutral-100 font-semibold border-t border-neutral-100"
                  >
                    📋 Browse templates
                  </button>
                </div>
              </>
            )}
            <ChevronDown />
          </span>
        </div>
        <div className="mt-0.5 space-y-0.5">
          {myProjects.map((p) => (
            <button
              key={p.id}
              onClick={() => onNavigate(p.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                activeView === p.id
                  ? "bg-brand-tint font-semibold text-brand"
                  : "text-[#202020] hover:bg-neutral-100",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className="font-bold"
                  style={{ color: activeView === p.id ? undefined : p.color }}
                >
                  #
                </span>
                {p.name} {p.emoji && <span>{p.emoji}</span>}
              </span>
              <span className="text-xs text-neutral-400">
                {getTaskCount(p.id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* team workspaces */}
      {state.teams.map((team) => {
        const teamProjects = state.projects.filter(
          (p) => p.group === "team" && p.teamId === team.id && !p.archived,
        );
        const collapsed = collapsedTeams[team.id];
        const teamView = `team:${team.id}`;
        return (
          <div key={team.id} className="mt-5">
            <div
              className={cn(
                "flex items-center justify-between rounded-md px-2 py-1 text-xs font-semibold",
                activeView === teamView
                  ? "bg-brand-tint text-brand"
                  : "text-neutral-500",
              )}
            >
              <button
                onClick={() => onNavigate(teamView)}
                className="flex flex-1 items-center gap-2 py-0.5 text-left hover:text-[#202020]"
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.charAt(0).toUpperCase()}
                </span>
                {team.name}
              </button>
              <button
                aria-label="Toggle team"
                onClick={() =>
                  setCollapsedTeams((c) => ({ ...c, [team.id]: !c[team.id] }))
                }
                className={cn(
                  "transition-transform",
                  collapsed && "-rotate-90",
                )}
              >
                <ChevronDown />
              </button>
            </div>
            {!collapsed && (
              <div className="mt-0.5 space-y-0.5">
                {teamProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onNavigate(p.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                      activeView === p.id
                        ? "bg-brand-tint font-semibold text-brand"
                        : "text-[#202020] hover:bg-neutral-100",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="font-bold"
                        style={{
                          color: activeView === p.id ? undefined : p.color,
                        }}
                      >
                        #
                      </span>
                      {p.name} {p.emoji && <span>{p.emoji}</span>}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {getTaskCount(p.id)}
                    </span>
                  </button>
                ))}
                {teamProjects.length === 0 && (
                  <p className="px-2 py-1 text-xs text-neutral-400">
                    No projects yet.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* browse all projects */}
      <button
        onClick={() => setTemplatesOpen(true)}
        className="mt-4 flex items-center gap-2.5 px-2 py-1.5 text-sm font-semibold text-neutral-600 hover:text-[#202020]"
      >
        <BrowseIcon />
        Browse all projects
      </button>

      <TemplatesModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onUse={addFromTemplate}
      />

      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={handleSaveProject}
      />

      {toast && (
        <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-3 rounded-lg bg-[#202020] px-4 py-3 text-sm text-white shadow-xl animate-pop-in">
          {toast}
        </div>
      )}

      <div className="mt-auto px-2 pt-4 space-y-2 border-t border-neutral-100/60 pt-3">
        <button
          onClick={() => setAddTeamOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#202020] transition"
        >
          <PlusIcon />
          Add a team
        </button>
        <button
          onClick={onOpenResources}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-[#202020] transition pt-1.5"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-neutral-400"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m0 4h.01" />
          </svg>
          Help &amp; resources
        </button>
      </div>

      <AddTeamModal
        open={addTeamOpen}
        onClose={() => setAddTeamOpen(false)}
        onCreate={(teamName) => {
          const id = `t${Date.now()}`;
          dispatch({ type: "ADD_TEAM", id, name: teamName, color: "#d6409f" });
          onNavigate(`team:${id}`);
          setToast(`Team “${teamName}” created`);
          setTimeout(() => setToast(null), 2600);
        }}
      />
    </aside>
  );
}

function NavRow({
  id,
  icon,
  label,
  count,
  active,
  onClick,
}: {
  id?: string;
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
        active
          ? "bg-brand-tint font-semibold text-brand"
          : "text-[#202020] hover:bg-neutral-100",
      )}
    >
      <span className="flex items-center gap-2.5">
        <span className={active ? "text-brand" : "text-neutral-500"}>
          {icon}
        </span>
        <span>{label}</span>
      </span>
      {count != null && (
        <span className="text-xs text-neutral-400">{count}</span>
      )}
    </button>
  );
}

function IconButton({
  children,
  onClick,
  title,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  title?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-100",
        className,
      )}
    >
      {children}
    </button>
  );
}

/* icons */
const s = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;
function PlusIcon() {
  return (
    <svg {...s} aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg {...s} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21l-4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg {...s} aria-hidden>
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
  );
}
function CalendarIcon() {
  return (
    <svg {...s} aria-hidden>
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
function UpcomingIcon() {
  return (
    <svg {...s} aria-hidden>
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
      <path
        d="M9 14l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FiltersIcon() {
  return (
    <svg {...s} aria-hidden>
      <rect
        x="4"
        y="4"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="4"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="13"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="13"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg {...s} aria-hidden>
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
function PanelIcon() {
  return (
    <svg {...s} aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M9 4v16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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
function BrowseIcon() {
  return (
    <svg {...s} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 21l-4-4M8 11h6M11 8v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
