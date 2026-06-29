"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ResourcesModalProps {
  open: boolean;
  onClose: () => void;
}

type TabCategory =
  | "get-started"
  | "support"
  | "quiz"
  | "guides"
  | "downloads"
  | "developer"
  | "about"
  | "careers"
  | "status"
  | "legal"
  | "partners";

interface JobOpening {
  id: string;
  title: string;
  dept: string;
  location: string;
  description: string;
}

const JOBS: JobOpening[] = [
  {
    id: "fe-eng",
    title: "Senior Frontend Engineer (React)",
    dept: "Product Engineering",
    location: "Remote (Global)",
    description:
      "Join us in crafting the next generation of task management. You will work on optimizing responsiveness, keyboard navigation, and custom layout engines.",
  },
  {
    id: "prod-des",
    title: "Product Designer",
    dept: "Design Team",
    location: "Remote (EU/US)",
    description:
      "We are looking for a designer with obsession for clean layout grids, micro-interactions, and visual harmony to lead our UI redesign efforts.",
  },
  {
    id: "be-eng",
    title: "Distributed Systems Backend Engineer",
    dept: "Infrastructure",
    location: "Remote (Global)",
    description:
      "Help scale our sync service, which processes billions of operations per day. Experience with Rust, Go, or high-throughput systems is a plus.",
  },
];

