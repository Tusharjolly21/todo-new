"use client";

import { useState } from "react";
import { useTasks } from "../state";
import { toISO, startOfToday, addDays, shortDate, weekdayLong } from "../date";
import { AddTaskEditor } from "./AddTask";
import { cn } from "@/lib/utils/cn";
import { BoardTaskCard } from "./BoardTaskCard";

export function UpcomingView() {
  const { state, dispatch } = useTasks();
  const [baseDate, setBaseDate] = useState<Date>(startOfToday());
  const [addingDate, setAddingDate] = useState<string | null>(null);

  // Retrieve overdue tasks (not completed, due date is in the past)
  const todayStr = toISO(startOfToday());
  const overdueTasks = state.tasks.filter(
    (t) => !t.completed && t.dueDate && t.dueDate < todayStr,
  );

  // Determine how many calendar columns to show (if Overdue is shown, we show 3 upcoming days, else 4)
  const numDaysToShow = overdueTasks.length > 0 ? 3 : 4;

  const days = Array.from({ length: numDaysToShow }, (_, i) => {
    const d = addDays(baseDate, i);
    const dateStr = toISO(d);
    return {
      date: d,
      dateStr,
      isToday: dateStr === todayStr,
      isTomorrow: dateStr === toISO(addDays(startOfToday(), 1)),
    };
  });

  const handlePrevDay = () => {
    setBaseDate((d) => addDays(d, -1));
  };

  const handleNextDay = () => {
    setBaseDate((d) => addDays(d, 1));
  };

  const handleJumpToToday = () => {
    setBaseDate(startOfToday());
  };

  const handleRescheduleOverdue = () => {
    overdueTasks.forEach((t) => {
      dispatch({
        type: "SET_DUE",
        id: t.id,
        dueDate: todayStr,
      });
    });
  };

  const getColumnHeaderLabel = (d: (typeof days)[0]) => {
    const dateLabel = shortDate(d.date);
    const dayName = weekdayLong(d.date);
    if (d.isToday) {
      return `${dateLabel} · Today`;
    }
    if (d.isTomorrow) {
      return `${dateLabel} · Tomorrow`;
    }
    return `${dateLabel} · ${dayName}`;
  };

  // Format month and year label under title
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][baseDate.getMonth()];
  const yearNum = baseDate.getFullYear();

  return (
    <div className="bg-white min-h-dvh">
      {/* Top Bar spacing */}
      <div className="flex items-center justify-end px-6 py-3 border-b border-neutral-100 h-[47px] select-none bg-white" />

      {/* Main Content Area */}
      <div className="px-8 py-8 select-none">
        {/* Title area */}
        <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#202020]">
              Upcoming
            </h1>
            <button className="flex items-center gap-1 text-xs font-bold text-neutral-500 mt-1 hover:text-neutral-700 transition">
              <span>
                {monthName} {yearNum}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs">
            <button
              onClick={handlePrevDay}
              className="flex h-8 w-8 items-center justify-center hover:bg-neutral-50 text-neutral-500 transition border-r border-neutral-200"
              title="Previous day"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={handleJumpToToday}
              className="px-3 h-8 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition border-r border-neutral-200"
            >
              Today
            </button>
            <button
              onClick={handleNextDay}
              className="flex h-8 w-8 items-center justify-center hover:bg-neutral-50 text-neutral-500 transition"
              title="Next day"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Columns Container */}
        <div className="flex gap-6 overflow-x-auto pb-8 items-start max-w-7xl mx-auto no-scrollbar">
          {/* Overdue Column (Only shows if overdue count > 0) */}
          {overdueTasks.length > 0 && (
            <div className="flex-1 min-w-[300px] max-w-[325px] shrink-0 bg-red-50/20 rounded-2xl p-4.5 border border-red-100/50 space-y-4">
              <div className="flex items-center justify-between border-b border-red-100/40 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-red-600">
                    Overdue
                  </span>
                  <span className="text-[10px] font-bold bg-red-150/40 px-1.5 py-0.5 rounded-md text-red-700">
                    {overdueTasks.length}
                  </span>
                </div>
                <button
                  onClick={handleRescheduleOverdue}
                  className="text-xs font-bold text-red-600 hover:text-red-800 transition"
                >
                  Reschedule
                </button>
              </div>

              <div className="space-y-2.5">
                {overdueTasks.map((t) => (
                  <BoardTaskCard key={t.id} task={t} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Day Columns */}
          {days.map((d) => {
            const dayTasks = state.tasks.filter(
              (t) => t.dueDate === d.dateStr && !t.completed,
            );
            return (
              <div
                key={d.dateStr}
                className="flex-1 min-w-[300px] max-w-[325px] shrink-0 bg-neutral-50/50 rounded-2xl p-4.5 border border-neutral-200/50 space-y-4"
              >
                {/* Column Header */}
                <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2">
                  <span
                    className={cn(
                      "text-xs font-bold",
                      d.isToday ? "text-[#171717]" : "text-neutral-500",
                    )}
                  >
                    {getColumnHeaderLabel(d)}
                  </span>
                  <span className="text-[10px] font-bold bg-neutral-200/50 px-1.5 py-0.5 rounded-md text-neutral-600">
                    {dayTasks.length}
                  </span>
                </div>

                {/* Task Stack */}
                <div className="space-y-2.5">
                  {dayTasks.map((t) => (
                    <BoardTaskCard key={t.id} task={t} />
                  ))}

                  {/* Inline Add Task Trigger */}
                  {addingDate === d.dateStr ? (
                    <div className="pt-2 bg-white rounded-xl border border-neutral-200 p-3 shadow-sm">
                      <AddTaskEditor
                        defaultDueDate={d.dateStr}
                        hideProjectPicker={false}
                        onSubmit={(draft) => {
                          dispatch({ type: "ADD_TASK", draft });
                          setAddingDate(null);
                        }}
                        onCancel={() => setAddingDate(null)}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingDate(d.dateStr)}
                      className="group/btn flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-semibold text-neutral-400 hover:text-brand transition w-full text-left mt-1.5"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full text-brand transition group-hover/btn:bg-brand group-hover/btn:text-white">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                        </svg>
                      </span>
                      Add task
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
