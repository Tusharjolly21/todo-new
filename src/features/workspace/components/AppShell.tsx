"use client";

import { useState } from "react";
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

export type WorkspaceView = string;

function Workspace() {
  const { state, dispatch } = useTasks();
  const [view, setView] = useState<WorkspaceView>("inbox");
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>("general");
  const [resourcesOpen, setResourcesOpen] = useState(false);

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
      "activity",
      "notifications",
    ].includes(view) ||
    view.startsWith("filter:") ||
    view.startsWith("label:") ||
    view.startsWith("team:");

  const activeProject = isSpecialView
    ? undefined
    : state.projects.find((p) => p.id === view);

  return (
    <div className="flex min-h-dvh bg-white">
      <Sidebar
        inboxCount={inboxCount}
        activeView={view}
        onNavigate={setView}
        onAddTask={() => setQuickAddOpen(true)}
        onOpenSettings={handleOpenSettings}
        onOpenResources={() => setResourcesOpen(true)}
      />
      <main className="flex-1 overflow-y-auto">
        {activeProject && (
          <InboxView
            projectId={view}
            title={activeProject.name}
            onNavigate={setView}
            onOpenSettings={handleOpenSettings}
          />
        )}
        {view === "today" && (
          <InboxView
            projectId="today"
            title="Today"
            onNavigate={setView}
            onOpenSettings={handleOpenSettings}
          />
        )}
        {view === "upcoming" && <UpcomingView />}
        {view === "filters-labels" && (
          <FiltersLabelsView onNavigate={setView} />
        )}
        {view === "activity" && <ActivityFeedView />}
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
