"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type Dispatch,
  type ReactNode,
} from "react";
import { SEED_TASKS } from "./data";
import { DEFAULT_PROJECTS, getProjectColor } from "./projects";
import type {
  Task,
  TaskAction,
  TaskDraft,
  TasksState,
  ProjectRef,
  SectionRef,
  FolderRef,
  TeamRef,
} from "./types";

const initialState: TasksState = {
  tasks: SEED_TASKS,
  projects: DEFAULT_PROJECTS,
  sections: [],
  folders: [],
  teams: [],
  customFilters: [
    {
      id: "f-assigned-me",
      name: "Assigned to me",
      query: "assigned: me",
      color: "#246fe0",
      colorName: "blue",
      favorite: false,
    },
    {
      id: "f-priority-1",
      name: "Priority 1",
      query: "priority: 1",
      color: "#de4c4a",
      colorName: "red",
      favorite: false,
    },
    {
      id: "f-no-due",
      name: "No due date",
      query: "no date",
      color: "#777777",
      colorName: "grey",
      favorite: false,
    },
  ],
  customLabels: [
    {
      id: "l-work",
      name: "work",
      color: "#eab308",
      colorName: "Yellow",
      favorite: false,
    },
    {
      id: "l-personal",
      name: "personal",
      color: "#22c55e",
      colorName: "Mint Green",
      favorite: false,
    },
  ],
  activityLog: [],
  notifications: [
    {
      id: "n-seed-1",
      text: "Tushar added Bertrand to the project Nicelydone.",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
      read: false,
      projectName: "Nicelydone",
      actorName: "Tushar",
    },
    {
      id: "n-seed-2",
      text: 'Tushar commented on "Sociology (optional)": "Need some help with this" in Nicelydone.',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
      read: false,
      projectName: "Nicelydone",
      actorName: "Tushar",
    },
    {
      id: "n-seed-3",
      text: 'Tushar assigned a task to you: "I.S Mains video" in Nicelydone.',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
      read: false,
      projectName: "Nicelydone",
      actorName: "Tushar",
    },
  ],
  productivityGoalDaily: 5,
  productivityGoalWeekly: 30,
  vacationMode: false,
  pendingUndo: null,
  selectedId: null,
  confirmDeleteId: null,
  addingAtIndex: null,
};

function makeTask(draft: TaskDraft): Task {
  return {
    id: `t${Date.now()}`,
    title: draft.title,
    description: draft.description || undefined,
    projectId: draft.projectId ?? "inbox",
    sectionId: draft.sectionId ?? null,
    dueDate: draft.dueDate,
    dueTime: draft.dueTime ?? null,
    duration: draft.duration ?? null,
    priority: draft.priority,
    assigneeId: draft.assigneeId ?? null,
    labels: draft.labels ?? [],
    reminders: draft.reminders ?? [],
    completed: false,
    completedAt: null,
  };
}

function logActivity(
  actionType: "complete" | "add" | "delete" | "edit" | "comment" | "uncomplete",
  taskTitle?: string,
  projectId?: string,
  projectName?: string,
) {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    actionType,
    taskTitle,
    projectId,
    projectName,
    timestamp: new Date().toISOString(),
  };
}

function appendActivity(
  state: TasksState,
  actionType: "complete" | "add" | "delete" | "edit" | "comment" | "uncomplete",
  taskTitle?: string,
  projectId?: string,
  projectName?: string,
): TasksState {
  const newActivity = logActivity(
    actionType,
    taskTitle,
    projectId,
    projectName,
  );
  const log = [newActivity, ...(state.activityLog || [])].slice(0, 100);
  return { ...state, activityLog: log };
}

