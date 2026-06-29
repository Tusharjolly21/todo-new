/** Task domain types for the workspace (task app) feature. */

export type Priority = 1 | 2 | 3 | 4; // 1 = highest (red), 4 = none (grey)

export type DueColor = "green" | "orange" | "purple" | "neutral" | "red";

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string; // ISO date string or formatted time
  edited?: boolean;
  reactions: { emoji: string; count: number; userReacted: boolean }[];
  attachments?: { name: string; url: string; size: string }[];
}

export interface ProjectRef {
  id: string;
  name: string;
  /** Leading glyph: the Inbox tray, or a coloured "#". */
  icon: "inbox" | "hash";
  emoji?: string;
  color?: string;
  colorName?: string;
  group: "favorites" | "my" | "team";
  /** Owning team workspace id (only for group === "team"). */
  teamId?: string;
  layout: "list" | "board" | "calendar";
  favorite: boolean;
  archived: boolean;
}

/** A team workspace. */
export interface TeamRef {
  id: string;
  name: string;
  /** Avatar background colour. */
  color: string;
}

export interface SectionRef {
  id: string;
  projectId: string;
  name: string;
  order: number;
}

/** A folder groups projects together within a team workspace. */
export interface FolderRef {
  id: string;
  name: string;
  /** Ids of the projects contained in this folder. */
  projectIds: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  /** Project this task belongs to (e.g. "inbox", "my-work"). */
  projectId: string;
  sectionId?: string | null;
  /** Plain ISO date (yyyy-mm-dd) the backend will persist, or null. */
  dueDate: string | null;
  /** Start time "HH:MM" (24h) when the task is time-blocked, else null. */
  dueTime?: string | null;
  /** Duration in minutes (used with dueTime), else null. */
  duration?: number | null;
  priority: Priority;
  /** Member id the task is assigned to, else null. */
  assigneeId?: string | null;
  /** Label names attached to the task. */
  labels?: string[];
  /** Reminder option ids attached to the task. */
  reminders?: string[];
  completed: boolean;
  completedAt?: string | null;
  subtasks?: SubTask[];
  comments?: Comment[];
}

/** A new-task draft produced by the shared Add-task editor. */
export interface TaskDraft {
  title: string;
  description?: string;
  projectId?: string;
  sectionId?: string | null;
  dueDate: string | null;
  dueTime?: string | null;
  duration?: number | null;
  priority: Priority;
  assigneeId?: string | null;
  labels?: string[];
  reminders?: string[];
  subtasks?: SubTask[];
  comments?: Comment[];
}

export interface FilterRef {
  id: string;
  name: string;
  query: string;
  color: string;
  colorName: string;
  favorite: boolean;
}

export interface LabelRef {
  id: string;
  name: string;
  color: string;
  colorName: string;
  favorite: boolean;
}

export interface ActivityItem {
  id: string;
  actionType: "complete" | "add" | "delete" | "edit" | "comment" | "uncomplete";
  taskTitle?: string;
  projectId?: string;
  projectName?: string;
  timestamp: string; // ISO string
}

export interface NotificationItem {
  id: string;
  text: string;
  timestamp: string; // ISO date string
  read: boolean;
  projectName?: string;
  projectId?: string;
  actorName?: string;
}

export type PendingUndo =
  | { kind: "completed" | "deleted"; task: Task; index: number }
  | { kind: "moved"; id: string; prevProjectId: string; projectName: string };

export interface TasksState {
  tasks: Task[];
  projects: ProjectRef[];
  sections: SectionRef[];
  folders: FolderRef[];
  teams: TeamRef[];
  customFilters: FilterRef[];
  customLabels: LabelRef[];
  activityLog: ActivityItem[];
  notifications: NotificationItem[];
  productivityGoalDaily: number;
  productivityGoalWeekly: number;
  vacationMode: boolean;
  /** Last completed/deleted/moved task, retained so it can be undone. */
  pendingUndo: PendingUndo | null;
  /** Task whose detail/edit modal is open. */
  selectedId: string | null;
  /** Task pending delete confirmation (drives the confirm dialog). */
  confirmDeleteId: string | null;
  /** List index where an inline "add task above/below" editor is open. */
  addingAtIndex: number | null;
}

