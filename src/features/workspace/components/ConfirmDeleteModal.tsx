"use client";

import { useEffect } from "react";
import { useTasks } from "../state";

export function ConfirmDeleteModal() {
  const { state, dispatch } = useTasks();
  const task = state.tasks.find((t) => t.id === state.confirmDeleteId) ?? null;

  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CANCEL_DELETE" });
      if (e.key === "Enter") dispatch({ type: "DELETE_TASK", id: task.id });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [task, dispatch]);

  if (!task) return null;

  const cancel = () => dispatch({ type: "CANCEL_DELETE" });

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/40 p-6 pt-[18vh]"
      onClick={cancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="w-full max-w-md animate-pop-in rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-neutral-300 text-neutral-400">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M12 8h.01M11 12h1v5h1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <button
            aria-label="Close"
            onClick={cancel}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-[#202020]">
          Are you sure you want to delete{" "}
          <span className="font-bold">{task.title}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={cancel}
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
          >
            Cancel
          </button>
          <button
            onClick={() => dispatch({ type: "DELETE_TASK", id: task.id })}
            className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
