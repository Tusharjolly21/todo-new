"use client";

import { useEffect, useRef, useState } from "react";
import { useTasks } from "../state";
import { toISO, startOfToday, addDays } from "../date";
import { cn } from "@/lib/utils/cn";

interface ProductivityModalProps {
  onClose: () => void;
  onOpenSettings: (tab: string) => void;
}

export function ProductivityModal({
  onClose,
  onOpenSettings,
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

  // 3. Calculate 7-day stats for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, -6 + i);
    const dateStr = toISO(d);
    const dayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      d.getDay()
    ];
    const count = completedList.filter(
      (t) => t.completedAt && t.completedAt.split("T")[0] === dateStr,
    ).length;
    return { dateStr, dayLabel, count };
  });

  const maxCompletions = Math.max(1, ...last7Days.map((d) => d.count));

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

  const radius = 32;
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
          Last 7 Days Completion
        </p>
        <div className="flex items-end justify-between h-24 px-1 pb-1 pt-4 border-b border-neutral-100 bg-neutral-50/30 rounded-lg">
          {last7Days.map((d) => {
            const barHeight = Math.round((d.count / maxCompletions) * 60);
            return (
              <div
                key={d.dateStr}
                className="flex flex-col items-center flex-1 group relative"
              >
                <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800 text-white text-[9px] font-bold rounded px-1.5 py-0.5 pointer-events-none whitespace-nowrap z-50">
                  {d.count} tasks
                </div>
                <div
                  style={{ height: `${barHeight || 4}px` }}
                  className={cn(
                    "w-3 rounded-t transition-all duration-500",
                    d.count > 0 ? "bg-brand" : "bg-neutral-200",
                  )}
                />
                <span className="text-[9px] text-neutral-400 font-bold mt-2.5">
                  {d.dayLabel[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
