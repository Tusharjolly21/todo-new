"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface TemplateSection {
  name: string;
  tasks: string[];
}

interface Template {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  bg: string;
  description: string[];
  sections: TemplateSection[];
}

const TEMPLATES: Template[] = [
  {
    id: "one-on-one",
    name: "1-on-1 Meeting",
    tagline:
      "Keep your 1-on-1 meetings structured, collaborative, and actionable.",
    emoji: "👥",
    bg: "#e9f0fe",
    description: [
      "1-on-1 meetings are the single best investment you can make in your team's happiness and output. But only if they are structured and consistent.",
      "Use this template to align on agenda items, track ongoing action items, and record key discussion points.",
    ],
    sections: [
      {
        name: "Agenda",
        tasks: [
          "Discuss career development",
          "Review workload & capacity",
          "Feedback exchange",
        ],
      },
      {
        name: "Action items",
        tasks: [
          "Schedule sync with engineering team",
          "Update project timeline documentation",
        ],
      },
      {
        name: "Discussion points",
        tasks: [
          "Feedback on new redesign proposal",
          "Professional development goals",
        ],
      },
    ],
  },
  {
    id: "appointments",
    name: "Appointments",
    tagline:
      "Organize client consultations, medical checks, and key appointments.",
    emoji: "📅",
    bg: "#fef1f2",
    description: [
      "Never lose track of your critical consultation bookings or personal health check-ins.",
      "Use this template to list upcoming dentist checks, product demos, or scheduling deadlines.",
    ],
    sections: [
      {
        name: "Consultations",
        tasks: [
          "Intro call with Client A",
          "Follow-up consultation with Partner B",
        ],
      },
      {
        name: "Personal Health",
        tasks: ["Dentist routine checkup", "Annual physical check"],
      },
      {
        name: "Operations",
        tasks: ["Setup calendly link integration", "Review availability slots"],
      },
    ],
  },
  {
    id: "cook-more",
    name: "Cook More at Home",
    tagline:
      "Make home-cooked meals a habit by turning meal planning into a system.",
    emoji: "🍲",
    bg: "#f3ede0",
    description: [
      "Cooking at home is healthier and cheaper — but only if you can keep it up. The trick is to remove the daily “what's for dinner?” decision.",
      "Use this template to plan your week of meals, build a reusable shopping list, and keep a running list of recipes you want to try.",
    ],
    sections: [
      {
        name: "This week's menu",
        tasks: ["Monday — Stir-fry", "Tuesday — Tacos", "Wednesday — Pasta"],
      },
      {
        name: "Shopping list",
        tasks: ["Vegetables", "Protein", "Pantry staples"],
      },
      { name: "Recipes to try", tasks: ["Thai green curry", "Homemade pizza"] },
    ],
  },
  {
    id: "campaign-tracker",
    name: "Campaign Tracker",
    tagline:
      "Track ad campaigns and keep a pulse on your marketing initiatives.",
    emoji: "📣",
    bg: "#e7eee9",
    description: [
      "It can be easy to lose track of tasks when you're juggling multiple ad campaigns across various channels. Often times, a successful campaign is the product of not only creativity but personal and team organization skills.",
      "This template can help you keep a pulse on the marketing initiatives you're running. Use the Completed section for campaigns that have concluded. Add links or files about those campaigns' results in the comments, so you can learn from them in the future. Maintain unpublished campaigns under Upcoming Campaigns when you're still sweating the details: graphics, copy, channels, budget. When you're ready to kick off an ad campaign, move the task to the Live ▶: section.",
    ],
    sections: [
      {
        name: "Live campaigns ▶",
        tasks: ["Facebook", "Instagram", "Google Search"],
      },
      {
        name: "Upcoming campaigns",
        tasks: ["Spring sale", "Newsletter relaunch"],
      },
      { name: "Completed", tasks: ["Holiday promo"] },
    ],
  },
  {
    id: "educator-planning",
    name: "Educator Planning",
    tagline:
      "Stay productive as an educator whether you're in front of the classroom or planning and grading after-hours.",
    emoji: "🍎",
    bg: "#efe7df",
    description: [
      "Teaching is a juggling act: lesson plans, grading, parent communication, and your own professional development all compete for attention.",
      "Use this template to separate the work into clear sections so nothing slips through the cracks during a busy term.",
    ],
    sections: [
      {
        name: "Lesson planning",
        tasks: ["Draft week's plan", "Prepare materials"],
      },
      { name: "Grading", tasks: ["Quiz 3", "Essays"] },
      { name: "Admin", tasks: ["Parent emails", "Attendance"] },
    ],
  },
  {
    id: "development-workflow",
    name: "Development Workflow",
    tagline:
      "Keep your development team on track (based on the famous Kanban workflow).",
    emoji: "💻",
    bg: "#e4ebe2",
    description: [
      "A simple Kanban-style board for software teams. Work flows left to right from backlog to done, so everyone can see what's in progress at a glance.",
      "Limit work-in-progress to keep the team focused and surface bottlenecks early.",
    ],
    sections: [
      { name: "Backlog", tasks: ["Refactor auth", "Add dark mode"] },
      { name: "In progress", tasks: ["Fix checkout bug"] },
      { name: "Review", tasks: ["PR #42"] },
      { name: "Done", tasks: ["Release v1.2"] },
    ],
  },
  {
    id: "development-sandbox",
    name: "Development Sandbox",
    tagline:
      "Organize all your ideas, requests, and possible improvements in one place.",
    emoji: "🧪",
    bg: "#f2ead9",
    description: [
      "A scratchpad for everything that isn't ready for the main board yet — half-formed ideas, feature requests, and experiments.",
      "Triage regularly and promote the best ideas into your active workflow.",
    ],
    sections: [
      { name: "Ideas", tasks: ["Offline mode", "Keyboard shortcuts"] },
      { name: "Requests", tasks: ["CSV export"] },
      { name: "Experiments", tasks: ["New onboarding"] },
    ],
  },
  {
    id: "personal-goals",
    name: "Goal Tracker",
    tagline:
      "Break big goals into milestones and review your progress every week.",
    emoji: "🎯",
    bg: "#eee6dd",
    description: [
      "Big goals fail when they stay vague. This template turns them into concrete milestones with regular check-ins.",
      "Review weekly, celebrate wins, and adjust what isn't working.",
    ],
    sections: [
      { name: "This quarter", tasks: ["Ship side project", "Run a 10k"] },
      { name: "Milestones", tasks: ["MVP", "Beta launch"] },
      { name: "Weekly review", tasks: ["What went well?", "What's next?"] },
    ],
  },
];

