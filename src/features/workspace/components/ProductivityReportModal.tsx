"use client";

import { useEffect, useState, useRef } from "react";
import { useTasks } from "../state";
import { toISO, startOfToday, addDays, shortDate } from "../date";
import { cn } from "@/lib/utils/cn";

interface ProductivityReportModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProductivityReportModal({
  open,
  onClose,
}: ProductivityReportModalProps) {
  const { state } = useTasks();
  const [completedList, setCompletedList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "priority"
  >("overview");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("todo_completed_tasks_store");
      if (saved) {
        setCompletedList(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [state.tasks, open]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!open) return null;

  const today = startOfToday();
  const todayStr = toISO(today);

  // 1. Calculate General Stats
  const totalCompleted = completedList.length;

  const completedTodayCount = completedList.filter(
    (t) => t.completedAt && t.completedAt.split("T")[0] === todayStr,
  ).length;

  const dailyGoal = state.productivityGoalDaily ?? 5;
  const weeklyGoal = state.productivityGoalWeekly ?? 25;

  const dailyPercentage = Math.min(
    100,
    Math.round((completedTodayCount / dailyGoal) * 100),
  );

  // Start of current week (Monday)
  const currentDayOfWeek = today.getDay();
  const startOfWeek = addDays(
    today,
    -(currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1),
  );

  const completedThisWeek = completedList.filter((t) => {
    if (!t.completedAt) return false;
    const d = new Date(t.completedAt);
    return d >= startOfWeek;
  });
  const completedThisWeekCount = completedThisWeek.length;
  const weeklyPercentage = Math.min(
    100,
    Math.round((completedThisWeekCount / weeklyGoal) * 100),
  );

  // Streak Calculation
  const datesSet = new Set(
    completedList
      .filter((t) => t.completedAt)
      .map((t) => t.completedAt.split("T")[0]),
  );

  let currentStreak = 0;
  let checkDate = new Date(today);
  while (true) {
    const isoStr = toISO(checkDate);
    if (datesSet.has(isoStr)) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    } else {
      // If we check today and it has no completion, streak could still be alive if yesterday had completions
      if (toISO(checkDate) === todayStr) {
        const yesterdayIso = toISO(addDays(today, -1));
        if (datesSet.has(yesterdayIso)) {
          checkDate = addDays(today, -1);
          continue;
        }
      }
      break;
    }
  }

  // 2. 24-Week GitHub Heatmap Calculations
  // 24 weeks = 168 days. Starting on Monday of 23 weeks ago.
  const startOfGrid = addDays(startOfWeek, -23 * 7);
  const gridDays = Array.from({ length: 168 }, (_, i) => {
    const d = addDays(startOfGrid, i);
    const dateStr = toISO(d);
    const count = completedList.filter(
      (t) => t.completedAt && t.completedAt.split("T")[0] === dateStr,
    ).length;
    return { dateStr, date: d, count };
  });

  const gridWeeks: (typeof gridDays)[] = [];
  for (let i = 0; i < 24; i++) {
    gridWeeks.push(gridDays.slice(i * 7, (i + 1) * 7));
  }

  // 3. Priority breakdown calculations
  // Priority is stored as a number (usually 1=Low, 2=Normal, 3=High, 4=Urgent)
  const priorityLabels = {
    4: {
      label: "P1 Urgent",
      color: "bg-red-500",
      text: "text-red-500",
      rawColor: "#ef4444",
    },
    3: {
      label: "P2 High",
      color: "bg-orange-500",
      text: "text-orange-500",
      rawColor: "#f97316",
    },
    2: {
      label: "P3 Normal",
      color: "bg-blue-500",
      text: "text-blue-500",
      rawColor: "#3b82f6",
    },
    1: {
      label: "P4 Low",
      color: "bg-neutral-400",
      text: "text-neutral-400",
      rawColor: "#a3a3a3",
    },
  };

  const priorityCounts = { 4: 0, 3: 0, 2: 0, 1: 0 };
  completedList.forEach((t) => {
    const p = (t.priority || 1) as 1 | 2 | 3 | 4;
    if (priorityCounts[p] !== undefined) {
      priorityCounts[p]++;
    } else {
      priorityCounts[1]++;
    }
  });

  // 4. Project completions calculations
  const projectStats = state.projects
    .map((p) => {
      const completedCount = completedList.filter(
        (t) => t.projectId === p.id,
      ).length;
      const activeCount = state.tasks.filter(
        (t) => t.projectId === p.id && !t.completed,
      ).length;
      const totalCount = completedCount + activeCount;
      const ratio =
        totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return {
        ...p,
        completedCount,
        activeCount,
        ratio,
      };
    })
    .sort((a, b) => b.completedCount - a.completedCount);

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-up"
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-900/60 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col transition-all duration-300"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-100 dark:border-neutral-900">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand dark:text-white"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Productivity Analytics
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              A comprehensive insights report tracking your completions,
              streaks, and focus metrics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-850 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition cursor-pointer"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 px-6 border-b border-neutral-100 dark:border-neutral-900 text-sm font-semibold select-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "py-3 border-b-2 transition cursor-pointer",
              activeTab === "overview"
                ? "border-brand text-brand dark:border-white dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={cn(
              "py-3 border-b-2 transition cursor-pointer",
              activeTab === "projects"
                ? "border-brand text-brand dark:border-white dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            )}
          >
            Projects Breakdown
          </button>
          <button
            onClick={() => setActiveTab("priority")}
            className={cn(
              "py-3 border-b-2 transition cursor-pointer",
              activeTab === "priority"
                ? "border-brand text-brand dark:border-white dark:text-white"
                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200",
            )}
          >
            Priority Focus
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === "overview" && (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-2xl p-4.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Total Completed
                  </p>
                  <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1.5">
                    {totalCompleted}
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    completions stored
                  </p>
                </div>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-2xl p-4.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Current Streak
                  </p>
                  <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1.5 flex items-center gap-1.5">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-orange-500"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                    </svg>
                    {currentStreak} day{currentStreak === 1 ? "" : "s"}
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    consecutive days active
                  </p>
                </div>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-2xl p-4.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Daily Progress
                  </p>
                  <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1.5">
                    {completedTodayCount} / {dailyGoal}
                  </h3>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand dark:bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${dailyPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-2xl p-4.5">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Weekly Progress
                  </p>
                  <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1.5">
                    {completedThisWeekCount} / {weeklyGoal}
                  </h3>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-brand dark:bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${weeklyPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Large Heatmap Grid */}
              <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-3xl p-5">
                <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-4">
                  24-Week Contribution Heatmap
                </h4>
                <div className="overflow-x-auto pb-2 no-scrollbar">
                  <div className="flex gap-2 min-w-[700px] justify-center items-start">
                    {/* Weekday labels */}
                    <div className="flex flex-col justify-between text-[8px] font-bold text-neutral-400 h-[77px] pr-1.5 pt-0.5 select-none">
                      <span>M</span>
                      <span>W</span>
                      <span>F</span>
                      <span>S</span>
                    </div>

                    {/* Weeks columns */}
                    <div className="flex gap-1.5">
                      {gridWeeks.map((wk, wkIdx) => (
                        <div key={wkIdx} className="flex flex-col gap-1.5">
                          {wk.map((day) => {
                            let bgClass =
                              "bg-neutral-200/40 dark:bg-neutral-800/60 border border-neutral-200/20";
                            if (day.count > 4) {
                              bgClass = "bg-brand dark:bg-white";
                            } else if (day.count > 2) {
                              bgClass =
                                "bg-brand/60 dark:bg-white/60 border border-brand/20 dark:border-white/10";
                            } else if (day.count > 0) {
                              bgClass =
                                "bg-brand/25 dark:bg-white/20 border border-brand/10 dark:border-white/5";
                            }

                            const formattedDate = shortDate(day.date);
                            const titleTooltip = `${formattedDate}: ${day.count} task${day.count === 1 ? "" : "s"} completed`;

                            return (
                              <div
                                key={day.dateStr}
                                className={cn(
                                  "h-[9px] w-[9px] rounded-[2px] transition-all hover:scale-125 cursor-pointer",
                                  bgClass,
                                )}
                                title={titleTooltip}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-semibold border-t border-neutral-100 dark:border-neutral-900 pt-3 mt-4">
                  <span>Last 24 weeks completion activity</span>
                  <div className="flex items-center gap-1.5">
                    <span>Less</span>
                    <div className="h-2.5 w-2.5 rounded-[1.5px] bg-neutral-200/40 dark:bg-neutral-800/60 border border-neutral-200/20" />
                    <div className="h-2.5 w-2.5 rounded-[1.5px] bg-brand/25 dark:bg-white/20 border border-brand/10 dark:border-white/5" />
                    <div className="h-2.5 w-2.5 rounded-[1.5px] bg-brand/60 dark:bg-white/60 border border-brand/20 dark:border-white/10" />
                    <div className="h-2.5 w-2.5 rounded-[1.5px] bg-brand dark:bg-white" />
                    <span>More</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "projects" && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Completion rates per project
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {projectStats.map((p) => (
                  <div
                    key={p.id}
                    className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-2xl p-4.5 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                          {p.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-neutral-500">
                        {p.completedCount} completed
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-1 bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            backgroundColor: p.color,
                            width: `${p.ratio}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-neutral-500 min-w-[28px] text-right">
                        {p.ratio}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "priority" && (
            <div className="space-y-6">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Task Completed by Priority Distribution
              </h4>

              <div className="bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-900/60 rounded-3xl p-6 space-y-5">
                {([4, 3, 2, 1] as const).map((level) => {
                  const info = priorityLabels[level];
                  const count = priorityCounts[level];
                  const percentage =
                    totalCompleted > 0
                      ? Math.round((count / totalCompleted) * 100)
                      : 0;

                  return (
                    <div key={level} className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span
                          className={cn(
                            "font-bold flex items-center gap-1.5",
                            info.text,
                          )}
                        >
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full shrink-0",
                              info.color,
                            )}
                          />
                          {info.label}
                        </span>
                        <span className="text-neutral-500">
                          {count} task{count === 1 ? "" : "s"} ({percentage}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-neutral-200 dark:bg-neutral-855 h-3 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              info.color,
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
