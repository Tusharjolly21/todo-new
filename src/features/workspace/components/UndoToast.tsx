"use client";

import { useEffect } from "react";
import { useTasks } from "../state";

const AUTO_DISMISS_MS = 5000;

export function UndoToast() {
  const { state, dispatch } = useTasks();
  const pending = state.pendingUndo;

  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(
      () => dispatch({ type: "DISMISS_UNDO" }),
      AUTO_DISMISS_MS,
    );
    return () => clearTimeout(timer);
  }, [pending, dispatch]);

  if (!pending) return null;

  const message =
    pending.kind === "deleted"
      ? "1 task deleted"
      : pending.kind === "moved"
        ? `Task moved to ${pending.projectName}`
        : "1 task completed";
  const accent = pending.kind === "completed" ? "bg-green-500" : "bg-brand";

  return (
    <div className="fixed bottom-6 left-6 z-50 flex animate-pop-in items-center gap-4 rounded-lg bg-[#202020] px-4 py-3 text-sm text-white shadow-xl">
      <span className="flex items-center gap-2">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full ${accent}`}
        >
          {pending.kind === "completed" ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : pending.kind === "deleted" ? (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        {message}
      </span>
      <button
        type="button"
        onClick={() => dispatch({ type: "UNDO" })}
        className="font-semibold text-brand hover:underline"
      >
        Undo
      </button>
    </div>
  );
}