interface TemplatesModalProps {
  open: boolean;
  onClose: () => void;
  onUse: (
    templateName: string,
    sections: { name: string; tasks: string[] }[],
  ) => void;
}

export function TemplatesModal({ open, onClose, onUse }: TemplatesModalProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Template | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(null);
      setApplying(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (selected) setSelected(null);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, selected]);

  if (!open) return null;

  const filtered = TEMPLATES.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tagline.toLowerCase().includes(query.toLowerCase()),
  );

  function useTemplate(t: Template) {
    if (applying) return;
    setApplying(true);
    setTimeout(() => {
      onUse(t.name, t.sections);
      onClose();
    }, 1100);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[8vh]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[84vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h2 className="text-xl font-bold text-[#202020]">Templates</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <CloseIcon />
          </button>
        </div>

        {selected ? (
          /* ---------- DETAIL ---------- */
          <>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <button
                onClick={() => setSelected(null)}
                className="mb-5 flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-[#202020]"
              >
                <BackIcon /> All templates
              </button>

              <div className="flex items-start gap-4">
                <Thumb emoji={selected.emoji} bg={selected.bg} />
                <div className="min-w-0 pt-1">
                  <h3 className="text-xl font-bold text-[#202020]">
                    {selected.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                    {selected.tagline}
                  </p>
                </div>
              </div>

              <div className="my-5 h-px bg-neutral-100" />

              <div className="space-y-4">
                {selected.description.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-relaxed text-[#404040]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              <div className="my-6 h-px bg-neutral-100" />

              {/* preview */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg text-[#202020]">{selected.name}</h4>
                <CommentGlyph />
              </div>
              <div className="mt-3 space-y-4">
                {selected.sections.map((sec) => (
                  <div key={sec.name}>
                    <p className="flex items-center gap-1.5 font-semibold text-[#202020]">
                      <Chevron /> {sec.name}:
                    </p>
                    <ul className="mt-1.5 space-y-1.5 pl-6">
                      {sec.tasks.map((task) => (
                        <li
                          key={task}
                          className="flex items-center gap-2.5 text-sm text-[#404040]"
                        >
                          <span className="h-4 w-4 shrink-0 rounded-full border border-neutral-300" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className="flex justify-end border-t border-neutral-100 px-6 py-4">
              <button
                onClick={() => useTemplate(selected)}
                disabled={applying}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition",
                  applying
                    ? "cursor-wait bg-brand/70"
                    : "bg-brand hover:bg-brand-dark",
                )}
              >
                {applying && <SpinnerIcon />}
                Use template
              </button>
            </div>
          </>
        ) : (
          /* ---------- LIST ---------- */
          <div className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
            <p className="font-bold text-[#202020]">
              Select a template to add to your project
            </p>
            <div className="mt-3 flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search all templates"
                className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm text-[#202020] outline-none placeholder:text-neutral-400 focus:border-neutral-400"
              />
              <button className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200">
                Search
              </button>
            </div>

            <div className="mt-3 flex-1 divide-y divide-neutral-100 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-400">
                  No templates match “{query}”.
                </p>
              ) : (
                filtered.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className="flex w-full items-center gap-4 py-4 text-left transition hover:bg-neutral-50"
                  >
                    <Thumb emoji={t.emoji} bg={t.bg} />
                    <div className="min-w-0">
                      <p className="font-bold text-[#202020]">{t.name}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-500">
                        {t.tagline}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Thumb({ emoji, bg }: { emoji: string; bg: string }) {
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl"
      style={{ backgroundColor: bg }}
    >
      {emoji}
    </span>
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
function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-400"
    >
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
function CommentGlyph() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-400"
    >
      <path
        d="M4 5h16v11H9l-5 4V5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.3"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
