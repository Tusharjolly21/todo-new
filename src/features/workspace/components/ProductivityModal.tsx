"use client";

import { useEffect, useRef, useState } from "react";
import { useTasks } from "../state";
import { toISO, startOfToday, addDays, shortDate } from "../date";
import { cn } from "@/lib/utils/cn";

interface ProductivityModalProps {
  onClose: () => void;
  onOpenSettings: (tab: string) => void;
  onOpenReport?: () => void;
}

export function ProductivityModal({
  onClose,
  onOpenSettings,
  onOpenReport,
}: ProductivityModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useTasks();
  const [completedList, setCompletedList] = useState<any[]>([]);

  // Listen for clicks outside
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Load completed tasks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("todo_completed_tasks_store");
      if (saved) {
        setCompletedList(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [state.tasks]); // reload whenever tasks change

  // 1. Calculate Daily Goal
  const todayStr = toISO(startOfToday());
  const completedToday = completedList.filter((t) => {
    if (!t.completedAt) return false;
    return t.completedAt.split("T")[0] === todayStr;
  });
  const completedTodayCount = completedToday.length;
  const dailyGoal = state.productivityGoalDaily ?? 5;
  const dailyPercentage = Math.min(
    100,
    Math.round((completedTodayCount / dailyGoal) * 100),
  );

  // 2. Calculate Weekly Goal (Monday to Sunday)
  const today = startOfToday();
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
  const startOfWeek = addDays(
    today,
    -(currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1),
  ); // start on Monday
  const weekDates: string[] = Array.from({ length: 7 }, (_, i) =>
    toISO(addDays(startOfWeek, i)),
  );

  const completedThisWeek = completedList.filter((t) => {
    if (!t.completedAt) return false;
    const dateStr = t.completedAt.split("T")[0];
    return weekDates.includes(dateStr);
  });
  const completedThisWeekCount = completedThisWeek.length;
  const weeklyGoal = state.productivityGoalWeekly ?? 30;
  const weeklyPercentage = Math.min(
    100,
    Math.round((completedThisWeekCount / weeklyGoal) * 100),
  );

  // 3. Calculate 12-week stats for contribution heatmap
  const startOfGrid = addDays(startOfWeek, -11 * 7);
  const gridDays = Array.from({ length: 84 }, (_, i) => {
    const d = addDays(startOfGrid, i);
    const dateStr = toISO(d);
    const count = completedList.filter(
      (t) => t.completedAt && t.completedAt.split("T")[0] === dateStr,
    ).length;
    return { dateStr, date: d, count };
  });

  const gridWeeks: (typeof gridDays)[] = [];
  for (let i = 0; i < 12; i++) {
    gridWeeks.push(gridDays.slice(i * 7, (i + 1) * 7));
  }

  // 4. Level calculation
  const totalCompleted = completedList.length;
  let levelName = "Beginner";
  let nextLevelThreshold = 10;
  let prevLevelThreshold = 0;
  let points = totalCompleted * 50;

  if (totalCompleted >= 500) {
    levelName = "Grandmaster";
    nextLevelThreshold = 1000;
    prevLevelThreshold = 500;
  } else if (totalCompleted >= 200) {
    levelName = "Professional";
    nextLevelThreshold = 500;
    prevLevelThreshold = 200;
  } else if (totalCompleted >= 50) {
    levelName = "Intermediate";
    nextLevelThreshold = 200;
    prevLevelThreshold = 50;
  } else if (totalCompleted >= 10) {
    levelName = "Novice";
    nextLevelThreshold = 50;
    prevLevelThreshold = 10;
  }

  const levelProgress = Math.min(
    100,
    Math.round(
      ((totalCompleted - prevLevelThreshold) /
        (nextLevelThreshold - prevLevelThreshold)) *
        100,
    ),
  );

  // 5. Streaks calculation
  const completionDates = Array.from(
    new Set(
      completedList
        .filter((t) => t.completedAt)
        .map((t) => t.completedAt.split("T")[0]),
    ),
  ).sort((a, b) => b.localeCompare(a));

  const calculateStreaks = () => {
    if (completionDates.length === 0) return { current: 0, best: 0 };

    let currentStreak = 0;
    let checkDate = startOfToday();
    let hasCompletedToday = completionDates.includes(toISO(checkDate));
    let hasCompletedYesterday = completionDates.includes(
      toISO(addDays(checkDate, -1)),
    );

    if (hasCompletedToday || hasCompletedYesterday) {
      if (hasCompletedYesterday && !hasCompletedToday) {
        checkDate = addDays(checkDate, -1);
      }
      currentStreak = 1;
      while (completionDates.includes(toISO(addDays(checkDate, -1)))) {
        currentStreak++;
        checkDate = addDays(checkDate, -1);
      }
    }

    let bestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    const ascDates = [...completionDates].reverse().map((d) => new Date(d));

    for (let i = 0; i < ascDates.length; i++) {
      const d = ascDates[i];
      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diff = Math.round((d.getTime() - prevDate.getTime()) / 86400000);
        if (diff === 1) {
          tempStreak++;
        } else if (diff > 1) {
          if (tempStreak > bestStreak) bestStreak = tempStreak;
          tempStreak = 1;
        }
      }
      prevDate = d;
    }
    if (tempStreak > bestStreak) bestStreak = tempStreak;

    return { current: currentStreak, best: bestStreak };
  };

  const streaks = calculateStreaks();

  const radius = 26;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (dailyPercentage / 100) * circumference;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-[60] mt-1 w-80 rounded-xl border border-neutral-200 bg-white p-5 shadow-2xl animate-pop-in text-[#202020] text-left"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#202020]">Productivity</h3>
          <button
            onClick={() => {
              onOpenSettings("productivity");
              onClose();
            }}
            className="text-[11px] text-neutral-400 font-semibold hover:underline"
          >
            Daily: {dailyGoal} • Weekly: {weeklyGoal}
          </button>
        </div>
        <div className="text-right">
          <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
            {levelName}
          </span>
          <p className="text-[10px] text-neutral-400 mt-0.5">
            {points.toLocaleString()} pts
          </p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 mb-1">
          <span>Level Progress</span>
          <span>
            {totalCompleted} / {nextLevelThreshold} completed
          </span>
        </div>
        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${levelProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-b border-neutral-100 pb-4 mb-4">
        <div className="flex flex-col items-center justify-center p-3 bg-neutral-50/50 rounded-xl border border-neutral-100">
          <div className="relative flex items-center justify-center h-16 w-16 mb-2">
            <svg className="absolute -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-neutral-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-[#dc4c3e] transition-all duration-500"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <span className="text-sm font-bold text-[#202020]">
                {completedTodayCount}
              </span>
              <span className="text-[10px] text-neutral-400 block border-t border-neutral-200 mt-0.5 pt-0.5">
                /{dailyGoal}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-600">Daily Goal</span>
          <span className="text-[10px] text-neutral-400">
            {dailyPercentage}% achieved
          </span>
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-neutral-50/50 rounded-xl border border-neutral-100">
          <div className="relative flex items-center justify-center h-16 w-16 mb-2">
            <svg className="absolute -rotate-90 w-16 h-16">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-neutral-100"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-green-500 transition-all duration-500"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={
                  circumference - (weeklyPercentage / 100) * circumference
                }
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <span className="text-sm font-bold text-[#202020]">
                {completedThisWeekCount}
              </span>
              <span className="text-[10px] text-neutral-400 block border-t border-neutral-200 mt-0.5 pt-0.5">
                /{weeklyGoal}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-neutral-600">
            Weekly Goal
          </span>
          <span className="text-[10px] text-neutral-400">
            {weeklyPercentage}% achieved
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 text-center">
        <div className="p-2.5 bg-[#fcfaf8] border border-neutral-100 rounded-lg">
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Daily Streak
          </p>
          <p className="text-lg font-extrabold text-[#202020] mt-0.5">
            {streaks.current}{" "}
            <span className="text-xs font-bold text-neutral-500">days</span>
          </p>
          <p className="text-[9px] text-neutral-400">
            Best: {streaks.best} days
          </p>
        </div>
        <div className="p-2.5 bg-[#fcfaf8] border border-neutral-100 rounded-lg">
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
            Vacation
          </p>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "TOGGLE_VACATION_MODE",
                val: !state.vacationMode,
              })
            }
            className={cn(
              "mt-1.5 rounded px-2.5 py-1 text-[10px] font-bold border transition-colors select-none w-full",
              state.vacationMode
                ? "bg-brand text-white border-brand"
                : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50",
            )}
          >
            {state.vacationMode ? "Active" : "Off"}
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-neutral-500 mb-3">
          Productivity Heatmap
        </p>
        <div className="bg-neutral-50/30 border border-neutral-100 p-3 rounded-xl flex flex-col gap-2.5">
          <div className="flex gap-2 justify-center items-start">
            {/* Weekday labels */}
            <div className="flex flex-col justify-between text-[8px] font-bold text-neutral-400 h-[77px] pr-0.5 pt-0.5">
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
                      "bg-neutral-100/80 border border-neutral-200/20";
                    if (day.count > 4) {
                      bgClass = "bg-brand";
                    } else if (day.count > 2) {
                      bgClass = "bg-brand/60 border border-brand/20";
                    } else if (day.count > 0) {
                      bgClass = "bg-brand/25 border border-brand/10";
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

          <div className="flex items-center justify-between text-[9px] text-neutral-400 font-semibold border-t border-neutral-100/50 pt-2.5 px-0.5">
            <span>Last 12 weeks</span>
            <div className="flex items-center gap-1">
              <span>Less</span>
              <div className="h-2 w-2 rounded-[1.5px] bg-neutral-100/80 border border-neutral-200/20" />
              <div className="h-2 w-2 rounded-[1.5px] bg-brand/25 border border-brand/10" />
              <div className="h-2 w-2 rounded-[1.5px] bg-brand/60 border border-brand/20" />
              <div className="h-2 w-2 rounded-[1.5px] bg-brand" />
              <span>More</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            onClose();
            onOpenReport?.();
          }}
          className="w-full mt-4 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand hover:bg-brand-hover dark:hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          View Full Report
        </button>
      </div>
    </div>
  );
}