export function ResourcesModal({ open, onClose }: ResourcesModalProps) {
  const [activeTab, setActiveTab] = useState<TabCategory>("get-started");
  const [activeGuide, setActiveGuide] = useState<string>("gtd");
  const [activeDevTab, setActiveDevTab] = useState<
    "rest" | "sync" | "webhooks"
  >("rest");
  const [devCodeLang, setDevCodeLang] = useState<"curl" | "js" | "py">("curl");

  // Form states
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDesc, setSupportDesc] = useState("");
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerWebsite, setPartnerWebsite] = useState("");
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const [applyJobId, setApplyJobId] = useState<string | null>(null);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyResume, setApplyResume] = useState("");
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Quiz states
  const [quizStep, setQuizStep] = useState<"intro" | 1 | 2 | 3 | "result">(
    "intro",
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<string>("");

  // Download simulation
  const [downloadStatus, setDownloadStatus] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset forms on modal open/close
  useEffect(() => {
    if (open) {
      setSupportSubmitted(false);
      setSupportEmail("");
      setSupportSubject("");
      setSupportDesc("");
      setPartnerSubmitted(false);
      setPartnerName("");
      setPartnerEmail("");
      setPartnerWebsite("");
      setApplyJobId(null);
      setApplySubmitted(false);
      setQuizStep("intro");
      setQuizAnswers({});
    }
  }, [open]);

  if (!open) return null;

  const triggerDownload = (platform: string) => {
    setDownloadStatus((prev) => ({ ...prev, [platform]: "Downloading..." }));
    setTimeout(() => {
      setDownloadStatus((prev) => ({ ...prev, [platform]: "Completed! ✓" }));
      // Simulate file download trigger
      const link = document.createElement("a");
      link.href = "#";
      link.setAttribute("download", `Todoist-${platform}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1500);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSubmitted(true);
  };

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitted(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySubmitted(true);
  };

  const handleQuizAnswer = (questionIndex: number, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: value }));
    const nextStep =
      questionIndex === 3 ? "result" : ((questionIndex + 1) as 1 | 2 | 3);
    if (nextStep === "result") {
      // Calculate quiz outcome
      const answersList = Object.values({
        ...quizAnswers,
        [questionIndex]: value,
      });
      const counts = answersList.reduce(
        (acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      let bestOutcome = "pomodoro";
      let maxCount = 0;
      Object.entries(counts).forEach(([method, count]) => {
        if (count > maxCount) {
          maxCount = count;
          bestOutcome = method;
        }
      });
      setQuizResult(bestOutcome);
    }
    setQuizStep(nextStep as any);
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-6 backdrop-blur-xs select-none"
      onClick={onClose}
    >
      <div
        className="flex h-[88vh] w-full max-w-5xl animate-pop-in overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Navigation Sidebar */}
        <aside className="w-64 border-r border-neutral-100 bg-neutral-50/50 p-4 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <h2 className="px-3 text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                Guides & Help
              </h2>
              <nav className="mt-2 space-y-1">
                <NavButton
                  active={activeTab === "get-started"}
                  onClick={() => setActiveTab("get-started")}
                >
                  🧭 Get Started
                </NavButton>
                <NavButton
                  active={activeTab === "support"}
                  onClick={() => setActiveTab("support")}
                >
                  💬 Contact Support
                </NavButton>
                <NavButton
                  active={activeTab === "quiz"}
                  onClick={() => setActiveTab("quiz")}
                >
                  🧠 Method Quiz
                </NavButton>
                <NavButton
                  active={activeTab === "guides"}
                  onClick={() => setActiveTab("guides")}
                >
                  📄 Methodology Articles
                </NavButton>
              </nav>
            </div>

            <div>
              <h2 className="px-3 text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                Developer & Apps
              </h2>
              <nav className="mt-2 space-y-1">
                <NavButton
                  active={activeTab === "downloads"}
                  onClick={() => setActiveTab("downloads")}
                >
                  📥 App Downloads
                </NavButton>
                <NavButton
                  active={activeTab === "developer"}
                  onClick={() => setActiveTab("developer")}
                >
                  💻 Developer API Portal
                </NavButton>
              </nav>
            </div>

            <div>
              <h2 className="px-3 text-xs font-extrabold tracking-wider text-neutral-400 uppercase">
                About Doist
              </h2>
              <nav className="mt-2 space-y-1">
                <NavButton
                  active={activeTab === "about"}
                  onClick={() => setActiveTab("about")}
                >
                  🏢 About Us & Values
                </NavButton>
                <NavButton
                  active={activeTab === "careers"}
                  onClick={() => setActiveTab("careers")}
                >
                  💼 Careers / Job Openings
                </NavButton>
                <NavButton
                  active={activeTab === "status"}
                  onClick={() => setActiveTab("status")}
                >
                  🟢 System Status
                </NavButton>
                <NavButton
                  active={activeTab === "partners"}
                  onClick={() => setActiveTab("partners")}
                >
                  🤝 Channel Partners
                </NavButton>
              </nav>
            </div>
          </div>

          <div>
            <nav className="space-y-1 border-t border-neutral-100 pt-3">
              <NavButton
                active={activeTab === "legal"}
                onClick={() => setActiveTab("legal")}
              >
                🔒 Security & Privacy
              </NavButton>
              <span className="block px-3 text-[10px] text-neutral-400 text-center font-medium mt-2">
                Todoist v5182
              </span>
            </nav>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
          {/* Header toolbar */}
          <div className="flex items-center justify-end px-6 py-4 border-b border-neutral-50 shrink-0">
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              aria-label="Close modal"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Tab Pages rendering */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeTab === "get-started" && (
              <div className="space-y-8 max-w-2xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Get Started with Todoist
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Follow these 4 simple steps to organize your work and life.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-neutral-200/60 bg-neutral-50/20 hover:border-neutral-300 transition">
                    <span className="text-2xl">✍️</span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-2">
                      1. Add your first task
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Just press{" "}
                      <kbd className="px-1.5 py-0.5 rounded border border-neutral-300 bg-white font-mono text-[9px] shadow-2xs">
                        Q
                      </kbd>{" "}
                      anywhere inside the dashboard to trigger Quick Add and
                      write out your goal.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-neutral-200/60 bg-neutral-50/20 hover:border-neutral-300 transition">
                    <span className="text-2xl">📅</span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-2">
                      2. Set a due date
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Type dynamic schedule patterns directly like "today at
                      5pm", "every Monday", or "next week" to schedule smart
                      task recurrences.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-neutral-200/60 bg-neutral-50/20 hover:border-neutral-300 transition">
                    <span className="text-2xl">🗂️</span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-2">
                      3. Organize with projects
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Divide your personal life, side gigs, work schedules, and
                      teams into distinct color-coded folders and workspace
                      projects.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-neutral-200/60 bg-neutral-50/20 hover:border-neutral-300 transition">
                    <span className="text-2xl">👥</span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-2">
                      4. Invite your team
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      Add co-workers, friends, or family members to workspace
                      channels. Delegate tasks and start sharing project
                      progress.
                    </p>
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <h2 className="text-base font-bold text-neutral-900">
                    Guides for getting the most out of Todoist
                  </h2>
                  <div className="mt-4 space-y-4">
                    <div
                      className="flex gap-4 p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition cursor-pointer"
                      onClick={() => setActiveTab("guides")}
                    >
                      <span className="text-xl shrink-0">📖</span>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">
                          Complete Onboarding Manual
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Read our structured 15-minute quickstart guide on
                          custom views, project boards, and priority labels.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "support" && (
              <div className="max-w-xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Submit a support request
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Need help? Send us a ticket and our support champions will
                    reply shortly.
                  </p>
                </div>

                {supportSubmitted ? (
                  <div className="mt-8 text-center p-8 bg-green-50 rounded-2xl border border-green-100 space-y-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-xl font-bold">
                      ✓
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Request submitted successfully!
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                      Your ticket has been logged under ID{" "}
                      <code className="font-mono bg-white px-1 py-0.5 rounded border">
                        #DOIST-40294
                      </code>
                      . We will get back to you at{" "}
                      <strong>{supportEmail}</strong> within 24 hours.
                    </p>
                    <button
                      onClick={() => setSupportSubmitted(false)}
                      className="mt-2 text-xs font-bold text-brand hover:underline"
                    >
                      Submit another query
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSupportSubmit}
                    className="mt-8 space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">
                        Your email address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">
                        Subject
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sync issues on macOS app"
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">
                        How can we help?
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Describe your issue or feedback in detail..."
                        value={supportDesc}
                        onChange={(e) => setSupportDesc(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition shadow-xs"
                    >
                      Submit Request
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === "quiz" && (
              <div className="max-w-xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Productivity Method Quiz
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Answer 3 quick questions to discover your ideal productivity
                    workflow.
                  </p>
                </div>

                <div className="mt-8 border border-neutral-200/80 rounded-2xl p-6 bg-neutral-50/10">
                  {quizStep === "intro" && (
                    <div className="text-center py-6 space-y-4">
                      <span className="text-4xl">🚀</span>
                      <h3 className="text-base font-bold text-neutral-900">
                        Which method fits your brain?
                      </h3>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                        Are you a checklist purist, a Pomodoro timer enthusiast,
                        or a structured GTD planner? Let's find out!
                      </p>
                      <button
                        onClick={() => setQuizStep(1)}
                        className="rounded-lg bg-brand px-6 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition"
                      >
                        Start Quiz
                      </button>
                    </div>
                  )}

                  {quizStep === 1 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-brand uppercase">
                        Question 1 of 3
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900">
                        How do you structure your typical workday?
                      </h3>
                      <div className="space-y-2 mt-3">
                        <button
                          onClick={() => handleQuizAnswer(1, "timebox")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          🗓️ I block specific hours on my calendar for specific
                          tasks
                        </button>
                        <button
                          onClick={() => handleQuizAnswer(1, "pomodoro")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          ⏱️ I work in short focused bursts followed by brief
                          breaks
                        </button>
                        <button
                          onClick={() => handleQuizAnswer(1, "gtd")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          📥 I collect everything in an Inbox and sort it
                          systematically later
                        </button>
                      </div>
                    </div>
                  )}

                  {quizStep === 2 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-brand uppercase">
                        Question 2 of 3
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900">
                        What is your biggest daily blocker?
                      </h3>
                      <div className="space-y-2 mt-3">
                        <button
                          onClick={() => handleQuizAnswer(2, "pomodoro")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          🥱 I lose focus or get distracted after working for
                          too long
                        </button>
                        <button
                          onClick={() => handleQuizAnswer(2, "timebox")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          🤯 Reacting to urgent requests instead of my
                          high-priority goals
                        </button>
                        <button
                          onClick={() => handleQuizAnswer(2, "gtd")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          🧠 Keeping track of too many tiny ideas or tasks in my
                          head
                        </button>
                      </div>
                    </div>
                  )}

                  {quizStep === 3 && (
                    <div className="space-y-4">
                      <span className="text-xs font-bold text-brand uppercase">
                        Question 3 of 3
                      </span>
                      <h3 className="text-sm font-bold text-neutral-900">
                        Which task list style makes you feel most organized?
                      </h3>
                      <div className="space-y-2 mt-3">
                        <button
                          onClick={() => handleQuizAnswer(3, "gtd")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          🗂️ Project folders, priority tags, and weekly review
                          sweeps
                        </button>
                        <button
                          onClick={() => handleQuizAnswer(3, "timebox")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          📆 An hour-by-hour agenda planner showing my day at a
                          glance
                        </button>
                        <button
                          onClick={() => handleQuizAnswer(3, "pomodoro")}
                          className="w-full text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                        >
                          🔥 Picking 3 critical tasks and grinding them out in
                          sprints
                        </button>
                      </div>
                    </div>
                  )}

                  {quizStep === "result" && (
                    <div className="text-center py-6 space-y-4 animate-fade-up">
                      <span className="text-4xl">🌟</span>
                      <h3 className="text-base font-bold text-neutral-900">
                        Your Recommended Workflow
                      </h3>
                      <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 max-w-sm mx-auto">
                        <h4 className="text-sm font-bold text-brand capitalize">
                          {quizResult === "gtd" && "Getting Things Done (GTD)"}
                          {quizResult === "pomodoro" && "Pomodoro Sprints"}
                          {quizResult === "timebox" && "Time Blocking / Box"}
                        </h4>
                        <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                          {quizResult === "gtd" &&
                            "You thrive on capturing items into an Inbox and performing a weekly review. Use tags and custom filters to prioritize tasks."}
                          {quizResult === "pomodoro" &&
                            "Focus is your primary constraint. Divide your day into 25-minute study intervals followed by 5-minute coffee breaks to stay fresh."}
                          {quizResult === "timebox" &&
                            "You work best when scheduling specific windows for your goals on a calendar. Try planning your upcoming days ahead."}
                        </p>
                      </div>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setQuizStep("intro")}
                          className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                        >
                          Retake Quiz
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab("guides");
                            setActiveGuide(quizResult);
                          }}
                          className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition"
                        >
                          Read Guide Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "guides" && (
              <div className="flex gap-6 animate-fade-up h-full overflow-hidden">
                {/* Guide navigation */}
                <div className="w-56 shrink-0 space-y-1">
                  <h3 className="px-2.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Methodologies
                  </h3>
                  <button
                    onClick={() => setActiveGuide("gtd")}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition",
                      activeGuide === "gtd"
                        ? "bg-brand/5 text-brand"
                        : "text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    📥 Getting Things Done (GTD)
                  </button>
                  <button
                    onClick={() => setActiveGuide("handbook")}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition",
                      activeGuide === "handbook"
                        ? "bg-brand/5 text-brand"
                        : "text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    📖 Company Handbook Guide
                  </button>
                  <button
                    onClick={() => setActiveGuide("recurrence")}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition",
                      activeGuide === "recurrence"
                        ? "bg-brand/5 text-brand"
                        : "text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    🔁 Set Recurring Dates
                  </button>
                  <button
                    onClick={() => setActiveGuide("remote")}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition",
                      activeGuide === "remote"
                        ? "bg-brand/5 text-brand"
                        : "text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    💼 Remote Worker Managing Up
                  </button>
                  <button
                    onClick={() => setActiveGuide("zeigarnik")}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition",
                      activeGuide === "zeigarnik"
                        ? "bg-brand/5 text-brand"
                        : "text-neutral-600 hover:bg-neutral-50",
                    )}
                  >
                    🌀 The Zeigarnik Effect
                  </button>
                </div>

                {/* Guide details */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-w-xl pb-6">
                  {activeGuide === "gtd" && (
                    <>
                      <h1 className="text-xl font-bold text-neutral-900">
                        Getting Things Done (GTD): Simple Guide
                      </h1>
                      <p className="text-xs text-neutral-500">
                        Getting Things Done (GTD) is a productivity framework
                        created by David Allen to help you clear mental clutter
                        and organize priorities.
                      </p>
                      <div className="space-y-3 mt-4 text-xs text-neutral-700 leading-relaxed">
                        <p>
                          <strong>1. Capture:</strong> Collect every query,
                          project, idea, or chore into your Inbox immediately.
                          Don't try to store it in your head.
                        </p>
                        <p>
                          <strong>2. Clarify:</strong> Decipher if an item is
                          actionable. If it takes less than 2 minutes, do it
                          right away. Otherwise, delegate it or file it.
                        </p>
                        <p>
                          <strong>3. Organize:</strong> Put tasks in their
                          correct folders, add tags, and assign exact calendar
                          deadlines.
                        </p>
                        <p>
                          <strong>4. Reflect:</strong> Perform a weekly review
                          to clean up lists, tick completed items, and keep the
                          system relevant.
                        </p>
                      </div>
                    </>
                  )}

                  {activeGuide === "handbook" && (
                    <>
                      <h1 className="text-xl font-bold text-neutral-900">
                        Building a Company Handbook
                      </h1>
                      <p className="text-xs text-neutral-500">
                        Create a central repository of documentation,
                        guidelines, and operations for scaling team
                        collaboration.
                      </p>
                      <div className="space-y-3 mt-4 text-xs text-neutral-700 leading-relaxed">
                        <p>
                          A good handbook functions as the single source of
                          truth for your company. Start by separating files by
                          departments: Engineering, Design, People Operations,
                          and Product.
                        </p>
                        <p>
                          Ensure the handbook is <strong>searchable</strong>,
                          accessible to all new hires, and updated continuously
                          through pull requests or wiki edits.
                        </p>
                      </div>
                    </>
                  )}

                  {activeGuide === "recurrence" && (
                    <>
                      <h1 className="text-xl font-bold text-neutral-900">
                        Set Recurring Due Dates
                      </h1>
                      <p className="text-xs text-neutral-500">
                        Automate periodic chores by setting recurrences inside
                        your Todoist.
                      </p>
                      <div className="space-y-3 mt-4 text-xs text-neutral-700 leading-relaxed">
                        <p>
                          Simply type date rules directly into the task title
                          input field:
                        </p>
                        <ul className="list-disc pl-4 space-y-1">
                          <li>
                            <code>every day</code> to repeat a task daily.
                          </li>
                          <li>
                            <code>every monday at 9am</code> for weekly
                            operations.
                          </li>
                          <li>
                            <code>every 1st of month</code> for invoices and
                            billing.
                          </li>
                          <li>
                            <code>every 3 months starting feb</code> for
                            quarterly reviews.
                          </li>
                        </ul>
                      </div>
                    </>
                  )}

                  {activeGuide === "remote" && (
                    <>
                      <h1 className="text-xl font-bold text-neutral-900">
                        The Remote Worker's Guide to Managing Up
                      </h1>
                      <p className="text-xs text-neutral-500">
                        Communication guidelines for asynchronous teams.
                      </p>
                      <div className="space-y-3 mt-4 text-xs text-neutral-700 leading-relaxed">
                        <p>
                          Managing up is about building trust by keeping your
                          manager aligned on your goals, updates, blockers, and
                          timelines proactively.
                        </p>
                        <p>
                          Document daily work logs, avoid gatekeeping info, and
                          clarify priority ranks in shared workspace documents.
                        </p>
                      </div>
                    </>
                  )}

                  {activeGuide === "zeigarnik" && (
                    <>
                      <h1 className="text-xl font-bold text-neutral-900">
                        The Zeigarnik Effect
                      </h1>
                      <p className="text-xs text-neutral-500">
                        Why unfinished work follows us home (and how to stop
                        it).
                      </p>
                      <div className="space-y-3 mt-4 text-xs text-neutral-700 leading-relaxed">
                        <p>
                          Psychologist Bluma Zeigarnik discovered that our
                          brains remember incomplete tasks much better than
                          completed ones. This creates mental tension and
                          cognitive fatigue.
                        </p>
                        <p>
                          By writing your remaining tasks down in a reliable
                          system at the end of the day, you signal your brain
                          that a plan exists. This immediately relieves the
                          mental loops, letting you relax.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === "downloads" && (
              <div className="space-y-8 max-w-2xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Download Todoist Apps
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Get native desktop and mobile clients to sync your workspace
                    on the go.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <DownloadCard
                    platform="macOS"
                    icon="💻"
                    status={downloadStatus["macOS"]}
                    onClick={() => triggerDownload("macOS")}
                  />
                  <DownloadCard
                    platform="Windows"
                    icon="🪟"
                    status={downloadStatus["Windows"]}
                    onClick={() => triggerDownload("Windows")}
                  />
                  <DownloadCard
                    platform="Linux"
                    icon="🐧"
                    status={downloadStatus["Linux"]}
                    onClick={() => triggerDownload("Linux")}
                  />
                  <DownloadCard
                    platform="iOS"
                    icon="📱"
                    status={downloadStatus["iOS"]}
                    onClick={() => triggerDownload("iOS")}
                  />
                  <DownloadCard
                    platform="Android"
                    icon="🤖"
                    status={downloadStatus["Android"]}
                    onClick={() => triggerDownload("Android")}
                  />
                </div>
              </div>
            )}

            {activeTab === "developer" && (
              <div className="space-y-6 max-w-3xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Developer API Platform
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Build extensions, sync data, and automate your task
                    workflows.
                  </p>
                </div>

                <div className="flex gap-3 border-b border-neutral-100 pb-3">
                  <button
                    onClick={() => setActiveDevTab("rest")}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-lg transition",
                      activeDevTab === "rest"
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900",
                    )}
                  >
                    REST API
                  </button>
                  <button
                    onClick={() => setActiveDevTab("sync")}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-lg transition",
                      activeDevTab === "sync"
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900",
                    )}
                  >
                    Sync API
                  </button>
                  <button
                    onClick={() => setActiveDevTab("webhooks")}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-lg transition",
                      activeDevTab === "webhooks"
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-500 hover:text-neutral-900",
                    )}
                  >
                    Webhooks
                  </button>
                </div>

                {activeDevTab === "rest" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900">
                      REST API Reference
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Use standard HTTP requests to create, read, update, and
                      delete tasks, projects, comments, and labels.
                    </p>

                    <div className="rounded-xl overflow-hidden border border-neutral-200/80 bg-neutral-950 font-mono text-xs">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900">
                        <span className="text-[10px] text-neutral-400 font-bold">
                          GET /tasks
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDevCodeLang("curl")}
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded",
                              devCodeLang === "curl"
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-500",
                            )}
                          >
                            cURL
                          </button>
                          <button
                            onClick={() => setDevCodeLang("js")}
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded",
                              devCodeLang === "js"
                                ? "bg-neutral-800 text-white"
                                : "text-neutral-500",
                            )}
                          >
                            JS
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
                        {devCodeLang === "curl"
                          ? `curl https://api.todoist.com/rest/v2/tasks \\\n  -H "Authorization: Bearer $ACCESS_TOKEN"`
                          : `const response = await fetch("https://api.todoist.com/rest/v2/tasks", {\n  headers: { Authorization: "Bearer " + token }\n});\nconst tasks = await response.json();`}
                      </pre>
                    </div>
                  </div>
                )}

                {activeDevTab === "sync" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-neutral-900">
                      Sync API Overview
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      The Sync API is designed for clients that need to maintain
                      a local database sync. It supports batch writes and
                      incremental changes to reduce payloads.
                    </p>
                  </div>
                )}

                {activeDevTab === "webhooks" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-neutral-900">
                      Webhooks & Subscriptions
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Configure endpoints to receive instant POST notifications
                      when tasks are added, completed, deleted, or comments are
                      posted.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-6 max-w-2xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    About Us & Values
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    We are Doist, a fully remote team spanning 35+ countries,
                    building tools that make work simpler and more meaningful.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/20">
                    <h3 className="text-xs font-bold text-neutral-900">
                      Independence
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                      We are bootstrapped and fully profitable. We answer only
                      to our users, not to venture capitalists.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/20">
                    <h3 className="text-xs font-bold text-neutral-900">
                      Trust & Openness
                    </h3>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                      We operate with transparency, flexibility, and a focus on
                      asynchronous communication.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "careers" && (
              <div className="space-y-6 max-w-2xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Careers / Job Openings
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Join our fully remote team to shape the future of daily
                    productivity.
                  </p>
                </div>

                {applySubmitted ? (
                  <div className="p-6 bg-green-50 rounded-xl border border-green-100 text-center space-y-2">
                    <span className="text-2xl">🎉</span>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Application Received!
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Thank you, <strong>{applyName}</strong>. We will review
                      your profile for the position and contact you at{" "}
                      <strong>{applyEmail}</strong> soon.
                    </p>
                    <button
                      onClick={() => setApplySubmitted(false)}
                      className="mt-2 text-xs font-bold text-brand hover:underline"
                    >
                      Browse other job openings
                    </button>
                  </div>
                ) : applyJobId ? (
                  <div className="border border-neutral-200 rounded-xl p-5 space-y-4">
                    <button
                      onClick={() => setApplyJobId(null)}
                      className="text-xs font-bold text-neutral-400 hover:text-neutral-700 flex items-center gap-1"
                    >
                      ← Back to job openings
                    </button>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">
                        {JOBS.find((j) => j.id === applyJobId)?.title}
                      </h3>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        {JOBS.find((j) => j.id === applyJobId)?.dept} •{" "}
                        {JOBS.find((j) => j.id === applyJobId)?.location}
                      </span>
                    </div>

                    <form onSubmit={handleApplySubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="your name"
                          value={applyName}
                          onChange={(e) => setApplyName(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-brand"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="email"
                          value={applyEmail}
                          onChange={(e) => setApplyEmail(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-brand"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600 block">
                          Resume / Cover Letter Details
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Paste details or link to resume..."
                          value={applyResume}
                          onChange={(e) => setApplyResume(e.target.value)}
                          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-brand resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-[#202020] py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition"
                      >
                        Submit Application
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {JOBS.map((job) => (
                      <div
                        key={job.id}
                        className="p-5 border border-neutral-100 rounded-xl hover:border-neutral-200 hover:shadow-xs transition flex justify-between items-start gap-4"
                      >
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-neutral-900">
                            {job.title}
                          </h3>
                          <span className="text-[10px] text-neutral-400 block">
                            {job.dept} • {job.location}
                          </span>
                          <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                            {job.description}
                          </p>
                        </div>
                        <button
                          onClick={() => setApplyJobId(job.id)}
                          className="rounded-lg bg-brand/10 text-brand px-3 py-1.5 text-xs font-bold hover:bg-brand hover:text-white transition shrink-0"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "status" && (
              <div className="space-y-6 max-w-2xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    System Status
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Real-time operational status check for Todoist servers.
                  </p>
                </div>

                <div className="rounded-xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
                  <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-green-500 text-white font-extrabold text-[9px] animate-pulse">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-green-800">
                    All systems fully operational.
                  </span>
                </div>

                <div className="border border-neutral-100 rounded-xl divide-y divide-neutral-100">
                  <StatusRow name="API Gateway" status="Operational" />
                  <StatusRow name="Sync Engine" status="Operational" />
                  <StatusRow name="Web Application" status="Operational" />
                  <StatusRow name="Database Cluster" status="Operational" />
                  <StatusRow
                    name="Notifications Service"
                    status="Operational"
                  />
                </div>
              </div>
            )}

            {activeTab === "partners" && (
              <div className="max-w-xl animate-fade-up">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Channel Partners
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Partner with Todoist to promote productivity and unlock
                    commission incentives.
                  </p>
                </div>

                {partnerSubmitted ? (
                  <div className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100 text-center space-y-2">
                    <span className="text-2xl">🤝</span>
                    <h3 className="text-sm font-bold text-neutral-900">
                      Application Submitted!
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Thank you for applying. Our partnership team will review{" "}
                      <strong>{partnerName}</strong> and reply at{" "}
                      <strong>{partnerEmail}</strong> soon.
                    </p>
                    <button
                      onClick={() => setPartnerSubmitted(false)}
                      className="mt-2 text-xs font-bold text-brand hover:underline"
                    >
                      Submit another application
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handlePartnerSubmit}
                    className="mt-8 space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Organization Ltd."
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="partner@yourorg.com"
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-brand"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-600 block">
                        Website URL
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://yourorg.com"
                        value={partnerWebsite}
                        onChange={(e) => setPartnerWebsite(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-brand"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-[#202020] py-2.5 text-xs font-semibold text-white hover:bg-neutral-800 transition"
                    >
                      Submit Partner Application
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === "legal" && (
              <div className="space-y-8 max-w-2xl animate-fade-up text-xs text-neutral-700 leading-relaxed">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
                    Security & Privacy Policies
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500">
                    Learn about how we encrypt your data and protect user
                    privacy.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-neutral-900 border-b pb-2">
                    Security Compliance
                  </h2>
                  <p>
                    All database connections use TLS 1.3 encryption. User tasks
                    are encrypted at rest using AES-256 standard protocols.
                  </p>
                  <p>
                    Our server infrastructure is SOC 2 Type II compliant and is
                    audited annually to ensure the highest standards of data
                    integrity.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-neutral-900 border-b pb-2">
                    Privacy Policy
                  </h2>
                  <p>
                    We do not sell, rent, or lease personal task information or
                    meta data to third-party advertisers.
                  </p>
                  <p>
                    Doist complies with the General Data Protection Regulation
                    (GDPR) and gives you complete rights to download or delete
                    your account records instantly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

/* Local Helpers */
function NavButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all duration-150",
        active
          ? "bg-[#202020] text-white shadow-xs"
          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      )}
    >
      {children}
    </button>
  );
}

function DownloadCard({
  platform,
  icon,
  status,
  onClick,
}: {
  platform: string;
  icon: string;
  status?: string;
  onClick: () => void;
}) {
  return (
    <div className="p-5 border border-neutral-100 rounded-xl text-center space-y-3 hover:border-neutral-200 transition">
      <span className="text-3xl block">{icon}</span>
      <h3 className="text-xs font-bold text-neutral-900">{platform} App</h3>
      <button
        onClick={onClick}
        disabled={status === "Downloading..."}
        className={cn(
          "w-full rounded-lg py-1.5 text-[11px] font-bold transition",
          status
            ? "bg-green-50 text-green-700 border border-green-100"
            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
        )}
      >
        {status || "Download"}
      </button>
    </div>
  );
}

function StatusRow({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex items-center justify-between p-3 px-4">
      <span className="text-xs font-medium text-neutral-700">{name}</span>
      <span className="text-[10px] font-extrabold text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded-full">
        {status}
      </span>
    </div>
  );
}
