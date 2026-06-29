"use client";

import { useTasks } from "../state";
import { toISO, startOfToday, addDays } from "../date";
import { cn } from "@/lib/utils/cn";

export function ActivityFeedView() {
  const { state, dispatch } = useTasks();

  const handleClearLog = () => {
    dispatch({ type: "SET_ACTIVITY_LOG_EXTERNAL", log: [] });
  };

  const getActionDetails = (item: any) => {
    const time = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let icon: React.ReactNode = null;
    let text = "";
    let colorClass = "";

    switch (item.actionType) {
      case "complete":
        icon = (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              d="M9 12l2.5 2.5L16 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You completed a task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-green-50 text-green-600 border-green-100";
        break;
      case "uncomplete":
        icon = (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              d="M12 15a3 3 0 10-3-3M9 12h6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
        text = `You marked a task as uncompleted: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-amber-50 text-amber-600 border-amber-100";
        break;
      case "add":
        icon = (
          <svg
            width="14"
            height="14"
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
        text = `You added a task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-blue-50 text-blue-600 border-blue-100";
        break;
      case "delete":
        icon = (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16" />
          </svg>
        );
        text = `You deleted a task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-red-50 text-red-600 border-red-100";
        break;
      case "edit":
        icon = (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        );
        text = `You updated a task: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-purple-50 text-purple-600 border-purple-100";
        break;
      case "comment":
        icon = (
          <svg
            width="14"
            height="14"
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
        text = `You added a comment on: "${item.taskTitle || "Untitled"}"`;
        colorClass = "bg-teal-50 text-teal-600 border-teal-100";
        break;
      default:
        icon = (
          <svg
            width="14"
            height="14"
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

    (state.activityLog || []).forEach((item) => {
      const dateStr = item.timestamp.split("T")[0];
      const d = new Date(dateStr);
      const datePart = d.toLocaleDateString([], { month: "short", day: "numeric" });
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

  const FILTERS = [
    "All workspaces",
    "All projects",
    "Everyone",
    "All actions",
    "Any date",
  ];

  return (
    <div className="bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 text-neutral-500 border-b border-neutral-100 select-none">
        {state.activityLog && state.activityLog.length > 0 && (
          <button
            onClick={handleClearLog}
            className="rounded border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition"
          >
            Clear log
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-3xl px-8 py-8 pb-32">
        <button className="flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#202020]">
          Reporting: All
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              {f}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {!state.activityLog || state.activityLog.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 text-neutral-300 mb-4 border border-neutral-100">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="text-sm font-bold text-[#202020]">
              No activity recorded yet
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs">
              Create, complete, edit, or comment on tasks to populate your
              activity log.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {groupKeys.map((day) => (
              <div key={day}>
                <p className="mb-1 text-sm font-bold text-[#202020]">
                  {day}{" "}
                  <span className="font-normal text-neutral-400">
                    {grouped[day].length}
                  </span>
                </p>
                <div>
                  {grouped[day].map((item) => {
                    const { icon, text, colorClass } = getActionDetails(item);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 border-b border-neutral-100 py-3 last:border-b-0"
                      >
                        <span className="relative shrink-0">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-white">
                            B
                          </span>
                          <span
                            className={cn(
                              "absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white",
                              colorClass,
                            )}
                          >
                            <span className="scale-[0.6]">{icon}</span>
                          </span>
                        </span>
                        <p className="min-w-0 flex-1 truncate text-sm text-neutral-700">
                          {text}
                        </p>
                        <span className="shrink-0 text-xs text-neutral-400">
                          {item.projectName && (
                            <span className="mr-2 text-neutral-500">
                              {item.projectName} <span className="text-neutral-400">#</span>
                            </span>
                          )}
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
      </div>
    </div>
  );
}
