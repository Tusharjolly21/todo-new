"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  createdAt?: number;
  edited?: boolean;
  reactions: { emoji: string; count: number; userReacted: boolean }[];
  attachments?: { name: string; url: string; size: string }[];
}

interface ProjectCommentsDrawerProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  initialTab?: "comments" | "activity";
}

const EMOJIS = ["👍", "❤️", "😄", "🎉", "🚀", "👀"];

const DEFAULT_COMMENTS: Record<string, Comment[]> = {
  inbox: [
    {
      id: "c1",
      authorName: "Bertrand",
      authorAvatar: "B",
      text: "Welcome to your project comments! Ask questions, document updates, or upload designs.",
      timestamp: "Today 10:24",
      createdAt: Date.now() - 4 * 3600_000,
      reactions: [{ emoji: "👍", count: 2, userReacted: true }],
    },
  ],
};

export function ProjectCommentsDrawer({
  open,
  onClose,
  projectId,
  projectName,
  initialTab = "comments",
}: ProjectCommentsDrawerProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [inputText, setInputText] = useState("");
  const [attachments, setAttachments] = useState<
    { name: string; size: string; url: string }[]
  >([]);
  const [tab, setTab] = useState<"comments" | "activity">("comments");
  const [reactionFor, setReactionFor] = useState<string | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [copiedMsg, setCopiedMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  function copyToClipboard(text: string, message: string) {
    void navigator.clipboard?.writeText(text).catch(() => {});
    setMenuFor(null);
    setCopiedMsg(message);
    setTimeout(() => setCopiedMsg(null), 1600);
  }

  useEffect(() => {
    if (!open) return;
    try {
      const saved = localStorage.getItem(`project_comments_${projectId}`);
      setComments(
        saved ? JSON.parse(saved) : DEFAULT_COMMENTS[projectId] || [],
      );
    } catch {
      setComments(DEFAULT_COMMENTS[projectId] || []);
    }
    setTab(initialTab);
  }, [open, projectId, initialTab]);

  function save(next: Comment[]) {
    setComments(next);
    try {
      localStorage.setItem(
        `project_comments_${projectId}`,
        JSON.stringify(next),
      );
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function addComment() {
    if (!inputText.trim() && attachments.length === 0) return;
    const now = new Date();
    const c: Comment = {
      id: `c_${Date.now()}`,
      authorName: "Bertrand",
      authorAvatar: "B",
      text: inputText.trim(),
      timestamp: `Today ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}`,
      createdAt: Date.now(),
      reactions: [],
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    save([...comments, c]);
    setInputText("");
    setAttachments([]);
    setTimeout(
      () =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }),
      0,
    );
  }

  function attachMock() {
    const names = [
      "inbox_notes.docx",
      "mockup_v2.png",
      "reference.jpg",
      "budget.xlsx",
    ];
    setAttachments((p) => [
      ...p,
      {
        name: names[Math.floor(Math.random() * names.length)],
        size: Math.floor(Math.random() * 500 + 50) + " KB",
        url: "#",
      },
    ]);
  }

  function toggleReaction(id: string, emoji: string) {
    save(
      comments.map((c) => {
        if (c.id !== id) return c;
        const list = [...c.reactions];
        const m = list.find((r) => r.emoji === emoji);
        if (m) {
          m.count += m.userReacted ? -1 : 1;
          m.userReacted = !m.userReacted;
        } else list.push({ emoji, count: 1, userReacted: true });
        return { ...c, reactions: list.filter((r) => r.count > 0) };
      }),
    );
    setReactionFor(null);
  }

  function deleteComment(id: string) {
    save(comments.filter((c) => c.id !== id));
    setMenuFor(null);
  }

  function saveEdit(id: string) {
    if (editText.trim())
      save(
        comments.map((c) =>
          c.id === id ? { ...c, text: editText.trim(), edited: true } : c,
        ),
      );
    setEditingId(null);
  }

  const now = new Date();
  const dateHeader = `${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} · Today · ${now.toLocaleString("en-US", { weekday: "long" })}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
          <div className="flex items-center gap-2 text-[#202020]">
            <InboxGlyph />
            <span className="text-base font-bold">{projectName}</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <CloseIcon />
          </button>
        </div>

        {/* tabs */}
        <div className="px-5 py-3">
          <div className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 p-0.5">
            <Tab active={tab === "comments"} onClick={() => setTab("comments")}>
              Comments
              {comments.length > 0 && (
                <span className="ml-1.5 text-neutral-400">
                  {comments.length}
                </span>
              )}
            </Tab>
            <Tab active={tab === "activity"} onClick={() => setTab("activity")}>
              Activity
            </Tab>
          </div>
        </div>

        {/* body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4">
          {tab === "comments" ? (
            comments.length === 0 ? (
              <div className="flex h-full min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <BalloonsIllustration />
                <p className="mt-6 max-w-[260px] text-sm leading-relaxed text-neutral-500">
                  Centralize your project&apos;s high-level discussions in
                  project comments.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {comments.map((c) => (
                  <div key={c.id} className="group/c flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xs font-bold text-white">
                      {c.authorAvatar}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-[#202020]">
                            {c.authorName}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {c.edited ? "edited · " : ""}
                            {c.timestamp}
                          </span>
                        </span>
                        {/* row actions */}
                        <span className="relative flex items-center gap-0.5 opacity-0 transition group-hover/c:opacity-100">
                          <button
                            aria-label="Add reaction"
                            onClick={() => {
                              setReactionFor(
                                reactionFor === c.id ? null : c.id,
                              );
                              setMenuFor(null);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <SmilePlus />
                          </button>
                          <button
                            aria-label="More"
                            onClick={() => {
                              setMenuFor(menuFor === c.id ? null : c.id);
                              setReactionFor(null);
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <Dots />
                          </button>
                          {menuFor === c.id && (
                            <div className="absolute right-0 top-8 z-10 w-52 rounded-lg border border-neutral-200 bg-white py-1.5 shadow-xl animate-pop-in">
                              <MenuItem
                                icon={<PencilMini />}
                                onClick={() => {
                                  setEditingId(c.id);
                                  setEditText(c.text);
                                  setMenuFor(null);
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                icon={<CopyTextMini />}
                                onClick={() =>
                                  copyToClipboard(c.text, "Copied!")
                                }
                              >
                                Copy text
                              </MenuItem>
                              <MenuItem
                                icon={<LinkMini />}
                                onClick={() =>
                                  copyToClipboard(
                                    `${location.origin}/app?comment=${c.id}`,
                                    "Link copied!",
                                  )
                                }
                              >
                                Copy link to comment
                              </MenuItem>
                              <div className="my-1 h-px bg-neutral-100" />
                              <MenuItem
                                icon={<TrashMini />}
                                danger
                                onClick={() => deleteComment(c.id)}
                              >
                                Delete
                              </MenuItem>
                            </div>
                          )}
                        </span>
                      </div>

                      {editingId === c.id ? (
                        <div className="mt-1 rounded-xl border border-neutral-300 focus-within:border-neutral-400">
                          <textarea
                            autoFocus
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit(c.id);
                              }
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="w-full resize-none rounded-t-xl bg-transparent px-3 py-2.5 text-sm text-[#202020] outline-none"
                          />
                          <div className="flex items-center justify-between px-2.5 pb-2">
                            <div className="flex items-center gap-1 text-neutral-500">
                              <ToolBtn label="Attach">
                                <PaperclipIcon />
                              </ToolBtn>
                              <ToolBtn label="Voice">
                                <MicIcon />
                              </ToolBtn>
                              <ToolBtn
                                label="Emoji"
                                onClick={() => setEditText((v) => v + " 😊")}
                              >
                                <SmileIcon />
                              </ToolBtn>
                              <ToolBtn label="Extensions">
                                <PuzzleIcon />
                              </ToolBtn>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => saveEdit(c.id)}
                                className="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-[#202020]">
                          {c.text}
                        </p>
                      )}

                      {c.attachments && c.attachments.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {c.attachments.map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 p-2 text-xs"
                            >
                              <span className="truncate font-medium text-neutral-700">
                                📎 {f.name}
                              </span>
                              <span className="ml-2 shrink-0 text-[10px] text-neutral-400">
                                {f.size}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {(c.reactions.length > 0 || reactionFor === c.id) && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {c.reactions.map((r, i) => (
                            <button
                              key={i}
                              onClick={() => toggleReaction(c.id, r.emoji)}
                              className={cn(
                                "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition",
                                r.userReacted
                                  ? "border-blue-400 bg-blue-50 text-blue-600"
                                  : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-100",
                              )}
                            >
                              <span>{r.emoji}</span>
                              <span className="font-semibold">{r.count}</span>
                            </button>
                          ))}
                          <div className="relative">
                            <button
                              aria-label="Add reaction"
                              onClick={() =>
                                setReactionFor(
                                  reactionFor === c.id ? null : c.id,
                                )
                              }
                              className="flex h-6 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                            >
                              <SmilePlus />
                            </button>
                            {reactionFor === c.id && (
                              <div className="absolute left-0 top-7 z-20 flex gap-1 rounded-lg border border-neutral-200 bg-white p-1.5 shadow-xl animate-pop-in">
                                {EMOJIS.map((e) => (
                                  <button
                                    key={e}
                                    onClick={() => toggleReaction(c.id, e)}
                                    className="rounded p-0.5 text-base transition hover:scale-125"
                                  >
                                    {e}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // ACTIVITY
            <div>
              <p className="mb-1 text-sm font-bold text-[#202020]">
                {dateHeader}
              </p>
              <div>
                {[...comments].reverse().map((c) => (
                  <ActivityRow
                    key={c.id}
                    badge="comment"
                    time={c.timestamp.replace(/^Today\s*/, "")}
                  >
                    <Bold>You</Bold> added a project comment to{" "}
                    <span className="text-neutral-400">{projectName}</span>:
                    <span className="mt-0.5 block">{c.text}</span>
                  </ActivityRow>
                ))}
                <ActivityRow badge="delete" faded time="11:39">
                  <Bold>You</Bold> deleted a task:{" "}
                  <span className="text-neutral-400 line-through">
                    Download additional free apps and plugins
                  </span>
                </ActivityRow>
                <ActivityRow badge="add" time="11:38">
                  <Bold>You</Bold> added a task: Buy groceries
                </ActivityRow>
                <ActivityRow badge="add" time="11:36">
                  <Bold>You</Bold> added a task: Capture Todoist
                </ActivityRow>
                <ActivityRow badge="add" time="11:34">
                  <Bold>You</Bold> added a task: Browse the Todoist Inspiration
                  Hub
                </ActivityRow>
                <ActivityRow badge="add" time="11:32">
                  <Bold>You</Bold> added a task: Take the productivity method
                  quiz
                </ActivityRow>
                <ActivityRow badge="add" time="11:30">
                  <Bold>You</Bold> added a task: Download additional free apps
                  and plugins
                </ActivityRow>
              </div>
              <button
                type="button"
                className="mt-2 py-3 text-sm font-medium text-brand hover:underline"
              >
                Load more history from 3 weeks ago...
              </button>
            </div>
          )}
        </div>

        {/* composer */}
        {tab === "comments" && (
          <div className="border-t border-neutral-100 p-4">
            {attachments.length > 0 && (
              <div className="mb-2 space-y-1">
                {attachments.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-2 text-xs"
                  >
                    <span className="truncate text-neutral-700">
                      📎 {f.name}
                    </span>
                    <button
                      onClick={() =>
                        setAttachments((p) => p.filter((_, idx) => idx !== i))
                      }
                      className="ml-2 text-neutral-400 hover:text-brand"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="rounded-xl border border-neutral-300 focus-within:border-neutral-400">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Comment"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment();
                  }
                }}
                className="w-full resize-none rounded-t-xl bg-transparent px-4 py-3 text-sm text-[#202020] outline-none placeholder:text-neutral-400"
              />
              <div className="flex items-center justify-between px-3 pb-2.5">
                <div className="flex items-center gap-1 text-neutral-500">
                  <ToolBtn label="Attach" onClick={attachMock}>
                    <PaperclipIcon />
                  </ToolBtn>
                  <ToolBtn label="Voice">
                    <MicIcon />
                  </ToolBtn>
                  <ToolBtn
                    label="Emoji"
                    onClick={() => setInputText((v) => v + " 😊")}
                  >
                    <SmileIcon />
                  </ToolBtn>
                  <ToolBtn label="Extensions">
                    <PuzzleIcon />
                  </ToolBtn>
                </div>
                <button
                  onClick={addComment}
                  disabled={!inputText.trim() && attachments.length === 0}
                  className={cn(
                    "rounded-md px-4 py-1.5 text-sm font-semibold text-white transition",
                    inputText.trim() || attachments.length > 0
                      ? "bg-brand hover:bg-brand-dark"
                      : "cursor-not-allowed bg-brand/50",
                  )}
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {copiedMsg && (
        <div className="fixed bottom-6 left-6 z-[60] flex items-center gap-3 rounded-lg bg-[#202020] px-4 py-3 text-sm text-white shadow-xl animate-pop-in">
          {copiedMsg}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-1.5 text-left text-sm hover:bg-neutral-100",
        danger ? "text-brand" : "text-[#202020]",
      )}
    >
      <span className={danger ? "text-brand" : "text-neutral-500"}>{icon}</span>
      {children}
    </button>
  );
}

function Tab({
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
        "rounded-md px-3 py-1 text-sm font-semibold transition",
        active
          ? "bg-white text-[#202020] shadow-sm"
          : "text-neutral-500 hover:text-neutral-700",
      )}
    >
      {children}
    </button>
  );
}

function Bold({ children }: { children: React.ReactNode }) {
  return <span className="font-bold text-[#202020]">{children}</span>;
}

function ActivityRow({
  badge,
  time,
  faded,
  children,
}: {
  badge: "comment" | "add" | "delete";
  time: string;
  faded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 border-b border-neutral-100 py-4 last:border-b-0">
      <div className="relative shrink-0">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white",
            faded ? "bg-neutral-300" : "bg-[#22c55e]",
          )}
        >
          {faded ? <UserGlyph /> : "B"}
        </span>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white text-white",
            badge === "comment"
              ? "bg-[#3a3f45]"
              : badge === "delete"
                ? "bg-neutral-400"
                : "bg-amber-500",
          )}
        >
          {badge === "comment" ? (
            <BadgeComment />
          ) : badge === "delete" ? (
            <BadgeMinus />
          ) : (
            <BadgePlus />
          )}
        </span>
      </div>
      <div className="min-w-0 flex-1 text-sm leading-relaxed text-neutral-500">
        {children}
        <div className="mt-0.5 text-xs text-neutral-400">{time}</div>
      </div>
    </div>
  );
}

function UserGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="9" r="3.2" />
      <path d="M5.5 19a6.5 6.5 0 0113 0z" />
    </svg>
  );
}
function BadgeComment() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M4 5h16v11H9l-5 4V5z" />
    </svg>
  );
}
function BadgePlus() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BadgeMinus() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BalloonsIllustration() {
  return (
    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" aria-hidden>
      {/* strings */}
      <path
        d="M62 70c4 14 6 26 13 44M75 64c0 18 0 30 0 50M90 70c-3 14-6 26-11 44"
        stroke="#d4d4d4"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* pin / base */}
      <circle cx="75" cy="118" r="4" fill="#3a3f45" />
      <path
        d="M75 118v8"
        stroke="#3a3f45"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* flowers / balloons */}
      <circle cx="52" cy="58" r="17" fill="#f3d27a" />
      <circle cx="98" cy="58" r="17" fill="#f1ede0" />
      <circle cx="62" cy="44" r="13" fill="#e8e3d3" />
      <circle cx="90" cy="46" r="11" fill="#f3d27a" />
      {/* speech-bubble character */}
      <rect x="62" y="40" width="28" height="30" rx="8" fill="#bcd0c9" />
      <path d="M70 70l6 7 6-7z" fill="#bcd0c9" />
      <path
        d="M70 54c2 2 5 2 7 0M83 54c-1.5 1.2-1.5 1.2 0 0"
        stroke="#3a3f45"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* dots */}
      <circle cx="44" cy="74" r="2" fill="#dc4c3e" />
      <circle cx="108" cy="50" r="2" fill="#dc4c3e" />
      <circle cx="100" cy="74" r="1.6" fill="#e0b94a" />
    </svg>
  );
}

function ToolBtn({
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
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-neutral-100 hover:text-neutral-700"
    >
      {children}
    </button>
  );
}

/* icons */
function InboxGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 13l2-7h12l2 7v5H4v-5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 13h5l1 2h4l1-2h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SmilePlus() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 11h.01M13.5 11h.01M8.5 15c1.5 1.2 4.5 1.2 6 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M19 4v4M21 6h-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function Dots() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="5" cy="12" r="1.7" fill="currentColor" />
      <circle cx="12" cy="12" r="1.7" fill="currentColor" />
      <circle cx="19" cy="12" r="1.7" fill="currentColor" />
    </svg>
  );
}
function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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
function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="3"
        width="6"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 11a7 7 0 0014 0M12 18v3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SmileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 10h.01M15 10h.01M8.5 14c1.5 1.5 5.5 1.5 7 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PuzzleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4a2 2 0 014 0h3v3a2 2 0 010 4v3h-3a2 2 0 01-4 0H5v-3a2 2 0 000-4V4h4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PencilMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4L19 9l-4-4L4 16v4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CopyTextMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15V5a2 2 0 012-2h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LinkMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrashMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M6 7l1 13h10l1-13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
