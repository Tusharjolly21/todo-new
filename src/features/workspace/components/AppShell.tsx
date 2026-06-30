"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { TasksProvider, useTasks } from "../state";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { InboxView } from "./InboxView";
import { QuickAddModal } from "./QuickAddModal";
import { Sidebar } from "./Sidebar";
import { TaskDetailModal } from "./TaskDetailModal";
import { TeamWorkspaceView } from "./TeamWorkspaceView";
import { ProductTour } from "./ProductTour";
import { SettingsModal } from "./SettingsModal";
import { UpcomingView } from "./UpcomingView";
import { FiltersLabelsView } from "./FiltersLabelsView";
import { ActivityFeedView } from "./ActivityFeedView";
import { NotificationsView } from "./NotificationsView";
import { ResourcesModal } from "./ResourcesModal";
import { ProductivityReportModal } from "./ProductivityReportModal";
import { FocusTimerModal } from "./FocusTimerModal";
import { SearchPopup } from "./SearchPopup";

export type WorkspaceView = string;

function Workspace() {
  const { state, dispatch } = useTasks();
  const [view, setView] = useState<WorkspaceView>("inbox");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>("general");
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productivityReportOpen, setProductivityReportOpen] = useState(false);
  const [focusTimerOpen, setFocusTimerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPopupOpen, setSearchPopupOpen] = useState(false);

  // Global window event listener to toggle search popup on Ctrl+K / Cmd+K triggers
  useEffect(() => {
    const handleToggle = () => setSearchPopupOpen((v) => !v);
    window.addEventListener("toggle-global-search", handleToggle);
    return () =>
      window.removeEventListener("toggle-global-search", handleToggle);
  }, []);

  const inboxCount = state.tasks.filter(
    (t) => t.projectId === "inbox" && !t.completed,
  ).length;

  const handleOpenSettings = (tab: string) => {
    setView("inbox"); // close custom views when settings change
    setSettingsTab(tab);
    setSettingsOpen(true);
  };

  const isSpecialView =
    [
      "my-projects-overview",
      "today",
      "upcoming",
      "filters-labels",
      "reporting",
      "notifications",
    ].includes(view) ||
    view.startsWith("filter:") ||
    view.startsWith("label:") ||
    view.startsWith("team:");

  const activeProject = isSpecialView
    ? undefined
    : state.projects.find((p) => p.id === view);

  return (
    <div className="flex min-h-dvh bg-[#fafafa]">
      <Sidebar
        inboxCount={inboxCount}
        activeView={view}
        onNavigate={setView}
        onAddTask={() => setQuickAddOpen(true)}
        onOpenSettings={handleOpenSettings}
        onOpenResources={() => setResourcesOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(false)}
        onOpenProductivityReport={() => setProductivityReportOpen(true)}
        onOpenFocusTimer={() => setFocusTimerOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSearch={() => setSearchPopupOpen(true)}
      />
      <main className="flex-1 overflow-y-auto bg-[#fafafa] relative">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4.5 left-4.5 z-40 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white shadow-xs hover:bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:border-neutral-850 dark:hover:bg-neutral-800 dark:text-neutral-400 transition cursor-pointer"
            title="Show sidebar"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
            </svg>
          </button>
        )}
        {activeProject && (
          <InboxView
            projectId={view}
            title={activeProject.name}
            onNavigate={setView}
            onOpenSettings={handleOpenSettings}
            searchQuery={searchQuery}
          />
        )}
        {view === "today" && (
          <InboxView
            projectId="today"
            title="Today"
            onNavigate={setView}
            onOpenSettings={handleOpenSettings}
            searchQuery={searchQuery}
          />
        )}
        {view === "upcoming" && <UpcomingView />}
        {view === "filters-labels" && (
          <FiltersLabelsView onNavigate={setView} />
        )}
        {view === "reporting" && <ActivityFeedView />}
        {view === "notifications" && <NotificationsView />}
        {(view.startsWith("filter:") || view.startsWith("label:")) && (
          <InboxView
            projectId={view}
            title={
              view.startsWith("filter:")
                ? state.customFilters?.find(
                    (f) => f.id === view.replace("filter:", ""),
                  )?.name || "Filter Results"
                : `@${view.replace("label:", "")}`
            }
            onNavigate={setView}
            onOpenSettings={handleOpenSettings}
            searchQuery={searchQuery}
          />
        )}
        {view === "my-projects-overview" && (
          <TeamWorkspaceView onNavigate={setView} variant="my" />
        )}
        {view.startsWith("team:") && (
          <TeamWorkspaceView
            onNavigate={setView}
            variant="team"
            teamId={view.replace("team:", "")}
          />
        )}
        {!activeProject && !isSpecialView && (
          <div className="mx-auto max-w-3xl px-8 py-20 text-center">
            <p className="text-sm text-neutral-400">
              This project no longer exists.
            </p>
            <button
              onClick={() => setView("inbox")}
              className="mt-3 rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Go to Inbox
            </button>
          </div>
        )}
      </main>
      <TaskDetailModal />
      <ConfirmDeleteModal />
      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={(draft) => {
          dispatch({ type: "ADD_TASK", draft });
          setView("inbox");
        }}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab={settingsTab as any}
      />
      <ResourcesModal
        open={resourcesOpen}
        onClose={() => setResourcesOpen(false)}
      />
      <ProductivityReportModal
        open={productivityReportOpen}
        onClose={() => setProductivityReportOpen(false)}
      />
      <FocusTimerModal
        open={focusTimerOpen}
        onClose={() => setFocusTimerOpen(false)}
      />
      <SearchPopup
        open={searchPopupOpen}
        onClose={() => setSearchPopupOpen(false)}
        onNavigate={setView}
        onOpenSettings={handleOpenSettings}
        onOpenFocusTimer={() => setFocusTimerOpen(true)}
      />
      <ProductTour />
    </div>
  );
}

export function AppShell() {
  return (
    <TasksProvider>
      <Workspace />
    </TasksProvider>
  );
}