function tasksReducer(state: TasksState, action: TaskAction): TasksState {
  switch (action.type) {
    case "COMPLETE": {
      const index = state.tasks.findIndex((t) => t.id === action.id);
      if (index === -1) return state;
      const task = {
        ...state.tasks[index],
        completed: true,
        completedAt: new Date().toISOString(),
      };
      const nextState = {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
        pendingUndo: { kind: "completed" as const, task, index },
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
      return appendActivity(
        nextState,
        "complete",
        task.title,
        task.projectId,
        state.projects.find((p) => p.id === task.projectId)?.name,
      );
    }

    case "DELETE_TASK": {
      const index = state.tasks.findIndex((t) => t.id === action.id);
      if (index === -1) return state;
      const task = state.tasks[index];
      const nextState = {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.id),
        pendingUndo: { kind: "deleted" as const, task, index },
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        confirmDeleteId: null,
      };
      return appendActivity(
        nextState,
        "delete",
        task.title,
        task.projectId,
        state.projects.find((p) => p.id === task.projectId)?.name,
      );
    }

    case "REQUEST_DELETE":
      return { ...state, confirmDeleteId: action.id };

    case "CANCEL_DELETE":
      return { ...state, confirmDeleteId: null };

    case "START_ADD_AT":
      return { ...state, addingAtIndex: action.index };

    case "CANCEL_ADD_AT":
      return { ...state, addingAtIndex: null };

    case "ADD_TASK_AT": {
      const newTask = makeTask(action.draft);
      const tasks = [...state.tasks];
      tasks.splice(action.index, 0, newTask);
      const nextState = { ...state, tasks, addingAtIndex: null };
      return appendActivity(
        nextState,
        "add",
        newTask.title,
        newTask.projectId,
        state.projects.find((p) => p.id === newTask.projectId)?.name,
      );
    }

    case "DUPLICATE_TASK": {
      const index = state.tasks.findIndex((t) => t.id === action.id);
      if (index === -1) return state;
      const copy: Task = {
        ...state.tasks[index],
        id: `t${Date.now()}`,
        completed: false,
      };
      const tasks = [...state.tasks];
      tasks.splice(index + 1, 0, copy);
      return { ...state, tasks };
    }

    case "UPDATE_TASK": {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task) return state;
      const nextState = {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                title: action.title ?? t.title,
                description: action.description ?? t.description,
              }
            : t,
        ),
      };
      return appendActivity(
        nextState,
        "edit",
        action.title ?? task.title,
        task.projectId,
        state.projects.find((p) => p.id === task.projectId)?.name,
      );
    }

    case "SET_DUE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, dueDate: action.dueDate } : t,
        ),
      };

    case "SET_TIME":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? { ...t, dueTime: action.dueTime, duration: action.duration }
            : t,
        ),
      };

    case "SET_PRIORITY":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, priority: action.priority } : t,
        ),
      };

    case "SET_PROJECT": {
      const task = state.tasks.find((t) => t.id === action.id);
      if (!task || task.projectId === action.projectId) return state;
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? { ...t, projectId: action.projectId, sectionId: null }
            : t,
        ),
        pendingUndo: {
          kind: "moved",
          id: action.id,
          prevProjectId: task.projectId,
          projectName:
            state.projects.find((p) => p.id === action.projectId)?.name ||
            "Inbox",
        },
      };
    }

    case "SET_ASSIGNEE":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, assigneeId: action.assigneeId } : t,
        ),
      };

    case "SET_LABELS":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, labels: action.labels } : t,
        ),
      };

    case "SET_REMINDERS":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, reminders: action.reminders } : t,
        ),
      };

    case "OPEN_TASK":
      return { ...state, selectedId: action.id };

    case "CLOSE_TASK":
      return { ...state, selectedId: null };

    case "UNDO": {
      const u = state.pendingUndo;
      if (!u) return state;
      if (u.kind === "moved") {
        return {
          ...state,
          tasks: state.tasks.map((t) =>
            t.id === u.id ? { ...t, projectId: u.prevProjectId } : t,
          ),
          pendingUndo: null,
        };
      }
      const tasks = [...state.tasks];
      tasks.splice(u.index, 0, {
        ...u.task,
        completed: false,
        completedAt: null,
      });
      const nextState = { ...state, tasks, pendingUndo: null };
      if (u.kind === "completed") {
        return appendActivity(
          nextState,
          "uncomplete",
          u.task.title,
          u.task.projectId,
          state.projects.find((p) => p.id === u.task.projectId)?.name,
        );
      } else {
        return appendActivity(
          nextState,
          "add",
          u.task.title,
          u.task.projectId,
          state.projects.find((p) => p.id === u.task.projectId)?.name,
        );
      }
    }

    case "DISMISS_UNDO":
      return { ...state, pendingUndo: null };

    case "ADD_TASK": {
      const newTask = makeTask(action.draft);
      const nextState = { ...state, tasks: [...state.tasks, newTask] };
      return appendActivity(
        nextState,
        "add",
        newTask.title,
        newTask.projectId,
        state.projects.find((p) => p.id === newTask.projectId)?.name,
      );
    }

    case "SET_TASKS_EXTERNAL":
      return { ...state, tasks: action.tasks };

    case "ADD_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                subtasks: [
                  ...(t.subtasks || []),
                  {
                    id: `s${Date.now()}`,
                    title: action.title,
                    completed: false,
                  },
                ],
              }
            : t,
        ),
      };

    case "TOGGLE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                subtasks: (t.subtasks || []).map((st) =>
                  st.id === action.subtaskId
                    ? { ...st, completed: !st.completed }
                    : st,
                ),
              }
            : t,
        ),
      };

    case "ADD_COMMENT": {
      const newComment = {
        id: `c${Date.now()}`,
        authorName: "Bertrand",
        authorAvatar: "B",
        text: action.text,
        timestamp:
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) + " · Today",
        reactions: [],
        attachments: action.attachments,
      };
      const task = state.tasks.find((t) => t.id === action.taskId);
      const nextState = {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? { ...t, comments: [...(t.comments || []), newComment] }
            : t,
        ),
      };
      return appendActivity(
        nextState,
        "comment",
        task?.title,
        task?.projectId,
        task
          ? state.projects.find((p) => p.id === task.projectId)?.name
          : undefined,
      );
    }

    case "TOGGLE_COMMENT_REACTION":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                comments: (t.comments || []).map((c) => {
                  if (c.id !== action.commentId) return c;
                  const existingIndex = c.reactions.findIndex(
                    (r) => r.emoji === action.emoji,
                  );
                  let nextReactions = [...c.reactions];
                  if (existingIndex > -1) {
                    const r = c.reactions[existingIndex];
                    if (r.userReacted) {
                      if (r.count <= 1) {
                        nextReactions = nextReactions.filter(
                          (_, idx) => idx !== existingIndex,
                        );
                      } else {
                        nextReactions[existingIndex] = {
                          ...r,
                          count: r.count - 1,
                          userReacted: false,
                        };
                      }
                    } else {
                      nextReactions[existingIndex] = {
                        ...r,
                        count: r.count + 1,
                        userReacted: true,
                      };
                    }
                  } else {
                    nextReactions.push({
                      emoji: action.emoji,
                      count: 1,
                      userReacted: true,
                    });
                  }
                  return { ...c, reactions: nextReactions };
                }),
              }
            : t,
        ),
      };

    case "EDIT_COMMENT":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                comments: (t.comments || []).map((c) =>
                  c.id === action.commentId
                    ? { ...c, text: action.text, edited: true }
                    : c,
                ),
              }
            : t,
        ),
      };

    case "DELETE_COMMENT":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                comments: (t.comments || []).filter(
                  (c) => c.id !== action.commentId,
                ),
              }
            : t,
        ),
      };

    case "ADD_PROJECT": {
      const newProjId = action.id ?? `p${Date.now()}`;
      const newProj: ProjectRef = {
        id: newProjId,
        name: action.name,
        icon: "hash",
        color: getProjectColor(action.colorName),
        colorName: action.colorName,
        group: action.group ?? "my",
        teamId: action.teamId,
        layout: action.layout,
        favorite: action.favorite,
        archived: false,
      };
      return {
        ...state,
        projects: [...state.projects, newProj],
      };
    }

    case "ADD_TEAM": {
      const team: TeamRef = {
        id: action.id,
        name: action.name,
        color: action.color,
      };
      return { ...state, teams: [...state.teams, team] };
    }

    case "DELETE_TEAM": {
      // Remove the team plus all of its projects (and their tasks/sections/folders).
      const removedProjectIds = new Set(
        state.projects
          .filter((p) => p.group === "team" && p.teamId === action.id)
          .map((p) => p.id),
      );
      return {
        ...state,
        teams: state.teams.filter((t) => t.id !== action.id),
        projects: state.projects.filter((p) => !removedProjectIds.has(p.id)),
        sections: state.sections.filter(
          (s) => !removedProjectIds.has(s.projectId),
        ),
        tasks: state.tasks.filter((t) => !removedProjectIds.has(t.projectId)),
        folders: state.folders.map((f) => ({
          ...f,
          projectIds: f.projectIds.filter((id) => !removedProjectIds.has(id)),
        })),
      };
    }

    case "SET_TEAMS_EXTERNAL":
      return { ...state, teams: action.teams };

    case "ADD_FOLDER": {
      const folder: FolderRef = {
        id: `f${Date.now()}`,
        name: action.name,
        projectIds: action.projectIds,
      };
      return { ...state, folders: [...state.folders, folder] };
    }

    case "MOVE_PROJECT_TO_FOLDER": {
      // Remove the project from every folder, then add it to the target (if any).
      const cleaned = state.folders.map((f) => ({
        ...f,
        projectIds: f.projectIds.filter((id) => id !== action.projectId),
      }));
      const folders = action.folderId
        ? cleaned.map((f) =>
            f.id === action.folderId
              ? { ...f, projectIds: [...f.projectIds, action.projectId] }
              : f,
          )
        : cleaned;
      return { ...state, folders };
    }

    case "EDIT_PROJECT": {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id
            ? {
                ...p,
                name: action.name ?? p.name,
                colorName: action.colorName ?? p.colorName,
                color: action.colorName
                  ? getProjectColor(action.colorName)
                  : p.color,
                layout: action.layout ?? p.layout,
                favorite: action.favorite ?? p.favorite,
              }
            : p,
        ),
      };
    }

    case "MOVE_PROJECT_TO_TEAM": {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, group: "team" } : p,
        ),
      };
    }

    case "DELETE_PROJECT": {
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        sections: state.sections.filter((s) => s.projectId !== action.id),
        tasks: state.tasks.filter((t) => t.projectId !== action.id),
      };
    }

    case "ARCHIVE_PROJECT": {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, archived: true } : p,
        ),
      };
    }

    case "UNARCHIVE_PROJECT": {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, archived: false } : p,
        ),
      };
    }

    case "TOGGLE_PROJECT_FAVORITE": {
      return {
        ...state,
        projects: state.projects.map((p) =>
          p.id === action.id ? { ...p, favorite: !p.favorite } : p,
        ),
      };
    }

    case "DUPLICATE_PROJECT": {
      const orig = state.projects.find((p) => p.id === action.id);
      if (!orig) return state;
      const newProjId = `p${Date.now()}`;
      const dupProj: ProjectRef = {
        ...orig,
        id: newProjId,
        name: `${orig.name} (Copy)`,
        favorite: false,
      };

      const origSections = state.sections.filter(
        (s) => s.projectId === action.id,
      );
      const sectionIdMap: Record<string, string> = {};
      const dupSections = origSections.map((sec, sIdx) => {
        const newSecId = `s${Date.now()}_${sIdx}`;
        sectionIdMap[sec.id] = newSecId;
        return {
          ...sec,
          id: newSecId,
          projectId: newProjId,
        };
      });

      const origTasks = state.tasks.filter((t) => t.projectId === action.id);
      const dupTasks = origTasks.map((t, tIdx) => ({
        ...t,
        id: `t${Date.now()}_${tIdx}`,
        projectId: newProjId,
        sectionId: t.sectionId ? sectionIdMap[t.sectionId] || null : null,
        completed: false,
      }));

      return {
        ...state,
        projects: [...state.projects, dupProj],
        sections: [...state.sections, ...dupSections],
        tasks: [...state.tasks, ...dupTasks],
      };
    }

    case "ADD_SECTION": {
      const newSec: SectionRef = {
        id: `s${Date.now()}`,
        projectId: action.projectId,
        name: action.name,
        order: state.sections.filter((s) => s.projectId === action.projectId)
          .length,
      };
      return {
        ...state,
        sections: [...state.sections, newSec],
      };
    }

    case "RENAME_SECTION": {
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.sectionId ? { ...s, name: action.name } : s,
        ),
      };
    }

    case "DELETE_SECTION": {
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== action.sectionId),
        tasks: state.tasks.map((t) =>
          t.sectionId === action.sectionId ? { ...t, sectionId: null } : t,
        ),
      };
    }

    case "MOVE_TASK_TO_SECTION": {
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, sectionId: action.sectionId } : t,
        ),
      };
    }

    case "IMPORT_PROJECT_TEMPLATE": {
      const newSections: SectionRef[] = [];
      const newTasks: Task[] = [];
      let baseOrder = state.sections.filter(
        (s) => s.projectId === action.projectId,
      ).length;

      action.sections.forEach((sec, sIdx) => {
        const secId = `s${Date.now()}_${sIdx}_${Math.random().toString(36).substr(2, 4)}`;
        newSections.push({
          id: secId,
          projectId: action.projectId,
          name: sec.name,
          order: baseOrder + sIdx,
        });

        sec.tasks.forEach((tTitle, tIdx) => {
          newTasks.push({
            id: `t${Date.now()}_${sIdx}_${tIdx}_${Math.random().toString(36).substr(2, 4)}`,
            title: tTitle,
            projectId: action.projectId,
            sectionId: secId,
            dueDate: null,
            priority: 4,
            completed: false,
          });
        });
      });

      return {
        ...state,
        sections: [...state.sections, ...newSections],
        tasks: [...state.tasks, ...newTasks],
      };
    }

    case "SET_PROJECTS_EXTERNAL":
      return { ...state, projects: action.projects };

    case "SET_SECTIONS_EXTERNAL":
      return { ...state, sections: action.sections };

    case "SET_FOLDERS_EXTERNAL":
      return { ...state, folders: action.folders };

    case "ADD_FILTER": {
      const newFilter = {
        id: `f-${Date.now()}`,
        name: action.name,
        query: action.query,
        color: getProjectColor(action.colorName),
        colorName: action.colorName,
        favorite: action.favorite,
      };
      return {
        ...state,
        customFilters: [...(state.customFilters || []), newFilter],
      };
    }

    case "EDIT_FILTER": {
      return {
        ...state,
        customFilters: (state.customFilters || []).map((f) =>
          f.id === action.id
            ? {
                ...f,
                name: action.name ?? f.name,
                query: action.query ?? f.query,
                colorName: action.colorName ?? f.colorName,
                color: action.colorName
                  ? getProjectColor(action.colorName)
                  : f.color,
                favorite: action.favorite ?? f.favorite,
              }
            : f,
        ),
      };
    }

    case "DELETE_FILTER": {
      return {
        ...state,
        customFilters: (state.customFilters || []).filter(
          (f) => f.id !== action.id,
        ),
      };
    }

    case "ADD_LABEL": {
      const newLabel = {
        id: `l-${Date.now()}`,
        name: action.name,
        color: getProjectColor(action.colorName),
        colorName: action.colorName,
        favorite: action.favorite,
      };
      return {
        ...state,
        customLabels: [...(state.customLabels || []), newLabel],
      };
    }

    case "EDIT_LABEL": {
      return {
        ...state,
        customLabels: (state.customLabels || []).map((l) =>
          l.id === action.id
            ? {
                ...l,
                name: action.name ?? l.name,
                colorName: action.colorName ?? l.colorName,
                color: action.colorName
                  ? getProjectColor(action.colorName)
                  : l.color,
                favorite: action.favorite ?? l.favorite,
              }
            : l,
        ),
      };
    }

    case "DELETE_LABEL": {
      return {
        ...state,
        customLabels: (state.customLabels || []).filter(
          (l) => l.id !== action.id,
        ),
      };
    }

    case "UPDATE_GOALS": {
      return {
        ...state,
        productivityGoalDaily: action.daily,
        productivityGoalWeekly: action.weekly,
      };
    }

    case "TOGGLE_VACATION_MODE": {
      return { ...state, vacationMode: action.val };
    }

    case "SET_CUSTOM_FILTERS_EXTERNAL":
      return { ...state, customFilters: action.filters };

    case "SET_CUSTOM_LABELS_EXTERNAL":
      return { ...state, customLabels: action.labels };

    case "SET_ACTIVITY_LOG_EXTERNAL":
      return { ...state, activityLog: action.log };

    case "SET_NOTIFICATIONS_EXTERNAL":
      return { ...state, notifications: action.notifications };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: (state.notifications || []).map((n) =>
          n.id === action.id ? { ...n, read: true } : n,
        ),
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: (state.notifications || []).map((n) => ({
          ...n,
          read: true,
        })),
      };

    case "DELETE_NOTIFICATION":
      return {
        ...state,
        notifications: (state.notifications || []).filter(
          (n) => n.id !== action.id,
        ),
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.notification, ...(state.notifications || [])],
      };

    default:
      return state;
  }
}

