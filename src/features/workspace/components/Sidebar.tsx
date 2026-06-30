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
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenProductivityReport?: () => void;
  onOpenFocusTimer?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenSearch?: () => void;
}

export function Sidebar({
  inboxCount,
  activeView,
  onNavigate,
  onAddTask,
  onOpenSettings,
  onOpenResources,
  sidebarOpen,
  onToggleSidebar,
  onOpenProductivityReport,
  onOpenFocusTimer,
  searchQuery,
  setSearchQuery,
  onOpenSearch,
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
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);
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
    <aside
      className={cn(
        "flex shrink-0 flex-col bg-neutral-50 border-r border-neutral-200/60 dark:bg-[#0c0c0c] dark:border-neutral-900/60 transition-all duration-300 ease-in-out select-none",
        sidebarOpen
          ? "w-[290px] px-4 py-4.5"
          : "w-0 px-0 py-0 border-r-0 overflow-hidden opacity-0 pointer-events-none",
      )}
    >
      {/* user row */}
      <div className="flex items-center justify-between px-1 py-1.5">
        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-900 transition"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-200 dark:bg-neutral-800 text-sm font-bold text-neutral-800 dark:text-white shadow-sm border border-neutral-300/30 dark:border-neutral-700/30">
              T
            </span>
            <span className="text-sm font-bold text-neutral-800 dark:text-white">
              Tushar
            </span>
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
        <div className="flex items-center gap-1.5 text-neutral-500">
          <div className="relative">
            <button
              onClick={() => setProductivityOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-200/60 dark:hover:bg-neutral-900 text-neutral-500 dark:text-neutral-400 relative transition"
              title="Productivity stats"
            >
              <TrendsIcon />
              {completedTodayCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white shadow-md border border-neutral-50 dark:border-neutral-900">
                  {completedTodayCount}
                </span>
              )}
            </button>
            {productivityOpen && (
              <ProductivityModal
                onClose={() => setProductivityOpen(false)}
                onOpenSettings={onOpenSettings}
                onOpenReport={() => {
                  setProductivityOpen(false);
                  onOpenProductivityReport?.();
                }}
              />
            )}
          </div>
          <div className="relative">
            <IconButton
              onClick={() => onNavigate("notifications")}
              title="Notifications"
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
            >
              <BellIcon />
              {state.notifications &&
                state.notifications.some((n) => !n.read) && (
                  <span className="absolute right-1 top-1 flex h-1.5 w-1.5 rounded-full bg-brand" />
                )}
            </IconButton>
          </div>
          <div className="relative">
            <IconButton
              onClick={onOpenFocusTimer}
              title="Focus Timer"
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
            >
              <FocusTimerIcon />
            </IconButton>
          </div>
          <IconButton
            onClick={onToggleSidebar}
            title="Collapse sidebar"
            className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
          >
            <PanelIcon />
          </IconButton>
        </div>
      </div>

      {/* add task */}
      <button
        id="sidebar-add-task"
        onClick={onAddTask}
        className="mt-3.5 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-neutral-100/80 border border-neutral-200 text-sm font-bold text-neutral-700 dark:bg-neutral-900 dark:border-neutral-800/85 dark:hover:bg-neutral-800 dark:text-white transition-all shadow-xs"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-100 dark:bg-white/10 text-neutral-500 dark:text-white border border-neutral-200 dark:border-transparent">
          <PlusIcon />
        </span>
        Add task
      </button>

      {/* primary nav */}
      <nav className="mt-4 space-y-0.5">
        <NavRow
          icon={<SearchIcon />}
          label="Search"
          active={false}
          onClick={onOpenSearch}
        />
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
        <NavRow
          icon={<ChartIcon />}
          label="Reporting"
          active={activeView === "reporting"}
          onClick={() => onNavigate("reporting")}
        />
      </nav>

      {/* favorites */}
      {hasFavorites && (
        <div className="mt-5">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">
            <span>Favorites</span>
            <ChevronDown />
          </div>
          <div className="mt-1 space-y-0.5">
            {favorites.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                  activeView === p.id
                    ? "bg-neutral-200/70 font-bold text-neutral-900 dark:bg-neutral-800/60 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/30 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="font-bold text-neutral-500"
                    style={{
                      color: activeView === p.id ? undefined : p.color,
                    }}
                  >
                    #
                  </span>
                  {p.name} {p.emoji && <span>{p.emoji}</span>}
                </span>
                <span className="text-xs text-neutral-500 font-bold">
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
                        ? "bg-neutral-200/70 font-bold text-neutral-900 dark:bg-neutral-800/60 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/30 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: f.color }}
                      />
                      <span className="truncate">{f.name}</span>
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">
                      {count}
                    </span>
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
                        ? "bg-neutral-200/70 font-bold text-neutral-900 dark:bg-neutral-800/60 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/30 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-neutral-500 text-xs">@</span>
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="truncate">{l.name}</span>
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">
                      {count}
                    </span>
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
            "group/hd flex items-center justify-between rounded-lg px-2 py-1 text-[12px] font-bold uppercase tracking-wider",
            activeView === "my-projects-overview"
              ? "text-neutral-900 dark:text-white"
              : "text-neutral-500",
          )}
        >
          <button
            onClick={() => onNavigate("my-projects-overview")}
            className="flex flex-1 items-center gap-2.5 rounded-md py-0.5 text-left hover:text-neutral-900 dark:hover:text-white font-bold"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-500 dark:text-neutral-400 shrink-0"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            Projects
          </button>
          <span className="flex items-center gap-0.5 relative">
            <button
              aria-label="Add project or browse templates"
              onClick={() => setPlusMenuOpen((v) => !v)}
              className="flex h-5 w-5 items-center justify-center rounded text-neutral-500 opacity-0 transition hover:bg-neutral-200/50 dark:hover:bg-neutral-850 hover:text-neutral-800 dark:hover:text-neutral-200 group-hover/hd:opacity-100"
            >
              <PlusIcon />
            </button>
            {plusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPlusMenuOpen(false)}
                />
                <div className="absolute right-0 top-6 z-50 w-44 rounded-lg border border-neutral-200 bg-white dark:border-neutral-850 dark:bg-neutral-900 py-1 shadow-xl animate-pop-in text-neutral-700 dark:text-neutral-300">
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-neutral-500"
                    >
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add project
                  </button>
                  <button
                    onClick={() => {
                      setPlusMenuOpen(false);
                      setTemplatesOpen(true);
                    }}
                    className="flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold border-t border-neutral-100 dark:border-neutral-800"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 text-neutral-500"
                    >
                      <rect
                        x="8"
                        y="2"
                        width="8"
                        height="4"
                        rx="1"
                        ry="1"
                      ></rect>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    </svg>
                    Browse templates
                  </button>
                </div>
              </>
            )}
            <button
              aria-label="Toggle projects list"
              onClick={() => setProjectsCollapsed((c) => !c)}
              className={cn(
                "transition-transform p-0.5 hover:bg-neutral-200/50 dark:hover:bg-neutral-850 rounded text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200",
                projectsCollapsed && "-rotate-90",
              )}
            >
              <ChevronDown />
            </button>
          </span>
        </div>
        {!projectsCollapsed && (
          <div className="mt-1.5 space-y-0.5">
            {myProjects.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                  activeView === p.id
                    ? "bg-neutral-200/70 font-bold text-neutral-900 dark:bg-neutral-800/60 dark:text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/30 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="font-bold text-neutral-500"
                    style={{
                      color: activeView === p.id ? undefined : p.color,
                    }}
                  >
                    #
                  </span>
                  {p.name} {p.emoji && <span>{p.emoji}</span>}
                </span>
                <span className="text-xs text-neutral-500 font-bold">
                  {getTaskCount(p.id)}
                </span>
              </button>
            ))}
          </div>
        )}
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
                "flex items-center justify-between rounded-lg px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest",
                activeView === teamView
                  ? "text-neutral-900 dark:text-white"
                  : "text-neutral-500",
              )}
            >
              <button
                onClick={() => onNavigate(teamView)}
                className="flex flex-1 items-center gap-2 py-0.5 text-left hover:text-neutral-900 dark:hover:text-white"
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
              <div className="mt-1.5 space-y-0.5">
                {teamProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onNavigate(p.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm",
                      activeView === p.id
                        ? "bg-neutral-200/70 font-bold text-neutral-900 dark:bg-neutral-800/60 dark:text-white"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/30 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="font-bold text-neutral-500"
                        style={{
                          color: activeView === p.id ? undefined : p.color,
                        }}
                      >
                        #
                      </span>
                      {p.name} {p.emoji && <span>{p.emoji}</span>}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold">
                      {getTaskCount(p.id)}
                    </span>
                  </button>
                ))}
                {teamProjects.length === 0 && (
                  <p className="px-2.5 py-1 text-xs text-neutral-500">
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
        className="mt-5 flex items-center gap-2.5 px-2.5 py-1.5 text-sm font-semibold text-neutral-500 hover:text-neutral-200 transition"
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
          ? "bg-neutral-200/70 font-bold text-neutral-900 dark:bg-neutral-800/60 dark:text-white"
          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/30 dark:hover:bg-neutral-900/50 hover:text-neutral-900 dark:hover:text-neutral-200",
      )}
    >
      <span className="flex items-center gap-2.5">
        <span
          className={
            active
              ? "text-neutral-900 dark:text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }
        >
          {icon}
        </span>
        <span>{label}</span>
      </span>
      {count != null && (
        <span className="text-xs text-neutral-500 font-bold">{count}</span>
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
function TrendsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  );
}
function FocusTimerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="shrink-0"
    >
      <path d="M224,200H200V120a8,8,0,0,0-8-8H168a8,8,0,0,0-8,8v80H136V40a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8V200H72V152a8,8,0,0,0-8-8H40a8,8,0,0,0-8,8v48H24a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM48,200V160H56v40Zm64,0V48h8v152Zm64,0V128h8v72Z" />
    </svg>
  );
}
