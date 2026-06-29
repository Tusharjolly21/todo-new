"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  MONTH_NAMES,
  monthGrid,
  quickOptions,
  startOfToday,
  toISO,
} from "../date";
import { addMinutes, DURATIONS } from "../labels";
import { QuickDateIcon } from "./QuickDateIcon";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

interface DatePickerProps {
  /** Currently selected ISO date, if any. */
  value: string | null;
  onSelect: (iso: string | null) => void;
  onClose: () => void;
  /** Optional time block — when provided, the Time section is wired. */
  time?: string | null;
  duration?: number | null;
  onTime?: (time: string | null, duration: number | null) => void;
}

export function DatePicker({
  value,
  onSelect,
  onClose,
  time = null,
  duration = null,
  onTime,
}: DatePickerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const today = startOfToday();
  const todayISO = toISO(today);
  const options = quickOptions(today);

  const initial = value ? new Date(value) : today;
  const [month, setMonth] = useState(initial.getMonth());
  const [year, setYear] = useState(initial.getFullYear());
  const [timeOpen, setTimeOpen] = useState(!!time);

  // Close on outside click / Escape.
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

  function pick(iso: string | null) {
    onSelect(iso);
    onClose();
  }

  function prevMonth() {
    setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1));
  }
  function nextMonth() {
    setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1));
  }
  function goToday() {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }

  const cells = monthGrid(year, month);

  return (
    <div
      ref={ref}
      className="w-[290px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl animate-pop-in"
    >
      {/* free-text input */}
      <div className="border-b border-neutral-100 p-2.5">
        <input
          autoFocus
          placeholder="Type a due date"
          className="w-full rounded-md px-2 py-1.5 text-sm outline-none placeholder:text-neutral-400"
        />
      </div>

      {/* quick options */}
      <ul className="py-1">
        {options.map((opt) => (
          <li key={opt.key}>
            <button
              onClick={() => pick(opt.iso)}
              className="flex w-full items-center gap-3 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              <span className="flex w-5 justify-center">
                <QuickDateIcon kind={opt.key} />
              </span>
              <span className="flex-1 text-left text-[#202020]">
                {opt.label}
              </span>
              <span className="text-xs text-neutral-400">{opt.hint}</span>
            </button>
          </li>
        ))}
        {value && (
          <li>
            <button
              onClick={() => pick(null)}
              className="flex w-full items-center gap-3 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              <span className="flex w-5 justify-center text-neutral-500">
                <NoDateIcon />
              </span>
              <span className="flex-1 text-left text-[#202020]">No date</span>
            </button>
          </li>
        )}
      </ul>

      {/* calendar */}
      <div className="border-t border-neutral-100 px-3 pb-2 pt-2">
        <div className="flex items-center justify-between py-1">
          <span className="text-sm font-bold text-[#202020]">
            {MONTH_NAMES[month]} {year}
          </span>
          <div className="flex items-center gap-1 text-neutral-500">
            <CalBtn label="Previous month" onClick={prevMonth}>
              <ChevronLeft />
            </CalBtn>
            <CalBtn label="Today" onClick={goToday}>
              <Dot />
            </CalBtn>
            <CalBtn label="Next month" onClick={nextMonth}>
              <ChevronRight />
            </CalBtn>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-[11px] font-medium text-neutral-400">
          {WEEKDAYS.map((d, i) => (
            <span key={i} className="py-1">
              {d}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center text-sm">
          {cells.map((day, i) => {
            if (day === null) return <span key={i} />;
            const iso = toISO(new Date(year, month, day));
            const isToday = iso === todayISO;
            const isSelected = iso === value;
            return (
              <button
                key={i}
                onClick={() => pick(iso)}
                className={cn(
                  "mx-auto my-0.5 flex h-8 w-8 items-center justify-center rounded-full transition",
                  isSelected
                    ? "bg-brand font-semibold text-white"
                    : "hover:bg-neutral-100",
                  !isSelected && isToday && "font-bold text-brand",
                  !isSelected && !isToday && "text-[#202020]",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* time */}
      <div className="border-t border-neutral-100 p-2.5">
        {onTime && timeOpen ? (
          <TimeSection
            time={time}
            duration={duration}
            onChange={(t, d) => {
              onTime(t, d);
              setTimeOpen(false);
            }}
            onRemove={() => {
              onTime(null, null);
              setTimeOpen(false);
            }}
          />
        ) : (
          <button
            onClick={() => onTime && setTimeOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition"
          >
            <ClockIcon />
            {time ? `${time}${duration ? ` (${duration}m)` : ""}` : "Add Time"}
          </button>
        )}
      </div>
    </div>
  );
}

function TimeSection({
  time,
  duration,
  onChange,
  onRemove,
}: {
  time: string | null;
  duration: number | null;
  onChange: (time: string | null, duration: number | null) => void;
  onRemove: () => void;
}) {
  const [localTime, setLocalTime] = useState(time ?? "12:00");
  const [localDuration, setLocalDuration] = useState<number | null>(duration);
  const [timezone, setTimezone] = useState("Floating time");

  return (
    <div className="space-y-3.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50/20 text-[#202020]">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-4 text-xs font-bold text-neutral-600">
          <span>Time</span>
          <input
            type="time"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs outline-none focus:border-brand w-28 text-right font-semibold"
          />
        </div>

        <div className="flex items-center justify-between gap-4 text-xs font-bold text-neutral-600">
          <span>Duration</span>
          <select
            value={localDuration ?? ""}
            onChange={(e) =>
              setLocalDuration(e.target.value ? Number(e.target.value) : null)
            }
            className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs outline-none focus:border-brand w-32 text-right font-semibold"
          >
            <option value="">No duration</option>
            <option value="15">15m</option>
            <option value="30">30m</option>
            <option value="45">45m</option>
            <option value="60">1h</option>
            <option value="90">1.5h</option>
            <option value="120">2h</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4 text-xs font-bold text-neutral-600">
          <span>Time zone</span>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs outline-none focus:border-brand w-32 text-right font-semibold"
          >
            <option value="Floating time">Floating time</option>
            <option value="UTC">UTC</option>
            <option value="System Local">System Local</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-1.5 pt-2 border-t border-neutral-200/60">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-neutral-500 hover:bg-neutral-100 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onChange(localTime, localDuration);
          }}
          className="rounded-lg bg-brand px-3 py-1.5 text-[10px] font-bold text-white hover:bg-brand-dark transition shadow-2xs"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function CalBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}

function NoDateIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Dot() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