interface TasksContextValue {
  state: TasksState;
  dispatch: Dispatch<TaskAction>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(tasksReducer, initialState);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("todo_tasks_store");
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "SET_TASKS_EXTERNAL", tasks: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load tasks from localStorage", e);
    }

    try {
      const savedProjects = localStorage.getItem("todo_projects_store");
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "SET_PROJECTS_EXTERNAL", projects: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load projects from localStorage", e);
    }

    try {
      const savedSections = localStorage.getItem("todo_sections_store");
      if (savedSections) {
        const parsed = JSON.parse(savedSections);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_SECTIONS_EXTERNAL", sections: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load sections from localStorage", e);
    }

    try {
      const savedFolders = localStorage.getItem("todo_folders_store");
      if (savedFolders) {
        const parsed = JSON.parse(savedFolders);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_FOLDERS_EXTERNAL", folders: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load folders from localStorage", e);
    }

    try {
      const savedTeams = localStorage.getItem("todo_teams_store");
      if (savedTeams) {
        const parsed = JSON.parse(savedTeams);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_TEAMS_EXTERNAL", teams: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load teams from localStorage", e);
    }

    try {
      const savedFilters = localStorage.getItem("todo_custom_filters_store");
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "SET_CUSTOM_FILTERS_EXTERNAL", filters: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load filters from localStorage", e);
    }

    try {
      const savedLabels = localStorage.getItem("todo_custom_labels_store");
      if (savedLabels) {
        const parsed = JSON.parse(savedLabels);
        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "SET_CUSTOM_LABELS_EXTERNAL", labels: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load labels from localStorage", e);
    }

    try {
      const savedActivity = localStorage.getItem("todo_activity_log_store");
      if (savedActivity) {
        const parsed = JSON.parse(savedActivity);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_ACTIVITY_LOG_EXTERNAL", log: parsed });
        }
      }
    } catch (e) {
      console.error("Failed to load activity log from localStorage", e);
    }

    try {
      const goalDaily = localStorage.getItem("todo_goal_daily");
      const goalWeekly = localStorage.getItem("todo_goal_weekly");
      const vacation = localStorage.getItem("todo_vacation_mode");
      if (goalDaily && goalWeekly) {
        dispatch({
          type: "UPDATE_GOALS",
          daily: Number(goalDaily),
          weekly: Number(goalWeekly),
        });
      }
      if (vacation) {
        dispatch({
          type: "TOGGLE_VACATION_MODE",
          val: vacation === "true",
        });
      }
    } catch (e) {
      console.error("Failed to load goals from localStorage", e);
    }

    try {
      const savedNotifications = localStorage.getItem(
        "todo_notifications_store",
      );
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        if (Array.isArray(parsed)) {
          dispatch({
            type: "SET_NOTIFICATIONS_EXTERNAL",
            notifications: parsed,
          });
        }
      }
    } catch (e) {
      console.error("Failed to load notifications from localStorage", e);
    }
  }, []);

  // Sync to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem("todo_tasks_store", JSON.stringify(state.tasks));
    } catch (e) {
      console.error("Failed to save tasks to localStorage", e);
    }
  }, [state.tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_projects_store",
        JSON.stringify(state.projects),
      );
    } catch (e) {
      console.error("Failed to save projects to localStorage", e);
    }
  }, [state.projects]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_sections_store",
        JSON.stringify(state.sections),
      );
    } catch (e) {
      console.error("Failed to save sections to localStorage", e);
    }
  }, [state.sections]);

  useEffect(() => {
    try {
      localStorage.setItem("todo_folders_store", JSON.stringify(state.folders));
    } catch (e) {
      console.error("Failed to save folders to localStorage", e);
    }
  }, [state.folders]);

  useEffect(() => {
    try {
      localStorage.setItem("todo_teams_store", JSON.stringify(state.teams));
    } catch (e) {
      console.error("Failed to save teams to localStorage", e);
    }
  }, [state.teams]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_custom_filters_store",
        JSON.stringify(state.customFilters),
      );
    } catch (e) {
      console.error("Failed to save filters to localStorage", e);
    }
  }, [state.customFilters]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_custom_labels_store",
        JSON.stringify(state.customLabels),
      );
    } catch (e) {
      console.error("Failed to save labels to localStorage", e);
    }
  }, [state.customLabels]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_activity_log_store",
        JSON.stringify(state.activityLog),
      );
    } catch (e) {
      console.error("Failed to save activity log to localStorage", e);
    }
  }, [state.activityLog]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_notifications_store",
        JSON.stringify(state.notifications),
      );
    } catch (e) {
      console.error("Failed to save notifications to localStorage", e);
    }
  }, [state.notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "todo_goal_daily",
        String(state.productivityGoalDaily),
      );
      localStorage.setItem(
        "todo_goal_weekly",
        String(state.productivityGoalWeekly),
      );
      localStorage.setItem("todo_vacation_mode", String(state.vacationMode));
    } catch (e) {
      console.error("Failed to save goals to localStorage", e);
    }
  }, [
    state.productivityGoalDaily,
    state.productivityGoalWeekly,
    state.vacationMode,
  ]);

  return (
    <TasksContext.Provider value={{ state, dispatch }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks(): TasksContextValue {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within a <TasksProvider>");
  return ctx;
}
