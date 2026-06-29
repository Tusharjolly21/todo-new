"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { WorkspaceView } from "./AppShell";
import { UpgradeModal } from "./UpgradeModal";
import {
  AddFolderModal,
  ProjectModal,
  MoveIntoFolderModal,
} from "./ProjectModals";
import { TeamSettingsModal } from "./TeamSettingsModal";
import { useTasks } from "../state";
import { CURRENT_TEAM, teamInitial } from "../team";

const FILTERS = ["Joined", "Projects I haven't joined"] as const;

export function TeamWorkspaceView({
  onNavigate,
  variant = "team",
  teamId,
}: {
  onNavigate: (view: WorkspaceView) => void;
  variant?: "team" | "my";
  teamId?: string;
}) {
  const { state, dispatch } = useTasks();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [rowMenuFor, setRowMenuFor] = useState<string | null>(null);
  const [moveFolderFor, setMoveFolderFor] = useState<string | null>(null);
  const [teamSettingsOpen, setTeamSettingsOpen] = useState(false);

  const isTeam = variant === "team";
  const group = isTeam ? "team" : "my";
  const activeTeam = isTeam
    ? (state.teams.find((t) => t.id === teamId) ?? CURRENT_TEAM)
    : null;
  const headerName = activeTeam ? activeTeam.name : "My Projects";
  const headerColor = activeTeam ? activeTeam.color : "#84cc16";
  const headerInitial = activeTeam ? teamInitial(activeTeam.name) : "B";

  const q = query.trim().toLowerCase();
  const teamProjects = state.projects.filter(
    (p) =>
      (isTeam
        ? p.group === "team" && (!teamId || p.teamId === teamId)
        : p.group === "my") &&
      p.id !== "inbox" &&
      p.id !== "setup-team" &&
      !p.archived &&
      p.name.toLowerCase().includes(q),
  );

  // Projects already placed in a folder, and the folders to render.
  const foldered = new Set(state.folders.flatMap((f) => f.projectIds));
  const ungrouped = teamProjects.filter((p) => !foldered.has(p.id));
  const projectCount = teamProjects.length;

  const ProjectRow = ({ id, name }: { id: string; name: string }) => (
    <div className="group flex w-full items-center gap-3 rounded-md px-3 py-3 hover:bg-neutral-100">
      <button
        onClick={() => onNavigate(id)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="text-lg font-bold text-neutral-400">#</span>
        <span className="block truncate text-sm font-medium text-[#202020]">
          {name}
        </span>
      </button>
      <div className="relative">
        <button
          aria-label="Project actions"
          onClick={() => setRowMenuFor((cur) => (cur === id ? null : id))}
          className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 opacity-0 transition hover:bg-neutral-200 hover:text-neutral-700 group-hover:opacity-100"
        >
          <DotsIcon />
        </button>
        {rowMenuFor === id && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setRowMenuFor(null)}
            />
            <div className="absolute right-0 top-8 z-40 w-44 rounded-lg border border-neutral-200 bg-white py-1 shadow-xl animate-pop-in">
              <button
                onClick={() => {
                  setRowMenuFor(null);
                  setMoveFolderFor(id);
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#202020] hover:bg-neutral-50"
              >
                <FolderIcon /> Move to folder
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      {/* top bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 text-sm text-neutral-600">
        {isTeam && (
          <>
            <TopBtn>
              <PeopleIcon /> Invite members
            </TopBtn>
            <TopBtn onClick={() => setTeamSettingsOpen(true)}>
              <GearIcon /> Settings
            </TopBtn>
          </>
        )}
      </div>

      <div className="mx-auto w-full max-w-4xl px-8 pb-16">
        {/* header */}
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-bold text-white"
            style={{ backgroundColor: headerColor }}
          >
            {headerInitial}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
            {headerName}
          </h1>
        </div>
        {isTeam ? (
          <p className="mt-1 text-sm text-neutral-500">
            Team workspace ·{" "}
            <button
              onClick={() => setUpgradeOpen(true)}
              className="hover:text-[#202020] hover:underline"
            >
              Upgrade to Business
            </button>{" "}
            ·{" "}
            <button className="hover:text-[#202020] hover:underline">
              Send feedback
            </button>
          </p>
        ) : (
          <p className="mt-1 text-sm text-neutral-500">Personal workspace</p>
        )}

        {/* search */}
        <div className="mt-5 flex items-center gap-2 rounded-md border border-neutral-300 px-3 py-2.5 focus-within:border-brand">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full text-sm outline-none placeholder:text-neutral-400"
          />
        </div>

        {/* filters */}
        <div className="mt-3 flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            Active projects <Chevron />
          </button>
          {isTeam &&
            FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(activeFilter === f ? null : f)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm font-medium",
                  activeFilter === f
                    ? "border-brand bg-brand-tint text-brand"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-50",
                )}
              >
                {f}
              </button>
            ))}
          <div className="relative ml-auto">
            <button
              onClick={() => setAddMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
            >
              <PlusIcon /> Add
            </button>
            {addMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setAddMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-30 mt-1 w-44 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-xl animate-pop-in">
                  <button
                    onClick={() => {
                      setAddMenuOpen(false);
                      setProjectModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#202020] hover:bg-neutral-50"
                  >
                    <HashIcon /> Add project
                  </button>
                  <button
                    onClick={() => {
                      setAddMenuOpen(false);
                      setFolderModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#202020] hover:bg-neutral-50"
                  >
                    <FolderIcon /> Add folder
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* count + sort */}
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#202020]">
            {projectCount} project{projectCount === 1 ? "" : "s"}
          </span>
          <button className="flex items-center gap-1 text-sm text-neutral-500 hover:text-[#202020]">
            Sort: A-Z <Chevron />
          </button>
        </div>

        {/* project list */}
        <div className="mt-2">
          {/* folders */}
          {state.folders.map((folder) => {
            const inFolder = teamProjects.filter((p) =>
              folder.projectIds.includes(p.id),
            );
            return (
              <div key={folder.id} className="mb-1">
                <div className="flex items-center gap-2 rounded-md px-3 py-2.5">
                  <FolderIcon />
                  <span className="text-sm font-semibold text-[#202020]">
                    {folder.name}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {inFolder.length}
                  </span>
                </div>
                <div className="ml-4 border-l border-neutral-200 pl-2">
                  {inFolder.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-neutral-400">
                      No projects in this folder.
                    </p>
                  ) : (
                    inFolder.map((p) => (
                      <ProjectRow key={p.id} id={p.id} name={p.name} />
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* ungrouped projects */}
          {ungrouped.map((p) => (
            <ProjectRow key={p.id} id={p.id} name={p.name} />
          ))}

          {projectCount === 0 && state.folders.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-neutral-400">
              No projects match your filters.
            </p>
          )}
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />

      <AddFolderModal
        open={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        projects={teamProjects.map((p) => ({ id: p.id, name: p.name }))}
        onAdd={(name, projectIds) =>
          dispatch({ type: "ADD_FOLDER", name, projectIds })
        }
      />

      <MoveIntoFolderModal
        open={moveFolderFor !== null}
        onClose={() => setMoveFolderFor(null)}
        projectName={
          state.projects.find((p) => p.id === moveFolderFor)?.name ?? ""
        }
        folders={state.folders.map((f) => ({ id: f.id, name: f.name }))}
        currentFolderId={
          state.folders.find(
            (f) => moveFolderFor && f.projectIds.includes(moveFolderFor),
          )?.id ?? null
        }
        onMove={(folderId) => {
          if (moveFolderFor)
            dispatch({
              type: "MOVE_PROJECT_TO_FOLDER",
              projectId: moveFolderFor,
              folderId,
            });
        }}
      />

      <ProjectModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSave={(data) =>
          dispatch({
            type: "ADD_PROJECT",
            name: data.name,
            colorName: data.colorName,
            layout: data.layout,
            favorite: data.favorite,
            group,
            teamId: isTeam ? teamId : undefined,
          })
        }
      />

      {isTeam && activeTeam && (
        <TeamSettingsModal
          open={teamSettingsOpen}
          onClose={() => setTeamSettingsOpen(false)}
          team={activeTeam}
          onDelete={(id) => {
            dispatch({ type: "DELETE_TEAM", id });
            onNavigate("inbox");
          }}
          onLeave={(id) => {
            dispatch({ type: "DELETE_TEAM", id });
            onNavigate("inbox");
          }}
        />
      )}
    </div>
  );
}

function TopBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-medium hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}

function PeopleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 19c0-3 2.5-5 6-5s6 2 6 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 7a3 3 0 010 6M17.5 19c0-2.5-1-4-3-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19 12a7 7 0 00-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 00-1.7-1l-.3-2.6h-4l-.3 2.6a7 7 0 00-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 000 2l-2 1.5 2 3.4 2.3-1a7 7 0 001.7 1l.3 2.6h4l.3-2.6a7 7 0 001.7-1l2.3 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-400"
    >
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
function FolderIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-500"
    >
      <path
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function HashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-500"
    >
      <path
        d="M9 4L7 20M17 4l-2 16M4 9h16M3 15h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Chevron() {
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
function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="19" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}
