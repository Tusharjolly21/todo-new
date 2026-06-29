"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import type { Task, Priority } from "../types";
import { PRIORITY_META } from "../priority";
import { useTasks } from "../state";
import { toISO, startOfToday, addDays, shortDate, formatDue } from "../date";
import { TaskContextMenu } from "./TaskContextMenu";

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (id: string) => void;
  onAddTaskOnDate: (dateStr: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
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
];

export function CalendarView({
  tasks,
  onSelectTask,
  onAddTaskOnDate,
}: CalendarViewProps) {
  const { state, dispatch } = useTasks();
  const today = new Date();

  // Default base view matches local clock: June 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 29));
  const [noDateOpen, setNoDateOpen] = useState(false);

  // Floating Context Menu state
  const [contextMenu, setContextMenu] = useState<{
    taskId: string;
    x: number;
    y: number;
  } | null>(null);

  // Hover Popover Tooltip state
  const [hoveredTask, setHoveredTask] = useState<{
    task: Task;
    x: number;
    y: number;
  } | null>(null);

  const contextRef = useRef<HTMLDivElement>(null);

  // Dismiss context menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        contextRef.current &&
        !contextRef.current.contains(e.target as Node)
      ) {
        setContextMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Calculate firstDayIndex offset such that Monday is 0, Sunday is 6
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
  const prevDaysInMonth = new Date(year, month, 0).getDate();

  const calendarCells: {
    dateStr: string;
    dayNum: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    monthLabel?: string;
  }[] = [];

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevDaysInMonth - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push({
      dateStr,
      dayNum: day,
      isCurrentMonth: false,
      isToday: false,
      monthLabel: day === 1 ? MONTHS[m].substring(0, 3) : undefined,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday =
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    calendarCells.push({
      dateStr,
      dayNum: day,
      isCurrentMonth: true,
      isToday,
      monthLabel: day === 1 ? MONTHS[month].substring(0, 3) : undefined,
    });
  }

  // Next month padding
  const remainingCells = 42 - calendarCells.length;
  for (let day = 1; day <= remainingCells; day++) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    const dateStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push({
      dateStr,
      dayNum: day,
      isCurrentMonth: false,
      isToday: false,
      monthLabel: day === 1 ? MONTHS[m].substring(0, 3) : undefined,
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date());
  };

  // Filter out active tasks with no due dates
  const unscheduledTasks = tasks.filter((t) => !t.completed && !t.dueDate);

  const handleContextMenu = (e: React.MouseEvent, taskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      taskId,
      x: e.clientX,
      y: e.clientY + window.scrollY,
    });
    setHoveredTask(null);
  };

  const handleTaskHover = (e: React.MouseEvent, task: Task) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredTask({
      task,
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY - 85,
    });
  };

  return (
    <div className="flex gap-4 items-start select-none">
      {/* Calendar Grid Section */}
      <div className="flex-1 mt-4 border border-neutral-200/70 bg-white rounded-2xl p-5 shadow-xs transition duration-200">
        {/* Calendar Header Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#202020]">
              {MONTHS[month]} {year}
            </h2>
            <button className="text-neutral-400 hover:text-neutral-600">
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

          <div className="flex items-center gap-1.5">
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white shadow-xs mr-2">
              <button
                onClick={handlePrevMonth}
                className="flex h-7 w-8 items-center justify-center hover:bg-neutral-50 text-neutral-500 transition border-r border-neutral-200"
                aria-label="Previous month"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleGoToday}
                className="px-2.5 h-7 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition border-r border-neutral-200"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="flex h-7 w-8 items-center justify-center hover:bg-neutral-50 text-neutral-500 transition"
                aria-label="Next month"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* No Date Toggle Button */}
            <button
              onClick={() => setNoDateOpen(!noDateOpen)}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-bold transition shadow-xs",
                noDateOpen
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white text-neutral-600 hover:bg-neutral-50",
              )}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              No date: {unscheduledTasks.length}
            </button>
          </div>
        </div>

        {/* Weekdays Header Row */}
        <div className="grid grid-cols-7 gap-px text-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-px bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200/50 shadow-inner">
          {calendarCells.map((cell, idx) => {
            const cellTasks = tasks.filter((t) => t.dueDate === cell.dateStr);

            return (
              <div
                key={idx}
                className={cn(
                  "min-h-[105px] bg-white p-2 flex flex-col group transition relative hover:bg-neutral-50/40",
                  !cell.isCurrentMonth && "bg-neutral-50/30 text-neutral-400",
                )}
              >
                {/* Day Number Label */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={cn(
                      "flex h-5 w-fit min-w-[20px] px-1 items-center justify-center rounded-full text-xs font-bold leading-none select-none",
                      cell.isToday && "bg-brand text-white",
                      cell.isCurrentMonth &&
                        !cell.isToday &&
                        "text-neutral-700",
                      !cell.isCurrentMonth && "text-neutral-400/80",
                    )}
                  >
                    {cell.monthLabel
                      ? `${cell.dayNum} ${cell.monthLabel}`
                      : cell.dayNum}
                  </span>

                  <button
                    onClick={() => onAddTaskOnDate(cell.dateStr)}
                    className="opacity-0 group-hover:opacity-100 text-[10px] text-neutral-400 hover:text-brand transition px-1 rounded hover:bg-neutral-100 font-bold"
                    title="Add task on this day"
                  >
                    ＋
                  </button>
                </div>

                {/* Tasks List inside cell */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[70px] scrollbar-thin">
                  {cellTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task.id)}
                      onContextMenu={(e) => handleContextMenu(e, task.id)}
                      onMouseEnter={(e) => handleTaskHover(e, task)}
                      onMouseLeave={() => setHoveredTask(null)}
                      className={cn(
                        "flex items-center gap-1.5 rounded px-2 py-1 text-[10px] font-semibold transition cursor-pointer select-none border truncate",
                        task.completed
                          ? "bg-neutral-50 text-neutral-400 border-neutral-100 line-through"
                          : "bg-white hover:bg-neutral-50 border-neutral-200/50 text-neutral-800 hover:border-neutral-300",
                      )}
                      title={task.title}
                    >
                      {/* Teardrop/circle checkbox matching priority */}
                      <span
                        className="h-2.5 w-2.5 rounded-full border shrink-0 transition"
                        style={{
                          borderColor: task.completed
                            ? "#a3a3a3"
                            : PRIORITY_META[task.priority].color,
                          backgroundColor: "transparent",
                        }}
                      />
                      <span className="truncate flex-1">{task.title}</span>
                      {task.dueTime && (
                        <span className="text-[8px] text-neutral-400 bg-neutral-100 px-1 py-0.5 rounded leading-none shrink-0 font-medium">
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Drawer: No Date Tasks Panel */}
      {noDateOpen && (
        <div className="w-[280px] shrink-0 mt-4 border border-neutral-200 bg-white rounded-2xl p-4 shadow-sm animate-pop-in select-none">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
            <h3 className="text-sm font-bold text-[#202020]">
              Unscheduled Tasks
            </h3>
            <button
              onClick={() => setNoDateOpen(false)}
              className="text-neutral-400 hover:text-neutral-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {unscheduledTasks.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">
                No unscheduled tasks found.
              </p>
            ) : (
              unscheduledTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t.id)}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 p-2.5 bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer transition select-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full border shrink-0"
                      style={{
                        borderColor: PRIORITY_META[t.priority].color,
                        backgroundColor: "transparent",
                      }}
                    />
                    <span className="text-xs text-neutral-800 font-semibold truncate">
                      {t.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({
                        type: "SET_DUE",
                        id: t.id,
                        dueDate: toISO(startOfToday()),
                      });
                    }}
                    className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                    title="Schedule for Today"
                  >
                    Schedule today
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hover Mini Details Card Popover */}
      {hoveredTask && (
        <div
          style={{ top: hoveredTask.y, left: hoveredTask.x }}
          className="absolute z-40 w-64 rounded-xl border border-neutral-200 bg-white p-3 shadow-xl pointer-events-none select-none animate-pop-in"
        >
          <div className="flex items-center gap-1 text-[9px] font-bold text-neutral-400 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span>Task Overview</span>
          </div>
          <h4 className="text-xs font-bold text-neutral-800 truncate">
            {hoveredTask.task.title}
          </h4>
          <div className="flex flex-wrap gap-2 mt-2 text-[9px] font-medium text-neutral-400">
            <span>
              📁{" "}
              {state.projects.find((p) => p.id === hoveredTask.task.projectId)
                ?.name || "Inbox"}
            </span>
            {hoveredTask.task.dueDate && (
              <span className="text-indigo-600">
                📅 {formatDue(hoveredTask.task.dueDate).label}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Context Options Popover Menu */}
      {contextMenu && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 50,
          }}
        >
          <TaskContextMenu
            taskId={contextMenu.taskId}
            onClose={() => setContextMenu(null)}
          />
        </div>
      )}
    </div>
  );
}
