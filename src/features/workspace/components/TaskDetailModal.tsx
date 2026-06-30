"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatDue } from "../date";
import { REMINDER_OPTIONS } from "../labels";
import { getMember } from "../members";
import { PRIORITY_META } from "../priority";
import { useTasks } from "../state";
import type { Task } from "../types";
import { AssigneePicker } from "./AssigneePicker";
import { DatePicker } from "./DatePicker";
import { DetailTaskMenu } from "./DetailTaskMenu";
import { LabelPicker } from "./LabelPicker";
import { MemberAvatar } from "./MemberAvatar";
import { PriorityFlag } from "./PriorityFlag";
import { PriorityPicker } from "./PriorityPicker";
import { ReminderPicker } from "./ReminderPicker";

export function TaskDetailModal() {
  const { state, dispatch } = useTasks();
  const task = state.tasks.find((t) => t.id === state.selectedId) ?? null;
  const [menuOpen, setMenuOpen] = useState(false);
  const [subtaskAdding, setSubtaskAdding] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [commentText, setCommentText] = useState("");
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(
    null,
  );
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "activity">(
    "comments",
  );
  const [pendingAttachments, setPendingAttachments] = useState<
    { name: string; url: string; size: string }[]
  >([]);

  function handleAddSubtask() {
    if (!newSubtaskTitle.trim() || !task) return;
    dispatch({
      type: "ADD_SUBTASK",
      taskId: task.id,
      title: newSubtaskTitle.trim(),
    });
    setNewSubtaskTitle("");
    setSubtaskAdding(false);
  }

  function handleAddComment() {
    if (!task) return;
    if (!commentText.trim() && pendingAttachments.length === 0) return;
    dispatch({
      type: "ADD_COMMENT",
      taskId: task.id,
      text: commentText.trim(),
      attachments:
        pendingAttachments.length > 0 ? pendingAttachments : undefined,
    });
    setCommentText("");
    setPendingAttachments([]);
  }

  function handleAttachmentClick() {
    const names = [
      "nicelydone_screencap.png",
      "todoist_ui_reference.pdf",
      "project_wireframe.png",
      "architecture_design.jpg",
    ];
    const name = names[Math.floor(Math.random() * names.length)];
    const size = Math.floor(Math.random() * 400 + 100) + " KB";
    setPendingAttachments((prev) => [...prev, { name, url: "#", size }]);
  }

  // Close on Escape.
  useEffect(() => {
    if (!task) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dispatch({ type: "CLOSE_TASK" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [task, dispatch]);

  if (!task) return null;

  const close = () => dispatch({ type: "CLOSE_TASK" });
  const color = PRIORITY_META[task.priority].color;

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center bg-neutral-950/40 backdrop-blur-md p-6 pt-[6vh] select-none"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        className="flex max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white dark:bg-[#0c0c0c] border border-neutral-200 dark:border-neutral-900/60 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Editable Content Pane */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar Breadcrumb */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            <div className="flex items-center gap-1.5 truncate">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              <span className="truncate">My work</span>
              <span className="text-neutral-350">/</span>
              <span className="truncate">Tasks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <IconBtn label="Previous task">
                <ChevronUp />
              </IconBtn>
              <IconBtn label="Next task">
                <ChevronDown />
              </IconBtn>
              <div className="relative">
                <IconBtn
                  label="More actions"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <Dots />
                </IconBtn>
                {menuOpen && (
                  <DetailTaskMenu
                    taskId={task.id}
                    onClose={() => setMenuOpen(false)}
                  />
                )}
              </div>
              <IconBtn label="Close" onClick={close}>
                <Close />
              </IconBtn>
            </div>
          </div>

          <div className="overflow-y-auto px-8 py-6 space-y-6">
            {/* Task Title & Description Header */}
            <div className="flex items-start gap-4">
              <button
                type="button"
                aria-label="Complete task"
                onClick={() => dispatch({ type: "COMPLETE", id: task.id })}
                style={{ borderColor: color, color }}
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 transition duration-200 relative group cursor-pointer"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-0 group-hover:opacity-100 transition duration-200"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </button>

              <div className="min-w-0 flex-1">
                <textarea
                  value={task.title}
                  rows={1}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_TASK",
                      id: task.id,
                      title: e.target.value,
                    })
                  }
                  className="w-full resize-none text-2xl font-black leading-snug text-neutral-900 dark:text-white outline-none bg-transparent"
                />
                <textarea
                  value={task.description ?? ""}
                  placeholder="Add a task description..."
                  rows={2}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_TASK",
                      id: task.id,
                      description: e.target.value,
                    })
                  }
                  className="mt-2 w-full resize-none text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 outline-none bg-transparent placeholder:text-neutral-450"
                />
              </div>
            </div>

            {/* Subtasks Box */}
            <div className="p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-900/10 space-y-4">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider select-none">
                Sub-tasks
              </h4>

              <div className="space-y-2">
                {(task.subtasks || []).map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 group/sub py-1.5 px-2.5 rounded-lg hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "TOGGLE_SUBTASK",
                          taskId: task.id,
                          subtaskId: sub.id,
                        })
                      }
                      className={cn(
                        "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-500 transition cursor-pointer",
                        sub.completed &&
                          "bg-neutral-400 border-neutral-400 dark:bg-neutral-700 dark:border-neutral-700",
                      )}
                    >
                      {sub.completed && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12.5l4.5 4.5L19 7"
                            stroke="#fff"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={cn(
                        "text-xs font-semibold text-neutral-800 dark:text-neutral-200",
                        sub.completed &&
                          "text-neutral-400 dark:text-neutral-500 line-through",
                      )}
                    >
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>

              {subtaskAdding ? (
                <div className="mt-2 space-y-2 max-w-md px-2">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Write sub-task title..."
                    className="w-full rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-semibold outline-none focus:border-brand dark:bg-neutral-900 dark:border-neutral-850 dark:text-white dark:focus:border-neutral-700 transition"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddSubtask();
                      if (e.key === "Escape") setSubtaskAdding(false);
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddSubtask}
                      disabled={!newSubtaskTitle.trim()}
                      className={cn(
                        "rounded-lg px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer",
                        newSubtaskTitle.trim()
                          ? "bg-brand hover:bg-brand-hover"
                          : "bg-brand/50 cursor-not-allowed",
                      )}
                    >
                      Add sub-task
                    </button>
                    <button
                      onClick={() => setSubtaskAdding(false)}
                      className="rounded-lg bg-neutral-100 dark:bg-neutral-850 px-3.5 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSubtaskAdding(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-hover cursor-pointer px-2"
                >
                  <Plus /> Add sub-task
                </button>
              )}
            </div>

            {/* Comments timeline and inputs */}
            <div className="mt-6 border-t border-neutral-100 dark:border-neutral-900 pt-5">
              {/* Tab Selector */}
              <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                <TabBtn
                  active={activeTab === "comments"}
                  onClick={() => setActiveTab("comments")}
                >
                  Comments
                </TabBtn>
                <TabBtn
                  active={activeTab === "activity"}
                  onClick={() => setActiveTab("activity")}
                >
                  Activity
                </TabBtn>
              </div>

              {activeTab === "activity" && <ActivityFeed task={task} />}

              {activeTab === "comments" && (
                <div className="space-y-4">
                  {/* Comments lists */}
                  <div className="space-y-4 mb-4 max-h-[180px] overflow-y-auto pr-1">
                    {(task.comments || []).length === 0 ? (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="mb-2 text-neutral-300 dark:text-neutral-800">
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </span>
                        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                          No comments yet
                        </p>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                          Add a comment below to start a conversations.
                        </p>
                      </div>
                    ) : (
                      (task.comments || []).map((comment) => (
                        <div
                          key={comment.id}
                          className="group/comment flex items-start gap-3 text-sm"
                        >
                          <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-extrabold text-white shadow-xs">
                            {comment.authorAvatar}
                          </span>
                          <div className="flex-1 min-w-0 bg-neutral-50/65 dark:bg-neutral-900/40 border border-neutral-100/50 dark:border-neutral-900/60 rounded-2xl p-3.5">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                                {comment.authorName}
                              </span>
                              <span className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                  {comment.edited ? "edited · " : ""}
                                  {comment.timestamp}
                                </span>
                                {comment.authorName === "Bertrand" &&
                                  editingCommentId !== comment.id && (
                                    <span className="flex items-center gap-0.5 opacity-0 transition group-hover/comment:opacity-100">
                                      <button
                                        aria-label="Edit comment"
                                        onClick={() => {
                                          setEditingCommentId(comment.id);
                                          setEditCommentText(comment.text);
                                        }}
                                        className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                      >
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M12 20h9" />
                                          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                        </svg>
                                      </button>
                                      <button
                                        aria-label="Delete comment"
                                        onClick={() =>
                                          dispatch({
                                            type: "DELETE_COMMENT",
                                            taskId: task.id,
                                            commentId: comment.id,
                                          })
                                        }
                                        className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-brand/10 hover:text-brand"
                                      >
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2.5"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                      </button>
                                    </span>
                                  )}
                              </span>
                            </div>

                            {editingCommentId === comment.id ? (
                              <div>
                                <textarea
                                  autoFocus
                                  value={editCommentText}
                                  onChange={(e) =>
                                    setEditCommentText(e.target.value)
                                  }
                                  rows={2}
                                  className="w-full resize-none rounded-xl border border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 p-2.5 text-xs font-semibold outline-none focus:border-brand"
                                />
                                <div className="mt-1.5 flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="rounded-lg bg-neutral-100 dark:bg-neutral-850 px-2.5 py-1 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (editCommentText.trim()) {
                                        dispatch({
                                          type: "EDIT_COMMENT",
                                          taskId: task.id,
                                          commentId: comment.id,
                                          text: editCommentText.trim(),
                                        });
                                      }
                                      setEditingCommentId(null);
                                    }}
                                    className="rounded-lg bg-brand px-2.5 py-1 text-[11px] font-bold text-white hover:bg-brand-hover cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 leading-relaxed break-words">
                                {comment.text}
                              </p>
                            )}

                            {/* Comment Attachments */}
                            {comment.attachments &&
                              comment.attachments.length > 0 && (
                                <div className="mt-2 space-y-1.5">
                                  {comment.attachments.map((att, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 rounded-xl border border-neutral-200/60 bg-white dark:bg-neutral-950 dark:border-neutral-900/60 p-2 text-[10px] font-bold text-neutral-600 dark:text-neutral-400"
                                    >
                                      <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-neutral-400"
                                      >
                                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
                                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                                      </svg>
                                      <span className="font-bold truncate flex-1">
                                        {att.name}
                                      </span>
                                      <span className="text-[9px] text-neutral-400">
                                        {att.size}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* Comment reactions */}
                            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                              {comment.reactions.map((r, idx) => (
                                <button
                                  key={idx}
                                  onClick={() =>
                                    dispatch({
                                      type: "TOGGLE_COMMENT_REACTION",
                                      taskId: task.id,
                                      commentId: comment.id,
                                      emoji: r.emoji,
                                    })
                                  }
                                  className={cn(
                                    "flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] border transition cursor-pointer select-none",
                                    r.userReacted
                                      ? "bg-brand/10 border-brand/40 text-brand dark:bg-white/10 dark:border-white/40 dark:text-white"
                                      : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:bg-neutral-950 dark:border-neutral-850 dark:text-neutral-400 dark:hover:bg-neutral-900",
                                  )}
                                >
                                  <span>{r.emoji}</span>
                                  <span className="font-extrabold">
                                    {r.count}
                                  </span>
                                </button>
                              ))}

                              {/* Reaction picker drop button */}
                              <div className="relative inline-block">
                                <button
                                  onClick={() =>
                                    setReactionPickerFor(
                                      reactionPickerFor === comment.id
                                        ? null
                                        : comment.id,
                                    )
                                  }
                                  className="flex h-5.5 w-5.5 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs text-neutral-400 hover:border-neutral-350 hover:text-neutral-700 dark:border-neutral-850 dark:bg-neutral-950 dark:text-neutral-500 dark:hover:text-neutral-300 transition cursor-pointer"
                                >
                                  +
                                </button>
                                {reactionPickerFor === comment.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-50"
                                      onClick={() => setReactionPickerFor(null)}
                                    />
                                    <div className="absolute left-0 bottom-7 z-[60] flex items-center gap-1 rounded-xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-900 p-1.5 shadow-xl animate-pop-in">
                                      {["👍", "❤️", "😄", "🎉", "🚀", "👀"].map(
                                        (emoji) => (
                                          <button
                                            key={emoji}
                                            onClick={() => {
                                              dispatch({
                                                type: "TOGGLE_COMMENT_REACTION",
                                                taskId: task.id,
                                                commentId: comment.id,
                                                emoji,
                                              });
                                              setReactionPickerFor(null);
                                            }}
                                            className="hover:scale-125 transition text-base p-0.5 cursor-pointer"
                                          >
                                            {emoji}
                                          </button>
                                        ),
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment inputs area */}
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-white mt-1 shadow-xs">
                      B
                    </span>
                    <div className="flex-1">
                      <div className="relative">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                          className="w-full resize-none rounded-2xl border border-neutral-200 dark:border-neutral-850 bg-white dark:bg-neutral-950 pl-4 pr-12 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 outline-none focus:border-brand dark:focus:border-neutral-700 placeholder:text-neutral-450 transition"
                        />
                        <div className="absolute right-3.5 bottom-3.5 flex items-center gap-1.5 text-neutral-400">
                          <button
                            onClick={handleAttachmentClick}
                            className="hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded transition cursor-pointer"
                            title="Attach mock file"
                          >
                            <Paperclip />
                          </button>
                          <button
                            onClick={handleAddComment}
                            disabled={
                              !commentText.trim() &&
                              pendingAttachments.length === 0
                            }
                            className={cn(
                              "hover:text-brand p-0.5 rounded transition cursor-pointer",
                              !commentText.trim() &&
                                pendingAttachments.length === 0 &&
                                "opacity-40 cursor-not-allowed",
                            )}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </button>
                        </div>
                      </div>
                      {pendingAttachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {pendingAttachments.map((att, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-850 px-3 py-1 text-[10px] font-bold text-neutral-600 dark:text-neutral-400"
                            >
                              <span>📎 {att.name}</span>
                              <button
                                onClick={() =>
                                  setPendingAttachments((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  )
                                }
                                className="text-neutral-400 hover:text-neutral-600 font-bold ml-1 cursor-pointer"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Metadata Side Cards Panel */}
        <aside className="hidden w-[280px] shrink-0 bg-neutral-50/50 dark:bg-neutral-950/20 border-l border-neutral-100 dark:border-neutral-900/60 px-6 py-6 sm:block overflow-y-auto space-y-3">
          <div className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4 select-none">
            Task Metadata
          </div>

          <MetaSection
            label="Project"
            icon={
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-neutral-400"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            }
          >
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[140px] block">
              {state.projects.find((p) => p.id === task.projectId)?.name ||
                "Inbox"}
            </span>
          </MetaSection>

          <AssigneeRow task={task} />
          <DueDateRow task={task} />
          <PriorityRow task={task} />
          <LabelsRow task={task} />
          <RemindersRow task={task} />
          <LocationRow task={task} />
        </aside>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Auxiliary Components and Row Cards
// ----------------------------------------------------

const DUE_COLOR: Record<string, string> = {
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#7c3aed",
  neutral: "#6b7280",
  red: "#dc4c3e",
};

function MetaSection({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left flex items-center justify-between">
      <div className="flex items-center gap-2 select-none">
        {icon}
        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

function AssigneeRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const member = getMember(task.assigneeId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left hover:border-neutral-350 dark:hover:border-neutral-850 transition duration-200 flex items-center justify-between cursor-pointer",
          open && "border-brand dark:border-white",
        )}
      >
        <div className="flex items-center gap-2 select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Assignee
          </span>
        </div>
        {member ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            <MemberAvatar member={member} /> {member.name}
          </span>
        ) : (
          <span className="text-neutral-400">
            <Plus />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1">
          <AssigneePicker
            value={task.assigneeId ?? null}
            onSelect={(assigneeId) =>
              dispatch({ type: "SET_ASSIGNEE", id: task.id, assigneeId })
            }
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function DueDateRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const due = task.dueDate ? formatDue(task.dueDate) : null;
  const label = due
    ? task.dueTime
      ? `${due.label} ${task.dueTime}`
      : due.label
    : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left hover:border-neutral-350 dark:hover:border-neutral-850 transition duration-200 flex items-center justify-between cursor-pointer",
          open && "border-brand dark:border-white",
        )}
      >
        <div className="flex items-center gap-2 select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Due date
          </span>
        </div>
        {label ? (
          <span
            className="text-xs font-semibold"
            style={{ color: DUE_COLOR[due!.color] }}
          >
            {label}
          </span>
        ) : (
          <span className="text-neutral-400">
            <Plus />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1">
          <DatePicker
            value={task.dueDate}
            onSelect={(iso) =>
              dispatch({ type: "SET_DUE", id: task.id, dueDate: iso })
            }
            time={task.dueTime ?? null}
            duration={task.duration ?? null}
            onTime={(dueTime, duration) =>
              dispatch({ type: "SET_TIME", id: task.id, dueTime, duration })
            }
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function PriorityRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const meta = PRIORITY_META[task.priority];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left hover:border-neutral-350 dark:hover:border-neutral-850 transition duration-200 flex items-center justify-between cursor-pointer",
          open && "border-brand dark:border-white",
        )}
      >
        <div className="flex items-center gap-2 select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Priority
          </span>
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold"
          style={{ color: task.priority === 4 ? "#737373" : meta.color }}
        >
          P{task.priority}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-1">
          <PriorityPicker
            value={task.priority}
            onSelect={(priority) =>
              dispatch({ type: "SET_PRIORITY", id: task.id, priority })
            }
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function LabelsRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const labels = task.labels ?? [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left hover:border-neutral-355 dark:hover:border-neutral-850 transition duration-200 flex items-center justify-between cursor-pointer",
          open && "border-brand dark:border-white",
        )}
      >
        <div className="flex items-center gap-2 select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Labels
          </span>
        </div>
        {labels.length > 0 ? (
          <span className="flex flex-wrap justify-end gap-1 max-w-[120px]">
            {labels.map((l) => (
              <span
                key={l}
                className="rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/40 px-1.5 py-0.5 text-[9px] font-bold text-neutral-600 dark:text-neutral-400"
              >
                @{l}
              </span>
            ))}
          </span>
        ) : (
          <span className="text-neutral-400">
            <Plus />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1">
          <LabelPicker
            value={labels}
            onChange={(next) =>
              dispatch({ type: "SET_LABELS", id: task.id, labels: next })
            }
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function RemindersRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const reminders = task.reminders ?? [];
  const summary =
    reminders.length === 1
      ? REMINDER_OPTIONS.find((o) => o.id === reminders[0])?.label
      : reminders.length > 1
        ? `${reminders.length} reminders`
        : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left hover:border-neutral-350 dark:hover:border-neutral-850 transition duration-200 flex items-center justify-between cursor-pointer",
          open && "border-brand dark:border-white",
        )}
      >
        <div className="flex items-center gap-2 select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Reminders
          </span>
        </div>
        {summary ? (
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {summary}
          </span>
        ) : (
          <span className="text-neutral-400">
            <Plus />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1">
          <ReminderPicker
            value={reminders}
            onChange={(next) =>
              dispatch({ type: "SET_REMINDERS", id: task.id, reminders: next })
            }
            onClose={() => setOpen(false)}
          />
        </div>
      )}
    </div>
  );
}

function LocationRow({ task }: { task: Task }) {
  return (
    <div className="relative">
      <button className="w-full bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-900 rounded-xl p-3 text-left hover:border-neutral-350 dark:hover:border-neutral-850 transition duration-200 flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2 select-none">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-400"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Location
          </span>
        </div>
        <span className="text-neutral-400">
          <Plus />
        </span>
      </button>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl text-xs font-bold transition select-none cursor-pointer",
        active
          ? "bg-brand text-white dark:bg-white dark:text-neutral-950 shadow-xs"
          : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-305",
      )}
    >
      {children}
    </button>
  );
}

function ActivityFeed({ task }: { task: Task }) {
  const entries: {
    icon: React.ReactNode;
    text: React.ReactNode;
    when: string;
  }[] = [
    {
      icon: <DotMark color="#22c55e" />,
      text: (
        <>
          <span className="font-semibold">Bertrand</span> added this task
        </>
      ),
      when: "Today",
    },
    ...(task.comments ?? []).map((c) => ({
      icon: <DotMark color="#3b82f6" />,
      text: (
        <>
          <span className="font-semibold">{c.authorName}</span> commented
        </>
      ),
      when: c.timestamp,
    })),
  ];

  return (
    <div className="mb-4 max-h-[200px] space-y-3 overflow-y-auto pr-1 py-1">
      {entries.map((e, i) => (
        <div key={i} className="flex items-start gap-3 text-xs">
          <span className="mt-1.5">{e.icon}</span>
          <div className="flex-1">
            <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
              {e.text}
            </p>
            <p className="text-[10px] text-neutral-400 mt-0.5">{e.when}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DotMark({ color }: { color: string }) {
  return (
    <span
      className="block h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition text-neutral-500 dark:text-neutral-400 cursor-pointer"
    >
      {children}
    </button>
  );
}

const ic = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;

function Plus() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ChevronUp() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M6 15l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Dots() {
  return (
    <svg {...ic} aria-hidden>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
function Close() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Paperclip() {
  return (
    <svg {...ic} aria-hidden>
      <path
        d="M21 12l-8.5 8.5a5 5 0 01-7-7L14 5a3.5 3.5 0 015 5l-8.5 8.5a2 2 0 01-3-3L15 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
