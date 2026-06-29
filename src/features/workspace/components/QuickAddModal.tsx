"use client";

import { useEffect } from "react";
import type { TaskDraft } from "../types";
import { AddTaskEditor } from "./AddTask";

interface QuickAddModalProps {
  open: boolean;
  onSubmit: (draft: TaskDraft) => void;
  onClose: () => void;
  defaultDueDate?: string | null;
  defaultProjectId?: string | null;
}

/** Centered quick-add modal opened from the sidebar's "Add task" button. */
export function QuickAddModal({
  open,
  onSubmit,
  onClose,
  defaultDueDate = null,
  defaultProjectId = null,
}: QuickAddModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[12vh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add task"
        className="w-full max-w-xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <AddTaskEditor
          defaultDueDate={defaultDueDate}
          defaultProjectId={defaultProjectId}
          showDurationTip
          onSubmit={(draft) => {
            onSubmit(draft);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
