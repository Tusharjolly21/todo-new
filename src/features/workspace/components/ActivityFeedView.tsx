"use client";

import { useState, useRef, useEffect } from "react";
import { useTasks } from "../state";
import { toISO, startOfToday, addDays } from "../date";
import { cn } from "@/lib/utils/cn";

type FilterValue = "all" | string;
type PopoverKey = "workspace" | "project" | "user" | "action" | "date" | null;

export function ActivityFeedView() {
  const { state, dispatch } = useTasks();

  // Popovers state
  const [activePopover, setActivePopover] = useState<PopoverKey>(null);

  // Filter settings
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>("complete"); // Default to "complete" to match My Completed Tasks screenshot
  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<string>("anytime");

  // Dropdown references
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setActivePopover(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleClearLog = () => {
    dispatch({ type: "SET_ACTIVITY_LOG_EXTERNAL", log: [] });
  };

  // Merge state activityLog with seeded mocks to ensure all filter options return rich logs
  const getSeededLogs = () => {
    const userLogs = state.activityLog || [];

    // Check if we already have our seed items inside
    const hasSeeds = userLogs.some((l) => l.id.startsWith("seed-activity-"));
    if (hasSeeds) return userLogs;

    const mocks = [
      {
        id: "seed-activity-add",
        timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString(), // 30 mins ago
        actionType: "add",
        taskTitle: "Sociology essay outline",
        projectName: "Inbox",
        actorName: "You",
      },
      {
        id: "seed-activity-complete",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hrs ago
        actionType: "complete",
        taskTitle: "Review feedback on Chapter 2",
        projectName: "My work 🎯",
        actorName: "You",
      },
      {
        id: "seed-activity-edit",
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        actionType: "edit",
        taskTitle: "Buy groceries list",
        projectName: "Home 🏠",
        actorName: "You",
      },
      {
        id: "seed-activity-uncomplete",
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        actionType: "uncomplete",
        taskTitle: "Clean the workspace desk",
        projectName: "Home 🏠",
        actorName: "You",
      },
      {
        id: "seed-activity-delete",
        timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
        actionType: "delete",
        taskTitle: "Old draft notes",
        projectName: "Inbox",
        actorName: "You",
      },
      {
        id: "seed-activity-move",
        timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
        actionType: "move",
        taskTitle: "I.S Mains video preparation",
        projectName: "My work 🎯",
        actorName: "You",
      },
      {
        id: "seed-activity-comment",
        timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
        actionType: "comment",
        taskTitle: "Sociology essay outline",
        commentText: "Need to reference the latest source materials.",
        projectName: "Inbox",
        actorName: "You",
      },
      {
        id: "seed-activity-delete_comment",
        timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
        actionType: "delete_comment",
        taskTitle: "Review Chapter 1 notes",
        projectName: "My work 🎯",
        actorName: "You",
      },
      {
        id: "seed-activity-add_project",
        timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
        actionType: "add_project",
        projectName: "Research Papers",
        actorName: "You",
      },
      {
        id: "seed-activity-rename_project",
        timestamp: new Date(Date.now() - 3600000 * 26).toISOString(),
        actionType: "rename_project",
        projectName: "Dribbble Mockups",
        actorName: "You",
      },
      {
        id: "seed-activity-archive_project",
        timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
        actionType: "archive_project",
        projectName: "Old Client Project",
        actorName: "You",
      },
      {
        id: "seed-activity-unarchive_project",
        timestamp: new Date(Date.now() - 3600000 * 34).toISOString(),
        actionType: "unarchive_project",
        projectName: "Personal Portfolio",
        actorName: "You",
      },
      {
        id: "seed-activity-join_project",
        timestamp: new Date(Date.now() - 3600000 * 38).toISOString(),
        actionType: "join_project",
        projectName: "Marketing Team Sync",
        actorName: "You",
      },
      {
        id: "seed-activity-leave_project",
        timestamp: new Date(Date.now() - 3600000 * 42).toISOString(),
        actionType: "leave_project",
        projectName: "Design Handover",
        actorName: "You",
      },
      {
        id: "seed-activity-add_section",
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
        actionType: "add_section",
        sectionName: "Review Backlog",
        projectName: "My work 🎯",
        actorName: "You",
      },
      {
        id: "seed-activity-rename_section",
        timestamp: new Date(Date.now() - 3600000 * 54).toISOString(),
        actionType: "rename_section",
        sectionName: "Ready to Deploy",
        projectName: "My work 🎯",
        actorName: "You",
      },
      {
        id: "seed-activity-delete_section",
        timestamp: new Date(Date.now() - 3600000 * 60).toISOString(),
        actionType: "delete_section",
        sectionName: "Archive-2025",
        projectName: "Home 🏠",
        actorName: "You",
      },
      {
        id: "seed-activity-archive_section",
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
        actionType: "archive_section",
        sectionName: "Completed Milestones",
        projectName: "My work 🎯",
        actorName: "You",
      },
      {
        id: "seed-activity-unarchive_section",
        timestamp: new Date(Date.now() - 3600000 * 96).toISOString(),
        actionType: "unarchive_section",
        sectionName: "Active Sprint Items",
        projectName: "My work 🎯",
        actorName: "You",
      },
    ];

    const combined = [...userLogs, ...mocks];
    combined.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    return combined;
  };

  const allLogs = getSeededLogs();

  // Filter items matching the choices
  const filteredLogs = allLogs.filter((item: any) => {
    // 1. Action type filter
    if (selectedFilter !== "all" && item.actionType !== selectedFilter)
      return false;

    // 2. Project filter
    if (
      selectedProject !== "all" &&
      item.projectName?.toLowerCase() !== selectedProject.toLowerCase()
    )
      return false;

    // 3. User filter
    if (
      selectedUser !== "all" &&
      item.actorName?.toLowerCase() !== selectedUser.toLowerCase()
    )
      return false;

    // 4. Date filter
    const itemDate = new Date(item.timestamp);
    const today = startOfToday();
    if (selectedDateFilter === "today") {
      return toISO(itemDate) === toISO(today);
    } else if (selectedDateFilter === "yesterday") {
      return toISO(itemDate) === toISO(addDays(today, -1));
    } else if (selectedDateFilter === "this_week") {
      const sevenDaysAgo = addDays(today, -7);
      return itemDate >= sevenDaysAgo;
    } else if (selectedDateFilter === "last_week") {
      const fourteenDaysAgo = addDays(today, -14);
      const sevenDaysAgo = addDays(today, -7);
      return itemDate >= fourteenDaysAgo && itemDate <= sevenDaysAgo;
    } else if (selectedDateFilter === "this_month") {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return itemDate >= startOfMonth;
    } else if (selectedDateFilter === "last_month") {
      const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1,
      );
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      return itemDate >= startOfLastMonth && itemDate <= endOfLastMonth;
    }

    return true;
  });

  const getActionDetails = (item: any) => {
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let icon: React.ReactNode = null;
    let text = "";
    let colorClass = "";

    switch (item.actionType) {
      // TASKS
      case "add":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M12 5v14M5 12h14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You added task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-blue-50 text-blue-600 border-blue-100";
        break;
      case "edit":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        );
        text = `You updated task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-purple-50 text-purple-600 border-purple-100";
        break;
      case "complete":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M20 6L9 17l-5-5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You completed task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-green-50 text-green-650 border-green-105";
        break;
      case "uncomplete":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
        text = `You marked task as uncompleted: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-amber-50 text-amber-600 border-amber-100";
        break;
      case "delete":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M4 7h16" />
          </svg>
        );
        text = `You deleted task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-red-50 text-red-650 border-red-100";
        break;
      case "move":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M17 8l4 4m0 0l-4 4m4-4H3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You moved task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-sky-50 text-sky-655 border-sky-100";
        break;

      // COMMENTS
      case "comment":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You added comment: "${item.commentText || "..."}" on "${item.taskTitle || "task"}"`;
        colorClass = "bg-teal-50 text-teal-655 border-teal-100";
        break;
      case "delete_comment":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M3 6h18m-2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You deleted a comment on: "${item.taskTitle || "task"}"`;
        colorClass = "bg-rose-50 text-rose-650 border-rose-100";
        break;

      // PROJECTS
      case "add_project":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              d="M12 5v14M5 12h14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You created project: "${item.projectName || "Untitled project"}"`;
        colorClass = "bg-emerald-50 text-emerald-650 border-emerald-100";
        break;
      case "rename_project":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        );
        text = `You renamed project to: "${item.projectName || "Untitled project"}"`;
        colorClass = "bg-indigo-50 text-indigo-655 border-indigo-100";
        break;
      case "archive_project":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        );
        text = `You archived project: "${item.projectName || "project"}"`;
        colorClass = "bg-zinc-50 text-zinc-650 border-zinc-200";
        break;
      case "unarchive_project":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v10" />
          </svg>
        );
        text = `You unarchived project: "${item.projectName || "project"}"`;
        colorClass = "bg-yellow-50 text-yellow-655 border-yellow-105";
        break;
      case "join_project":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M20 8v6M23 11h-6" />
          </svg>
        );
        text = `You joined project: "${item.projectName || "project"}"`;
        colorClass = "bg-cyan-50 text-cyan-650 border-cyan-100";
        break;
      case "leave_project":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        );
        text = `You left project: "${item.projectName || "project"}"`;
        colorClass = "bg-orange-50 text-orange-655 border-orange-100";
        break;

      // SECTIONS
      case "add_section":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        );
        text = `You created section: "${item.sectionName || "Section"}" in project "${item.projectName || "project"}"`;
        colorClass = "bg-slate-50 text-slate-655 border-slate-100";
        break;
      case "rename_section":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          </svg>
        );
        text = `You renamed section to: "${item.sectionName || "Section"}" in project "${item.projectName || "project"}"`;
        colorClass = "bg-indigo-50 text-indigo-650 border-indigo-100";
        break;
      case "delete_section":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
          </svg>
        );
        text = `You deleted section: "${item.sectionName || "Section"}" from "${item.projectName || "project"}"`;
        colorClass = "bg-[#fdf0ee] text-[#dc4c3e] border-red-100";
        break;
      case "archive_section":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
          </svg>
        );
        text = `You archived section: "${item.sectionName || "Section"}" in project "${item.projectName || "project"}"`;
        colorClass = "bg-stone-50 text-stone-650 border-stone-200";
        break;
      case "unarchive_section":
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        );
        text = `You unarchived section: "${item.sectionName || "Section"}" in project "${item.projectName || "project"}"`;
        colorClass = "bg-lime-50 text-lime-655 border-lime-100";
        break;

      default:
        icon = (
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="9" />
          </svg>
        );
        text = `Interaction detected`;
        colorClass = "bg-neutral-50 text-neutral-600 border-neutral-100";
    }

    return { icon, text, time, colorClass };
  };

  // Group activity logs by day
  const groupLogsByDay = () => {
    const groups: Record<string, any[]> = {};
    const todayStr = toISO(startOfToday());
    const yesterdayStr = toISO(addDays(startOfToday(), -1));

    filteredLogs.forEach((item: any) => {
      const dateStr = item.timestamp.split("T")[0];
      const d = new Date(dateStr);
      const datePart = d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
      const weekday = d.toLocaleDateString([], { weekday: "long" });
      let rel = "";
      if (dateStr === todayStr) rel = "Today";
      else if (dateStr === yesterdayStr) rel = "Yesterday";
      const dayLabel = [datePart, rel, weekday].filter(Boolean).join(" · ");

      if (!groups[dayLabel]) {
        groups[dayLabel] = [];
      }
      groups[dayLabel].push(item);
    });

    return groups;
  };

  const grouped = groupLogsByDay();
  const groupKeys = Object.keys(grouped);

  const relativeTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    return new Date(ts).toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const FILTER_GROUPS = [
    {
      title: "tasks",
      options: [
        { key: "add", label: "Added tasks" },
        { key: "edit", label: "Updated tasks" },
        { key: "complete", label: "Completed tasks" },
        { key: "uncomplete", label: "Uncompleted tasks" },
        { key: "delete", label: "Deleted tasks" },
        { key: "move", label: "Moved tasks" },
      ],
    },
    {
      title: "comments",
      options: [
        { key: "comment", label: "Added comments" },
        { key: "delete_comment", label: "Deleted comments" },
      ],
    },
    {
      title: "projects",
      options: [
        { key: "add_project", label: "Added projects" },
        { key: "rename_project", label: "Renamed projects" },
        { key: "archive_project", label: "Archived projects" },
        { key: "unarchive_project", label: "Unarchived projects" },
        { key: "join_project", label: "Joined projects" },
        { key: "leave_project", label: "Left projects" },
      ],
    },
    {
      title: "sections",
      options: [
        { key: "add_section", label: "Added sections" },
        { key: "rename_section", label: "Renamed sections" },
        { key: "delete_section", label: "Deleted sections" },
        { key: "archive_section", label: "Archived sections" },
        { key: "unarchive_section", label: "Unarchived sections" },
      ],
    },
  ];

  // Helper to find the readable name of selected action filter
  const getFilterLabel = () => {
    if (selectedFilter === "all") return "All actions";
    for (const group of FILTER_GROUPS) {
      const match = group.options.find((opt) => opt.key === selectedFilter);
      if (match) return match.label;
    }
    return "Filtered actions";
  };

  const getDateFilterLabel = () => {
    switch (selectedDateFilter) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "this_week":
        return "This week";
      case "last_week":
        return "Last week";
      case "this_month":
        return "This month";
      case "last_month":
        return "Last month";
      default:
        return "Any date";
    }
  };

  const getProjectFilterLabel = () => {
    if (selectedProject === "all") return "All projects";
    const proj = state.projects.find((p) => p.id === selectedProject);
    return proj ? proj.name : "Selected project";
  };

  const togglePopover = (key: PopoverKey) => {
    setActivePopover((prev) => (prev === key ? null : key));
  };

  return (
    <div className="bg-white dark:bg-[#0c0c0c] min-h-screen text-neutral-800 dark:text-neutral-200">
      {/* Top Header Controls bar */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-neutral-100 dark:border-neutral-900/60 select-none">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-neutral-450 dark:text-neutral-400">
          Activity Report
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearLog}
            className="rounded-xl border border-neutral-200 hover:bg-neutral-50 px-3.5 py-1.5 text-xs font-bold text-neutral-550 dark:border-neutral-800 dark:hover:bg-neutral-900 dark:text-neutral-400 transition cursor-pointer"
          >
            Clear log
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 pb-32" ref={containerRef}>
        <div className="space-y-4 relative">
          {/* Header row with dynamic action name */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => togglePopover("action")}
              className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white hover:opacity-85 select-none"
            >
              Reporting: {getFilterLabel()}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="mt-1"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={() => alert("CSV Export triggered")}
              className="px-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 select-none"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              Export
            </button>
          </div>

          {/* Interactive dropdown pills bar */}
          <div className="flex flex-wrap gap-2 select-none relative z-40">
            {/* 1. Workspace Pill */}
            <div className="relative">
              <button
                onClick={() => togglePopover("workspace")}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>All workspaces</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {activePopover === "workspace" && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 z-50">
                  <button className="w-full text-left px-3 py-2 text-xs font-bold bg-neutral-50 dark:bg-neutral-850 rounded-lg">
                    Personal Workspace
                  </button>
                </div>
              )}
            </div>

            {/* 2. Project Pill */}
            <div className="relative">
              <button
                onClick={() => togglePopover("project")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                  selectedProject !== "all"
                    ? "bg-[#eff6ff] text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/60"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900",
                )}
              >
                <span className="text-xs">#</span>
                <span>{getProjectFilterLabel()}</span>
                {selectedProject !== "all" ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject("all");
                    }}
                    className="hover:text-blue-900 dark:hover:text-white px-0.5 ml-1"
                  >
                    ×
                  </span>
                ) : (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
              </button>
              {activePopover === "project" && (
                <div className="absolute left-0 mt-1.5 w-52 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1.5 z-50 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedProject("all");
                      setActivePopover(null);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850",
                      selectedProject === "all" &&
                        "bg-neutral-50 dark:bg-neutral-850 font-bold",
                    )}
                  >
                    All projects
                  </button>
                  {state.projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProject(p.name);
                        setActivePopover(null);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850 flex items-center gap-1.5",
                        selectedProject === p.name &&
                          "bg-neutral-50 dark:bg-neutral-850 font-bold",
                      )}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-neutral-400"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. User Pill */}
            <div className="relative">
              <button
                onClick={() => togglePopover("user")}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                </svg>
                <span>
                  {selectedUser === "all" ? "Everyone" : selectedUser}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {activePopover === "user" && (
                <div className="absolute left-0 mt-1.5 w-44 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl p-1 z-50">
                  <button
                    onClick={() => {
                      setSelectedUser("all");
                      setActivePopover(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850"
                  >
                    Everyone
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser("You");
                      setActivePopover(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-850"
                  >
                    You
                  </button>
                </div>
              )}
            </div>

            {/* 4. Action Pill - Hosts categorized event type radio filter options inside dropdown */}
            <div className="relative">
              <button
                onClick={() => togglePopover("action")}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-450 select-none cursor-pointer"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>{getFilterLabel()}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-1 select-none" />
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFilter("all");
                  }}
                  className="hover:opacity-75 pl-1"
                >
                  ×
                </span>
              </button>
              {activePopover === "action" && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-4.5 z-50 max-h-[380px] overflow-y-auto">
                  <span className="block text-[9px] font-extrabold tracking-wider text-neutral-400 uppercase mb-3 select-none">
                    Filter Event Types
                  </span>

                  <div className="space-y-4">
                    {/* Reset all events choice */}
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="action_filter_opt"
                        checked={selectedFilter === "all"}
                        onChange={() => {
                          setSelectedFilter("all");
                          setActivePopover(null);
                        }}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "h-3.5 w-3.5 rounded-full border flex items-center justify-center transition shrink-0",
                          selectedFilter === "all"
                            ? "border-brand dark:border-white"
                            : "border-neutral-300 dark:border-neutral-800 group-hover:border-neutral-400",
                        )}
                      >
                        {selectedFilter === "all" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-white" />
                        )}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-semibold select-none",
                          selectedFilter === "all"
                            ? "text-neutral-950 dark:text-white font-bold"
                            : "text-neutral-500 dark:text-neutral-400",
                        )}
                      >
                        All actions
                      </span>
                    </label>

                    {FILTER_GROUPS.map((group) => (
                      <div key={group.title} className="space-y-2">
                        <span className="block text-[8px] font-extrabold tracking-widest text-neutral-400 uppercase select-none">
                          {group.title}
                        </span>
                        <div className="space-y-2 pl-0.5">
                          {group.options.map((opt) => {
                            const isChecked = selectedFilter === opt.key;
                            return (
                              <label
                                key={opt.key}
                                className="flex items-center gap-2.5 cursor-pointer group"
                              >
                                <input
                                  type="radio"
                                  name="action_filter_opt"
                                  checked={isChecked}
                                  onChange={() => {
                                    setSelectedFilter(opt.key);
                                    setActivePopover(null);
                                  }}
                                  className="sr-only"
                                />
                                <span
                                  className={cn(
                                    "h-3.5 w-3.5 rounded-full border flex items-center justify-center transition shrink-0",
                                    isChecked
                                      ? "border-brand dark:border-white"
                                      : "border-neutral-300 dark:border-neutral-800 group-hover:border-neutral-400",
                                  )}
                                >
                                  {isChecked && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-brand dark:bg-white" />
                                  )}
                                </span>
                                <span
                                  className={cn(
                                    "text-xs font-semibold select-none",
                                    isChecked
                                      ? "text-neutral-955 dark:text-white font-bold"
                                      : "text-neutral-500 dark:text-neutral-400",
                                  )}
                                >
                                  {opt.label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 5. Date Pill - Matches Any Date popover layout */}
            <div className="relative">
              <button
                onClick={() => togglePopover("date")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition cursor-pointer select-none",
                  selectedDateFilter !== "anytime"
                    ? "bg-[#eff6ff] text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-450 dark:border-blue-900/60"
                    : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-900",
                )}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{getDateFilterLabel()}</span>
                {selectedDateFilter !== "anytime" ? (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDateFilter("anytime");
                    }}
                    className="hover:text-blue-900 dark:hover:text-white px-0.5 ml-1"
                  >
                    ×
                  </span>
                ) : (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
              </button>

              {/* Beautiful Any Date Dropdown popover exact copy of screenshot */}
              {activePopover === "date" && (
                <div className="absolute right-0 lg:left-0 mt-1.5 w-64 bg-white dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-4.5 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-900/50 mb-3 select-none">
                    <span className="text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase">
                      Filter by date
                    </span>
                    <button
                      onClick={() => {
                        setSelectedDateFilter("anytime");
                        setActivePopover(null);
                      }}
                      className="text-[9px] font-extrabold text-neutral-400 hover:text-brand dark:hover:text-white uppercase cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-1">
                    {[
                      {
                        key: "anytime",
                        label: "Anytime",
                        icon: (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-neutral-400"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                          </svg>
                        ),
                      },
                      {
                        key: "today",
                        label: "Today",
                        icon: (
                          <span className="flex h-4.5 w-4.5 items-center justify-center bg-emerald-100 dark:bg-emerald-950/40 rounded text-emerald-600 dark:text-emerald-400 text-[8px] font-extrabold shadow-3xs select-none">
                            30
                          </span>
                        ),
                      },
                      {
                        key: "yesterday",
                        label: "Yesterday",
                        icon: (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-orange-500"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 10 14" />
                          </svg>
                        ),
                      },
                      {
                        key: "this_week",
                        label: "This week",
                        icon: (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-indigo-500"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                          </svg>
                        ),
                      },
                      {
                        key: "last_week",
                        label: "Last week",
                        icon: (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-neutral-500"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M12 16l-4-4m0 0l4-4m-4 4h8" />
                          </svg>
                        ),
                      },
                      {
                        key: "this_month",
                        label: "This month",
                        icon: (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-sky-500"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                          </svg>
                        ),
                      },
                      {
                        key: "last_month",
                        label: "Last month",
                        icon: (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-neutral-500"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M12 16l-4-4m0 0l4-4m-4 4h8" />
                          </svg>
                        ),
                      },
                    ].map((dOpt) => {
                      const isSelected = selectedDateFilter === dOpt.key;
                      return (
                        <button
                          key={dOpt.key}
                          onClick={() => {
                            setSelectedDateFilter(dOpt.key);
                            setActivePopover(null);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/60 text-xs font-semibold text-neutral-650 dark:text-neutral-350 cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            {dOpt.icon}
                            <span
                              className={cn(
                                isSelected &&
                                  "text-neutral-950 dark:text-white font-bold",
                              )}
                            >
                              {dOpt.label}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="text-orange-500 font-bold select-none text-[10px]">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar months grid */}
                  <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 select-none">
                    {/* June 2026 */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-extrabold text-neutral-850 dark:text-white uppercase tracking-wider mb-2">
                        <span>Jun 2026</span>
                        <div className="flex gap-1">
                          <span className="w-4 h-4 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-center text-[8px] cursor-pointer">
                            ‹
                          </span>
                          <span className="w-4 h-4 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-center text-[8px] cursor-pointer">
                            ○
                          </span>
                          <span className="w-4 h-4 rounded hover:bg-neutral-100 dark:hover:bg-neutral-900 flex items-center justify-center text-[8px] cursor-pointer">
                            ›
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-bold text-neutral-400">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                          <span key={idx}>{day}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold mt-1 text-neutral-400">
                        {Array.from({ length: 30 }, (_, i) => {
                          const dayNum = i + 1;
                          const isSpecialActive = dayNum === 30; // Highlight 30 in orange
                          const isSpecialDay = [
                            24, 25, 26, 27, 28, 29,
                          ].includes(dayNum);
                          return (
                            <span
                              key={dayNum}
                              onClick={() => {
                                setSelectedDateFilter("today");
                                setActivePopover(null);
                              }}
                              className={cn(
                                "py-1 rounded cursor-pointer",
                                isSpecialActive &&
                                  "bg-orange-500 text-white font-extrabold shadow-3xs",
                                isSpecialDay &&
                                  "text-neutral-700 dark:text-neutral-250 font-bold",
                                !isSpecialActive &&
                                  !isSpecialDay &&
                                  "opacity-30",
                              )}
                            >
                              {dayNum}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* July 2026 */}
                    <div className="mt-4">
                      <div className="text-[10px] font-extrabold text-neutral-850 dark:text-white uppercase tracking-wider mb-2">
                        <span>Jul 2026</span>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[8px] font-bold text-neutral-400">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                          <span key={idx}>{day}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold mt-1 text-neutral-400">
                        {Array.from({ length: 31 }, (_, i) => {
                          const dayNum = i + 1;
                          const isSpecialActive = dayNum === 30; // Highlight 30 in orange
                          const isSpecialDay = [
                            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                            16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                            29,
                          ].includes(dayNum);
                          return (
                            <span
                              key={dayNum}
                              className={cn(
                                "py-1 rounded",
                                isSpecialActive &&
                                  "text-orange-500 font-extrabold",
                                isSpecialDay &&
                                  "text-neutral-350 dark:text-neutral-600 font-bold",
                                !isSpecialActive &&
                                  !isSpecialDay &&
                                  "opacity-35",
                              )}
                            >
                              {dayNum}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Grouped activity feed items */}
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-neutral-200 dark:border-neutral-850 rounded-3xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-900 text-neutral-300 dark:text-neutral-600 mb-4 border border-neutral-100/50 dark:border-neutral-800">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                No activity recorded
              </h2>
              <p className="text-[11px] text-neutral-450 mt-1.5 max-w-xs font-medium">
                Create or complete items to populate your filtered view logs.
              </p>
            </div>
          ) : (
            <div className="space-y-7 mt-6">
              {groupKeys.map((day) => (
                <div key={day} className="space-y-3">
                  <p className="text-xs font-extrabold text-neutral-900 dark:text-white uppercase tracking-widest border-b border-neutral-100 dark:border-neutral-900/60 pb-1.5 select-none">
                    {day}
                  </p>
                  <div className="space-y-0.5">
                    {grouped[day].map((item: any) => {
                      const { icon, text, colorClass } = getActionDetails(item);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3.5 py-3.5 px-2 rounded-xl hover:bg-neutral-50/50 dark:hover:bg-neutral-950/20 transition-all border-b border-neutral-100/30 dark:border-neutral-900/10 last:border-b-0"
                        >
                          <span className="relative shrink-0">
                            <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 text-xs font-bold text-neutral-700 dark:text-white select-none shadow-3xs uppercase">
                              {item.actorName ? item.actorName[0] : "Y"}
                            </span>
                            <span
                              className={cn(
                                "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white dark:border-[#0c0c0c] shadow-3xs",
                                colorClass,
                              )}
                            >
                              <span className="scale-[0.65]">{icon}</span>
                            </span>
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-neutral-700 dark:text-neutral-200 leading-snug">
                              {text}
                            </p>
                          </div>
                          <span className="shrink-0 text-[10px] font-bold text-neutral-400 tracking-wide select-none">
                            {relativeTime(item.timestamp)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest pt-8 select-none">
            That's it. No more history to load.
          </p>
        </div>
      </div>
    </div>
  );
}
