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
      className="fixed inset-0 z-40 flex items-start justify-center bg-black/40 p-6 pt-[6vh]"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={task.title}
        className="flex max-h-[88vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: editable content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* top bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 text-sm text-neutral-500">
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-neutral-400">#</span>
              <span className="truncate">My work</span>
              <span className="text-neutral-300">/</span>
              <span className="truncate">Tasks</span>
            </div>
            <div className="flex items-center gap-1">
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

          <div className="overflow-y-auto px-6 py-5">
            <div className="flex items-start gap-3">
              <button
                type="button"
                aria-label="Complete task"
                onClick={() => dispatch({ type: "COMPLETE", id: task.id })}
                style={{ borderColor: color, color }}
                className="mt-1.5 flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-2 hover:bg-black/[0.03]"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 hover:opacity-50"
                  />
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
                  className="w-full resize-none text-xl font-bold leading-snug text-[#202020] outline-none"
                />
                <textarea
                  value={task.description ?? ""}
                  placeholder="Description"
                  rows={2}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_TASK",
                      id: task.id,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full resize-none text-sm leading-relaxed text-neutral-700 outline-none placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Subtasks rendering & addition */}
            <div className="mt-4 pl-8 space-y-2">
              {(task.subtasks || []).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 group/sub py-1"
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
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 hover:border-neutral-500 transition",
                      sub.completed && "bg-neutral-400 border-neutral-400",
                    )}
                  >
                    {sub.completed && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
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
                      "text-sm text-[#202020]",
                      sub.completed && "text-neutral-400 line-through",
                    )}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}

              {subtaskAdding ? (
                <div className="mt-2 space-y-2 max-w-md">
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Write a sub-task name…"
                    className="w-full rounded-md border border-neutral-300 px-3 py-1.5 text-sm outline-none focus:border-brand"
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
                        "rounded-md px-3 py-1 text-xs font-semibold text-white transition",
                        newSubtaskTitle.trim()
                          ? "bg-brand hover:bg-brand-dark"
                          : "bg-brand/50 cursor-not-allowed",
                      )}
                    >
                      Add sub-task
                    </button>
                    <button
                      onClick={() => setSubtaskAdding(false)}
                      className="rounded-md bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSubtaskAdding(true)}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-brand"
                >
                  <Plus /> Add sub-task
                </button>
              )}
            </div>

            {/* Comment timeline and input */}
            <div className="mt-6 border-t border-neutral-100 pt-4">
              {/* tabs */}
              <div className="mb-3 flex items-center gap-1 border-b border-neutral-100">
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
                <>
                  {/* Comments list */}
                  <div className="space-y-4 mb-4 max-h-[160px] overflow-y-auto pr-1">
                    {(task.comments || []).length === 0 ? (
                      <div className="flex flex-col items-center py-6 text-center">
                        <span className="mb-2 text-neutral-300">
                          <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden
                          >
                            <path
                              d="M5 5h14v10H9l-4 4V5z"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <p className="text-sm font-medium text-neutral-500">
                          No comments yet
                        </p>
                        <p className="text-xs text-neutral-400">
                          Add a comment to start the conversation.
                        </p>
                      </div>
                    ) : (
                      (task.comments || []).map((comment) => (
                        <div
                          key={comment.id}
                          className="group/comment flex items-start gap-3 text-sm"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-white">
                            {comment.authorAvatar}
                          </span>
                          <div className="flex-1 min-w-0 bg-neutral-50 rounded-lg p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs text-neutral-800">
                                {comment.authorName}
                              </span>
                              <span className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-400">
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
                                        className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700"
                                      >
                                        <svg
                                          width="13"
                                          height="13"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          aria-hidden
                                        >
                                          <path
                                            d="M4 20h4L19 9l-4-4L4 16v4z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinejoin="round"
                                          />
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
                                        className="flex h-5 w-5 items-center justify-center rounded text-neutral-400 hover:bg-brand-tint hover:text-brand"
                                      >
                                        <svg
                                          width="13"
                                          height="13"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          aria-hidden
                                        >
                                          <path
                                            d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13h10l1-13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
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
                                  className="w-full resize-none rounded-md border border-neutral-300 p-2 text-sm outline-none focus:border-brand"
                                />
                                <div className="mt-1.5 flex justify-end gap-2">
                                  <button
                                    onClick={() => setEditingCommentId(null)}
                                    className="rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-200"
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
                                    className="rounded-md bg-brand px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-dark"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-neutral-700 leading-relaxed break-words">
                                {comment.text}
                              </p>
                            )}

                            {/* comment attachments */}
                            {comment.attachments &&
                              comment.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {comment.attachments.map((att, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 rounded border border-neutral-200 bg-white p-1.5 text-xs text-neutral-600"
                                    >
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="text-neutral-400"
                                      >
                                        <path
                                          d="M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7l-5-5z"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M14 2v4a2 2 0 002 2h4"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                        />
                                      </svg>
                                      <span className="font-medium truncate flex-1">
                                        {att.name}
                                      </span>
                                      <span className="text-[10px] text-neutral-400">
                                        {att.size}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                            {/* comment reactions */}
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
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
                                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border transition",
                                    r.userReacted
                                      ? "bg-brand-tint border-brand/50 text-brand"
                                      : "bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-100",
                                  )}
                                >
                                  <span>{r.emoji}</span>
                                  <span className="font-semibold">
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
                                  className="flex h-5 w-5 items-center justify-center rounded-full border border-neutral-200 bg-white text-xs text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition"
                                >
                                  +
                                </button>
                                {reactionPickerFor === comment.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-50"
                                      onClick={() => setReactionPickerFor(null)}
                                    />
                                    <div className="absolute left-0 bottom-6 z-[60] flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xl animate-pop-in">
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
                                            className="hover:scale-125 transition text-base p-0.5"
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

                  {/* Comment input box */}
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-white mt-1">
                      B
                    </span>
                    <div className="flex-1">
                      <div className="relative">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Comment"
                          rows={2}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                          className="w-full resize-none rounded-xl border border-neutral-300 pl-4 pr-12 py-2 text-sm text-[#202020] outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition"
                        />
                        <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-neutral-400">
                          <button
                            onClick={handleAttachmentClick}
                            className="hover:text-neutral-600 p-0.5 rounded transition"
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
                              "hover:text-brand p-0.5 rounded transition",
                              !commentText.trim() &&
                                pendingAttachments.length === 0 &&
                                "opacity-40 cursor-not-allowed",
                            )}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
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
                              className="flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs text-neutral-600"
                            >
                              <span>📎 {att.name}</span>
                              <button
                                onClick={() =>
                                  setPendingAttachments((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  )
                                }
                                className="text-neutral-400 hover:text-neutral-600 font-bold ml-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: metadata */}
        <aside className="hidden w-[260px] shrink-0 space-y-1 bg-[#fafafa] px-5 py-5 sm:block">
          <MetaSection label="Project">
            <span className="text-sm text-[#202020]">
              <span className="font-bold text-neutral-400"># </span>My work /
              Tasks
            </span>
          </MetaSection>
          <AssigneeRow task={task} />
          <DueDateRow task={task} />
          <PriorityRow task={task} />
          <LabelsRow task={task} />
          <RemindersRow task={task} />
          <MetaRow label="Location" />
        </aside>
      </div>
    </div>
  );
}

const DUE_COLOR: Record<string, string> = {
  green: "#16a34a",
  orange: "#ea580c",
  purple: "#7c3aed",
  neutral: "#6b7280",
  red: "#dc4c3e",
};

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
    <div className="relative border-b border-neutral-200/70 py-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-md px-2 py-1 text-left",
          open ? "bg-brand-tint" : "hover:bg-neutral-100",
        )}
      >
        <span className="text-xs font-semibold text-neutral-500">Due date</span>
        {label ? (
          <span
            className="text-sm font-medium"
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
        <div className="absolute right-0 top-full z-10 mt-1">
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

function AssigneeRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const member = getMember(task.assigneeId);

  return (
    <div className="relative border-b border-neutral-200/70 py-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-md px-2 py-1 text-left",
          open ? "bg-brand-tint" : "hover:bg-neutral-100",
        )}
      >
        <span className="text-xs font-semibold text-neutral-500">Assignee</span>
        {member ? (
          <span className="flex items-center gap-1.5 text-sm text-[#202020]">
            <MemberAvatar member={member} /> {member.name}
          </span>
        ) : (
          <span className="text-neutral-400">
            <Plus />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1">
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

function LabelsRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const labels = task.labels ?? [];

  return (
    <div className="relative border-b border-neutral-200/70 py-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between gap-2 rounded-md px-2 py-1 text-left",
          open ? "bg-brand-tint" : "hover:bg-neutral-100",
        )}
      >
        <span className="text-xs font-semibold text-neutral-500">Labels</span>
        {labels.length > 0 ? (
          <span className="flex flex-wrap justify-end gap-1">
            {labels.map((l) => (
              <span
                key={l}
                className="rounded bg-neutral-200 px-1.5 py-0.5 text-xs font-medium text-neutral-700"
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
        <div className="absolute right-0 top-full z-10 mt-1">
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
    <div className="relative border-b border-neutral-200/70 py-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-md px-2 py-1 text-left",
          open ? "bg-brand-tint" : "hover:bg-neutral-100",
        )}
      >
        <span className="text-xs font-semibold text-neutral-500">
          Reminders
        </span>
        {summary ? (
          <span className="text-sm font-medium text-[#202020]">{summary}</span>
        ) : (
          <span className="text-neutral-400">
            <Plus />
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-1">
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

function PriorityRow({ task }: { task: Task }) {
  const { dispatch } = useTasks();
  const [open, setOpen] = useState(false);
  const meta = PRIORITY_META[task.priority];

  return (
    <div className="relative border-b border-neutral-200/70 py-2.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "-mx-2 flex w-[calc(100%+1rem)] items-center justify-between rounded-md px-2 py-1 text-left",
          open ? "bg-brand-tint" : "hover:bg-neutral-100",
        )}
      >
        <span className="text-xs font-semibold text-neutral-500">Priority</span>
        <span
          className="flex items-center gap-1.5 text-sm"
          style={{ color: task.priority === 4 ? "#202020" : meta.color }}
        >
          <PriorityFlag color={meta.color} filled={task.priority !== 4} /> P
          {task.priority}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-1">
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
        "-mb-px border-b-2 px-3 py-2 text-sm font-semibold transition",
        active
          ? "border-brand text-[#202020]"
          : "border-transparent text-neutral-400 hover:text-neutral-600",
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
        <div key={i} className="flex items-start gap-3 text-sm">
          <span className="mt-1.5">{e.icon}</span>
          <div className="flex-1">
            <p className="text-neutral-700">{e.text}</p>
            <p className="text-[11px] text-neutral-400">{e.when}</p>
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

function MetaSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-neutral-200/70 py-2.5">
      <p className="mb-1 text-xs font-semibold text-neutral-500">{label}</p>
      {children}
    </div>
  );
}

function MetaRow({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-neutral-200/70 py-2.5",
        highlight && "-mx-2 rounded-md bg-brand-tint px-2",
      )}
    >
      <span className="text-xs font-semibold text-neutral-500">{label}</span>
      <span className="text-neutral-400">
        <Plus />
      </span>
    </div>
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
      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-100"
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
        strokeWidth="2"
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
        strokeWidth="2"
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
        strokeWidth="2"
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
        strokeWidth="2"
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