export type TaskAction =
  | { type: "COMPLETE"; id: string }
  | { type: "DELETE_TASK"; id: string }
  | { type: "DUPLICATE_TASK"; id: string }
  | { type: "ADD_TASK"; draft: TaskDraft }
  | { type: "UPDATE_TASK"; id: string; title?: string; description?: string }
  | { type: "SET_DUE"; id: string; dueDate: string | null }
  | {
      type: "SET_TIME";
      id: string;
      dueTime: string | null;
      duration: number | null;
    }
  | { type: "SET_PRIORITY"; id: string; priority: Priority }
  | { type: "SET_PROJECT"; id: string; projectId: string }
  | { type: "SET_ASSIGNEE"; id: string; assigneeId: string | null }
  | { type: "SET_LABELS"; id: string; labels: string[] }
  | { type: "SET_REMINDERS"; id: string; reminders: string[] }
  | { type: "OPEN_TASK"; id: string }
  | { type: "CLOSE_TASK" }
  | { type: "REQUEST_DELETE"; id: string }
  | { type: "CANCEL_DELETE" }
  | { type: "START_ADD_AT"; index: number }
  | { type: "CANCEL_ADD_AT" }
  | { type: "ADD_TASK_AT"; index: number; draft: TaskDraft }
  | { type: "UNDO" }
  | { type: "DISMISS_UNDO" }
  | { type: "ADD_SUBTASK"; taskId: string; title: string }
  | { type: "TOGGLE_SUBTASK"; taskId: string; subtaskId: string }
  | {
      type: "ADD_COMMENT";
      taskId: string;
      text: string;
      attachments?: { name: string; url: string; size: string }[];
    }
  | { type: "EDIT_COMMENT"; taskId: string; commentId: string; text: string }
  | { type: "DELETE_COMMENT"; taskId: string; commentId: string }
  | {
      type: "TOGGLE_COMMENT_REACTION";
      taskId: string;
      commentId: string;
      emoji: string;
    }
  | { type: "SET_TASKS_EXTERNAL"; tasks: Task[] }
  | { type: "SET_PROJECTS_EXTERNAL"; projects: ProjectRef[] }
  | { type: "SET_SECTIONS_EXTERNAL"; sections: SectionRef[] }
  | { type: "SET_FOLDERS_EXTERNAL"; folders: FolderRef[] }
  // Project actions
  | {
      type: "ADD_PROJECT";
      id?: string;
      name: string;
      colorName: string;
      layout: "list" | "board" | "calendar";
      favorite: boolean;
      group?: "favorites" | "my" | "team";
      teamId?: string;
    }
  | { type: "ADD_TEAM"; id: string; name: string; color: string }
  | { type: "DELETE_TEAM"; id: string }
  | { type: "SET_TEAMS_EXTERNAL"; teams: TeamRef[] }
  | {
      type: "EDIT_PROJECT";
      id: string;
      name?: string;
      colorName?: string;
      layout?: "list" | "board" | "calendar";
      favorite?: boolean;
    }
  | { type: "DELETE_PROJECT"; id: string }
  | { type: "ARCHIVE_PROJECT"; id: string }
  | { type: "UNARCHIVE_PROJECT"; id: string }
  | { type: "DUPLICATE_PROJECT"; id: string }
  | { type: "TOGGLE_PROJECT_FAVORITE"; id: string }
  | { type: "MOVE_PROJECT_TO_TEAM"; id: string }
  // Section actions
  | {
      type: "ADD_SECTION";
      projectId: string;
      name: string;
      insertAfterId?: string;
    }
  | { type: "RENAME_SECTION"; sectionId: string; name: string }
  | { type: "DELETE_SECTION"; sectionId: string }
  | { type: "MOVE_TASK_TO_SECTION"; taskId: string; sectionId: string | null }
  | {
      type: "IMPORT_PROJECT_TEMPLATE";
      projectId: string;
      sections: { name: string; tasks: string[] }[];
    }
  // Folder actions
  | { type: "ADD_FOLDER"; name: string; projectIds: string[] }
  | {
      type: "MOVE_PROJECT_TO_FOLDER";
      projectId: string;
      folderId: string | null;
    }
  // Filters actions
  | {
      type: "ADD_FILTER";
      name: string;
      query: string;
      colorName: string;
      favorite: boolean;
    }
  | {
      type: "EDIT_FILTER";
      id: string;
      name?: string;
      query?: string;
      colorName?: string;
      favorite?: boolean;
    }
  | { type: "DELETE_FILTER"; id: string }
  // Labels actions
  | { type: "ADD_LABEL"; name: string; colorName: string; favorite: boolean }
  | {
      type: "EDIT_LABEL";
      id: string;
      name?: string;
      colorName?: string;
      favorite?: boolean;
    }
  | { type: "DELETE_LABEL"; id: string }
  // Productivity & external storage actions
  | { type: "UPDATE_GOALS"; daily: number; weekly: number }
  | { type: "TOGGLE_VACATION_MODE"; val: boolean }
  | { type: "SET_CUSTOM_FILTERS_EXTERNAL"; filters: FilterRef[] }
  | { type: "SET_CUSTOM_LABELS_EXTERNAL"; labels: LabelRef[] }
  | { type: "SET_ACTIVITY_LOG_EXTERNAL"; log: ActivityItem[] }
  | { type: "MARK_NOTIFICATION_READ"; id: string }
  | { type: "MARK_ALL_NOTIFICATIONS_READ" }
  | { type: "DELETE_NOTIFICATION"; id: string }
  | { type: "ADD_NOTIFICATION"; notification: NotificationItem }
  | { type: "SET_NOTIFICATIONS_EXTERNAL"; notifications: NotificationItem[] };
