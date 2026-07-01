"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Wordmark } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { LandingIcon, type IconName } from "./LandingIcons";
import {
  Tray as PhTray,
  CalendarBlank as PhCalendarBlank,
  Kanban as PhKanban,
  ChartLineUp as PhChartLineUp,
  UsersThree as PhUsersThree,
  Crown as PhCrown,
  Star as PhStar,
  Plus as PhPlus,
  ListChecks as PhListChecks,
  FolderSimple as PhFolderSimple,
  ShareNetwork as PhShareNetwork,
  Flag as PhFlag,
  Alarm as PhAlarm,
  PuzzlePiece as PhPuzzlePiece,
  Funnel as PhFunnel,
  CheckCircle as PhCheckCircle,
  DownloadSimple as PhDownloadSimple,
  SquaresFour as PhSquaresFour,
  SlidersHorizontal as PhSliders,
  Brain as PhBrain,
} from "@phosphor-icons/react";

type ActiveView =
  | "home"
  | "teams"
  | "pricing"
  | "templates"
  | "downloads"
  | "developer"
  | "support"
  | "quiz"
  | "about"
  | "careers"
  | "status"
  | "partners"
  | "press"
  | "security"
  | "privacy";

interface TemplateDef {
  name: string;
  icon: IconName;
  tagline: string;
  bg: string;
}

const TEMPLATES: TemplateDef[] = [
  {
    name: "1-on-1 Meeting",
    icon: "users",
    tagline: "Keep meetings structured, collaborative, and actionable.",
    bg: "#e9f0fe",
  },
  {
    name: "Appointments",
    icon: "calendar",
    tagline: "Organize client consultations, medical checks, and key sessions.",
    bg: "#fef1f2",
  },
  {
    name: "Cook More at Home",
    icon: "utensils",
    tagline: "Make home-cooked meals a habit by planning meals.",
    bg: "#f3ede0",
  },
  {
    name: "Campaign Tracker",
    icon: "megaphone",
    tagline: "Track ad campaigns and keep a pulse on marketing initiatives.",
    bg: "#e7eee9",
  },
  {
    name: "Goal Tracker",
    icon: "target",
    tagline: "Break big goals into milestones and review weekly progress.",
    bg: "#eee6dd",
  },
];

export function LandingPage() {
  const [activeView, setActiveView] = useState<ActiveView>("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mockupTab, setMockupTab] = useState<
    "inbox" | "calendar" | "board" | "productivity" | "teams"
  >("inbox");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );

  // Support ticket state
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportDesc, setSupportDesc] = useState("");
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  // Quiz state
  const [quizStep, setQuizStep] = useState<"intro" | 1 | 2 | 3 | "result">(
    "intro",
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState("");

  // Partners state
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // Job application state
  const [applyJob, setApplyJob] = useState<string | null>(null);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applySubmitted, setApplySubmitted] = useState(false);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDropdownOpen(false);
    setSupportSubmitted(false);
    setPartnerSubmitted(false);
    setApplySubmitted(false);
    setQuizStep("intro");
  }, [activeView]);

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

  const handleQuizAnswer = (qNum: number, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qNum]: value }));
    if (qNum === 3) {
      const answersList = Object.values({ ...quizAnswers, [qNum]: value });
      const counts = answersList.reduce(
        (acc, curr) => {
          acc[curr] = (acc[curr] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      let best = "pomodoro";
      let max = 0;
      Object.entries(counts).forEach(([method, count]) => {
        if (count > max) {
          max = count;
          best = method;
        }
      });
      setQuizResult(best);
      setQuizStep("result");
    } else {
      setQuizStep((qNum + 1) as any);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white font-sans text-neutral-800 antialiased selection:bg-brand-tint selection:text-brand">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-md px-6 py-4 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveView("home")}
            className="hover:opacity-95 transition"
          >
            <Wordmark />
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            <button
              onClick={() => setActiveView("home")}
              className={cn(
                "text-sm font-semibold transition hover:text-neutral-900",
                activeView === "home" ? "text-brand" : "text-neutral-500",
              )}
            >
              Features
            </button>
            <button
              onClick={() => setActiveView("teams")}
              className={cn(
                "text-sm font-semibold transition hover:text-neutral-900",
                activeView === "teams" ? "text-brand" : "text-neutral-500",
              )}
            >
              For Teams
            </button>
            <button
              onClick={() => setActiveView("templates")}
              className={cn(
                "text-sm font-semibold transition hover:text-neutral-900",
                activeView === "templates" ? "text-brand" : "text-neutral-500",
              )}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveView("pricing")}
              className={cn(
                "text-sm font-semibold transition hover:text-neutral-900",
                activeView === "pricing" ? "text-brand" : "text-neutral-500",
              )}
            >
              Pricing
            </button>

            {/* Resources menu dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-semibold text-neutral-500 transition hover:text-neutral-900"
              >
                Resources
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 z-20 w-48 rounded-xl border border-neutral-100 bg-white p-1 shadow-lg divide-y divide-neutral-50 animate-pop-in">
                    <div className="py-1">
                      <button
                        onClick={() => setActiveView("downloads")}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <LandingIcon name="download" className="h-4 w-4" /> App
                        Downloads
                      </button>
                      <button
                        onClick={() => setActiveView("developer")}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <LandingIcon name="code" className="h-4 w-4" />{" "}
                        Developer API
                      </button>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => setActiveView("support")}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <LandingIcon name="chat" className="h-4 w-4" /> Help
                        &amp; Support
                      </button>
                      <button
                        onClick={() => setActiveView("quiz")}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-600 rounded-lg hover:bg-neutral-50 hover:text-neutral-900"
                      >
                        <LandingIcon name="sparkles" className="h-4 w-4" />{" "}
                        Productivity Quiz
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={siteConfig.routes.login}
            className="rounded-md px-3 py-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-900"
          >
            Log in
          </Link>
          <Link href={siteConfig.routes.signup}>
            <Button size="md">Start for free</Button>
          </Link>
        </div>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <main className="flex-1">
        {activeView === "home" && (
          <div className="animate-fade-up">
            {/* HERO */}
            <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
              <span className="mb-4 rounded-full bg-brand-tint px-3 py-1 text-xs font-bold text-brand">
                #1 task manager &amp; to-do list app
              </span>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-7xl">
                A To-Do List to Organize <br className="hidden sm:inline" />{" "}
                Your Work &amp; Life
              </h1>
              <p className="mt-6 max-w-xl text-lg text-neutral-500 leading-relaxed">
                Regain clarity and calmness. Organize tasks, schedule due dates,
                check off collaborative progress, and track statistics.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href={siteConfig.routes.signup}>
                  <Button size="lg">Start for free</Button>
                </Link>
                <button
                  onClick={() => setActiveView("teams")}
                  className="rounded-lg border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition shadow-xs"
                >
                  Explore for Teams
                </button>
              </div>
            </section>

            {/* Interactive Mockup View Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-4xl mx-auto px-6">
              {[
                { id: "inbox", label: "Inbox & Tasks", Icon: PhTray },
                { id: "calendar", label: "Schedule Calendar", Icon: PhCalendarBlank },
                { id: "board", label: "Kanban Board", Icon: PhKanban },
                { id: "productivity", label: "Karma & Progress", Icon: PhChartLineUp },
                { id: "teams", label: "Team Workspace", Icon: PhUsersThree },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMockupTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer",
                    mockupTab === tab.id
                      ? "bg-brand text-white shadow-md shadow-brand/20 scale-[1.05]"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80",
                  )}
                >
                  <tab.Icon size={14} weight="bold" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* MOCKUP PREVIEW */}
            <section className="px-6 pb-20 max-w-6xl mx-auto relative">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(222,72,58,0.06),transparent_65%)] pointer-events-none" />

              {/* MacBook lid / screen */}
              <div className="mx-auto max-w-5xl rounded-t-[22px] border-[10px] border-b-[14px] border-neutral-900 bg-neutral-900 shadow-2xl relative transition-all duration-500 hover:shadow-brand/10">
                {/* Webcam */}
                <div className="absolute top-[3px] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-neutral-700" />
                </div>

                {/* Inner screen */}
                <div className="rounded-[10px] bg-white overflow-hidden aspect-[16/10] flex flex-col relative select-none">
                  {/* Chrome tab strip */}
                  <div className="flex items-center gap-2 bg-[#dee1e6] px-3 pt-2 shrink-0">
                    <div className="flex items-center gap-1.5 pr-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    {/* active tab */}
                    <div className="flex items-center gap-1.5 rounded-t-lg bg-white px-3 py-1.5 text-[10px] font-semibold text-neutral-700 shadow-[0_-1px_2px_rgba(0,0,0,0.04)]">
                      <span className="h-3 w-3 rounded-sm bg-brand text-[7px] font-bold text-white flex items-center justify-center">
                        T
                      </span>
                      <span className="max-w-[120px] truncate">Todoist: To-Do List</span>
                      <span className="text-neutral-400">×</span>
                    </div>
                    {/* inactive tab */}
                    <div className="hidden sm:flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-[10px] font-medium text-neutral-500">
                      <span className="h-3 w-3 rounded-sm bg-neutral-300" />
                      <span className="max-w-[90px] truncate">Inbox</span>
                    </div>
                    <span className="text-neutral-500 text-sm leading-none pb-1">+</span>
                  </div>
                  {/* Chrome toolbar */}
                  <div className="flex items-center gap-2 bg-white border-b border-neutral-200 px-3 py-1.5 shrink-0">
                    <div className="flex items-center gap-2.5 text-neutral-400">
                      <BrowserGlyph d="M15 5l-7 7 7 7" />
                      <BrowserGlyph d="M9 5l7 7-7 7" />
                      <BrowserGlyph d="M4 9a8 8 0 0114-5M20 12a8 8 0 01-14 5" />
                    </div>
                    <div className="flex flex-1 items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-[9px] text-neutral-500">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      <span className="truncate font-medium">todoist.com/app/{mockupTab}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="text-xs"></span>
                      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-brand to-amber-400" />
                    </div>
                  </div>
                  {/* Mock dashboard content */}
                  <div className="flex-1 flex overflow-hidden">
                    <aside className="w-48 bg-neutral-50/60 border-r border-neutral-100 p-3.5 space-y-4 hidden sm:block shrink-0">
                      <div className="flex items-center gap-2 px-1">
                        <span className="h-6 w-6 rounded-full bg-brand text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                          T
                        </span>
                        <span className="text-xs font-bold text-neutral-800">
                          Tushar Jolly
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="block px-2 py-0.5 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                          Workspace
                        </span>
                        <div className="text-[11px] font-semibold text-neutral-600 space-y-0.5">
                          <div
                            className={cn(
                              "px-2.5 py-1.5 rounded-lg flex items-center justify-between transition",
                              mockupTab === "inbox"
                                ? "bg-brand/10 text-brand font-bold"
                                : "hover:bg-neutral-50",
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              <LandingIcon
                                name="inbox"
                                className="h-3.5 w-3.5"
                              />
                              Inbox
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-200/60 text-neutral-500">
                              12
                            </span>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 flex items-center gap-1.5">
                            <LandingIcon
                              name="calendar"
                              className="h-3.5 w-3.5"
                            />
                            Today
                          </div>
                          <div
                            className={cn(
                              "px-2.5 py-1.5 rounded-lg flex items-center justify-between transition",
                              mockupTab === "calendar"
                                ? "bg-brand/10 text-brand font-bold"
                                : "hover:bg-neutral-50",
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              <LandingIcon
                                name="calendarUpcoming"
                                className="h-3.5 w-3.5"
                              />
                              Calendar View
                            </span>
                          </div>
                          <div
                            className={cn(
                              "px-2.5 py-1.5 rounded-lg flex items-center justify-between transition",
                              mockupTab === "board"
                                ? "bg-brand/10 text-brand font-bold"
                                : "hover:bg-neutral-50",
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              <LandingIcon
                                name="users"
                                className="h-3.5 w-3.5"
                              />
                              Task Boards
                            </span>
                          </div>
                          <div
                            className={cn(
                              "px-2.5 py-1.5 rounded-lg flex items-center justify-between transition",
                              mockupTab === "productivity"
                                ? "bg-brand/10 text-brand font-bold"
                                : "hover:bg-neutral-50",
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              <LandingIcon
                                name="sparkles"
                                className="h-3.5 w-3.5"
                              />
                              Karma Dashboard
                            </span>
                          </div>
                        </div>
                      </div>
                    </aside>
                    <main className="flex-1 p-6 overflow-y-auto no-scrollbar flex flex-col justify-between bg-white text-left">
                      {mockupTab === "inbox" && (
                        <div className="space-y-4 animate-fade-up">
                          <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-base font-bold text-neutral-900">
                              Inbox
                            </h3>
                            <span className="text-[10px] text-neutral-400 font-semibold">
                              Sorted by due date
                            </span>
                          </div>
                          <div className="space-y-2">
                            <TaskRow
                              title="Draft next quarter marketing campaign budget"
                              completed
                            />
                            <TaskRow
                              title="Schedule 1-on-1 meeting with Design Lead"
                              priority="orange"
                            />
                            <TaskRow
                              title="Review Google Sheet export validation"
                              priority="blue"
                            />
                            <TaskRow
                              title="Implement billing cycle subscription grid"
                              priority="red"
                            />
                            <TaskRow title="Release version 10.9 update to app store" />
                          </div>
                        </div>
                      )}

                      {mockupTab === "calendar" && (
                        <div className="space-y-4 animate-fade-up">
                          <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-base font-bold text-neutral-900">
                              Week Schedule Calendar
                            </h3>
                            <span className="text-[10px] text-brand font-extrabold uppercase bg-brand/10 px-2 py-0.5 rounded">
                              PRO feature
                            </span>
                          </div>
                          <div className="grid grid-cols-5 gap-2 text-center text-[10px] text-neutral-500 font-bold border-b pb-1 bg-neutral-50 py-1 rounded">
                            <div>Mon 29</div>
                            <div>Tue 30</div>
                            <div>Wed 1</div>
                            <div>Thu 2</div>
                            <div>Fri 3</div>
                          </div>
                          <div className="grid grid-cols-5 gap-2 min-h-[140px] text-[9px]">
                            <div className="space-y-1.5 border-r border-neutral-100 pr-1">
                              <div className="bg-brand/10 border-l-2 border-brand p-1.5 rounded text-brand font-semibold leading-tight">
                                09:30 AM <br /> Standup meeting
                              </div>
                              <div className="bg-blue-50 border-l-2 border-blue-500 p-1.5 rounded text-blue-700 font-medium leading-tight">
                                14:00 PM <br /> Code Review
                              </div>
                            </div>
                            <div className="space-y-1.5 border-r border-neutral-100 px-1">
                              <div className="bg-amber-50 border-l-2 border-amber-500 p-1.5 rounded text-amber-700 font-medium leading-tight">
                                11:00 AM <br /> Design Crit
                              </div>
                            </div>
                            <div className="space-y-1.5 border-r border-neutral-100 px-1">
                              <div className="bg-brand/10 border-l-2 border-brand p-1.5 rounded text-brand font-semibold leading-tight">
                                10:00 AM <br /> Client Sync
                              </div>
                            </div>
                            <div className="space-y-1.5 border-r border-neutral-100 px-1">
                              <div className="bg-green-50/80 border-l-2 border-green-600 p-1.5 rounded text-green-700 font-medium leading-tight">
                                15:00 PM <br /> Marketing Pitch
                              </div>
                            </div>
                            <div className="space-y-1.5 px-1">
                              <div className="bg-neutral-100 border-l-2 border-neutral-400 p-1.5 rounded text-neutral-600 font-medium leading-tight">
                                16:30 PM <br /> Weekly retrospective
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {mockupTab === "board" && (
                        <div className="space-y-4 animate-fade-up h-full flex flex-col">
                          <div className="flex justify-between items-center border-b pb-2.5 shrink-0">
                            <h3 className="text-base font-bold text-neutral-900">
                              Kanban Boards
                            </h3>
                            <span className="text-[10px] text-neutral-400 font-semibold">
                              Drag cards to update state
                            </span>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-3 pt-1">
                            <div className="bg-neutral-50 rounded-xl p-2.5 space-y-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                To Do (2)
                              </span>
                              <div className="bg-white border border-neutral-200/80 rounded-lg p-2 shadow-2xs text-[10px] font-bold text-neutral-700 leading-normal">
                                Integrate Chrome extension
                              </div>
                              <div className="bg-white border border-neutral-200/80 rounded-lg p-2 shadow-2xs text-[10px] font-bold text-neutral-700 leading-normal">
                                Setup Zapier triggers
                              </div>
                            </div>
                            <div className="bg-neutral-50 rounded-xl p-2.5 space-y-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                In Progress (1)
                              </span>
                              <div className="bg-white border border-brand/20 rounded-lg p-2 shadow-2xs text-[10px] font-bold text-neutral-700 border-l-2 border-brand leading-normal">
                                Refactor state managers
                              </div>
                            </div>
                            <div className="bg-neutral-50 rounded-xl p-2.5 space-y-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                                Done (2)
                              </span>
                              <div className="bg-white border border-neutral-200/80 rounded-lg p-2 shadow-2xs text-[10px] text-neutral-400 line-through leading-normal">
                                Draft quarterly release
                              </div>
                              <div className="bg-white border border-neutral-200/80 rounded-lg p-2 shadow-2xs text-[10px] text-neutral-400 line-through leading-normal">
                                Clean settings styles
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {mockupTab === "productivity" && (
                        <div className="space-y-4 animate-fade-up">
                          <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-base font-bold text-neutral-900">
                              Karma &amp; Productivity Metrics
                            </h3>
                            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                              <PhCrown size={12} weight="fill" /> Level: Master
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="border border-neutral-200 rounded-xl p-3 bg-white text-center">
                              <span className="text-[10px] text-neutral-400 font-bold block">
                                Daily Goal
                              </span>
                              <span className="text-xl font-extrabold text-[#202020] block mt-1">
                                5/5
                              </span>
                              <span className="text-[9px] text-green-600 font-bold block mt-1">
                                ✓ Complete
                              </span>
                            </div>
                            <div className="border border-neutral-200 rounded-xl p-3 bg-white text-center">
                              <span className="text-[10px] text-neutral-400 font-bold block">
                                Weekly Goal
                              </span>
                              <span className="text-xl font-extrabold text-[#202020] block mt-1">
                                32/30
                              </span>
                              <span className="text-[9px] text-green-600 font-bold block mt-1">
                                ✓ +2 tasks
                              </span>
                            </div>
                            <div className="border border-neutral-200 rounded-xl p-3 bg-white text-center">
                              <span className="text-[10px] text-neutral-400 font-bold block">
                                Karma Points
                              </span>
                              <span className="text-xl font-extrabold text-brand block mt-1">
                                8,450
                              </span>
                              <span className="text-[9px] text-brand/80 font-bold block mt-1">
                                Rank Top 1%
                              </span>
                            </div>
                          </div>
                          <div className="border border-neutral-200 rounded-xl p-3.5 space-y-2 bg-neutral-50/50">
                            <span className="text-[10px] font-bold text-neutral-500 block">
                              Weekly Completion Activity Curve
                            </span>
                            <div className="flex items-end justify-between h-14 pt-2 px-4 gap-2">
                              {[
                                { day: "Mon", h: "h-6" },
                                { day: "Tue", h: "h-8" },
                                { day: "Wed", h: "h-11" },
                                { day: "Thu", h: "h-7" },
                                { day: "Fri", h: "h-10" },
                                { day: "Sat", h: "h-4" },
                                { day: "Sun", h: "h-5" },
                              ].map((bar) => (
                                <div
                                  key={bar.day}
                                  className="flex-1 flex flex-col items-center gap-1.5"
                                >
                                  <div
                                    className={cn(
                                      "w-full bg-brand rounded-t-sm",
                                      bar.h,
                                    )}
                                  />
                                  <span className="text-[8px] text-neutral-400 font-bold">
                                    {bar.day}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {mockupTab === "teams" && (
                        <div className="space-y-4 animate-fade-up">
                          <div className="flex justify-between items-center border-b pb-2.5">
                            <h3 className="text-base font-bold text-neutral-900">
                              Workspace Members Directory
                            </h3>
                            <span className="text-[10px] text-neutral-400 font-bold">
                              3 active members
                            </span>
                          </div>
                          <div className="divide-y divide-neutral-100">
                            {[
                              {
                                name: "Tushar Jolly (You)",
                                email: "tushar.gts7650@gmail.com",
                                role: "Owner",
                                bg: "bg-[#d6409f]",
                              },
                              {
                                name: "Sarah Conners",
                                email: "sarah.conners@nicelydone.com",
                                role: "Collaborator",
                                bg: "bg-blue-500",
                              },
                              {
                                name: "Alex Rivera",
                                email: "alex.rivera@nicelydone.com",
                                role: "Pending Invite",
                                bg: "bg-neutral-300",
                              },
                            ].map((member) => (
                              <div
                                key={member.name}
                                className="flex items-center justify-between py-2 text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className={cn(
                                      "h-7 w-7 rounded-full text-white text-[10px] font-bold flex items-center justify-center",
                                      member.bg,
                                    )}
                                  >
                                    {member.name.charAt(0)}
                                  </span>
                                  <div>
                                    <span className="font-bold text-neutral-800 block">
                                      {member.name}
                                    </span>
                                    <span className="text-[9px] text-neutral-400">
                                      {member.email}
                                    </span>
                                  </div>
                                </div>
                                <span
                                  className={cn(
                                    "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                                    member.role === "Owner"
                                      ? "border-brand bg-brand-tint text-brand"
                                      : member.role === "Collaborator"
                                        ? "border-blue-200 bg-blue-50 text-blue-600"
                                        : "border-neutral-200 bg-neutral-50 text-neutral-400",
                                  )}
                                >
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </main>
                  </div>
                </div>
              </div>
              {/* MacBook base / hinge */}
              <div className="mx-auto max-w-[calc(64rem+40px)] relative">
                <div className="mx-auto h-3 w-full rounded-b-xl bg-gradient-to-b from-neutral-300 to-neutral-400 shadow-md" />
                <div className="mx-auto h-1.5 w-28 rounded-b-lg bg-neutral-400/80" />
              </div>
            </section>

            {/* Social proof band */}
            <SocialProofBand />

            {/* ===================== FEATURE SECTIONS ===================== */}

            {/* 1 — text left / mockup right */}
            <FeatureSplit
              eyebrow="Capture everything"
              title="Get it all out of your head"
              body="Add tasks in seconds with natural language. Type “Pay rent every 1st at 9am” and we’ll set the date, time, and recurrence for you — so nothing slips."
              bullets={[
                "Natural-language due dates & recurrence",
                "Priorities, labels, reminders & sub-tasks",
                "Quick Add from anywhere with one shortcut",
              ]}
              cta={{ label: "Start for free", href: siteConfig.routes.signup }}
            >
              <MockInbox />
            </FeatureSplit>

            {/* 2 — mockup left / text right */}
            <FeatureSplit
              reverse
              tinted
              eyebrow="Plan your week"
              title="See your schedule at a glance"
              body="Switch any project to a calendar or board layout. Drag tasks across days, time-block your focus hours, and keep deadlines visible."
              bullets={[
                "Calendar & Kanban board layouts",
                "Drag-and-drop scheduling",
                "Time-blocking with task durations",
              ]}
            >
              <MockCalendar />
            </FeatureSplit>

            {/* 3 — text left / mockup right */}
            <FeatureSplit
              eyebrow="Stay motivated"
              title="Build momentum with Karma"
              body="Set daily and weekly goals, keep your streak alive, and watch your productivity trend upward with visual progress and celebrations."
              bullets={[
                "Daily & weekly task goals",
                "Streaks, levels and Karma points",
                "Vacation mode that protects your streak",
              ]}
            >
              <MockKarma />
            </FeatureSplit>

            {/* Quote + simple→advanced rail */}
            <QuoteSlider onExplore={() => setActiveView("teams")} />

            {/* Feature grid */}
            <FeatureGrid nav={setActiveView} />

            {/* Stats band */}
            <section className="bg-[#fcf7f5] py-16">
              <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 text-center md:grid-cols-4">
                {[
                  ["4.8★", "App Store rating"],
                  ["30M+", "People organized"],
                  ["2B+", "Tasks completed"],
                  ["100+", "Integrations"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="text-3xl font-extrabold text-brand">{n}</p>
                    <p className="mt-1 text-sm text-neutral-500">{l}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4 — mockup left / text right */}
            <FeatureSplit
              reverse
              tinted
              eyebrow="Work together"
              title="Bring your team into one place"
              body="Create a shared team workspace, organize projects into folders, assign work, and discuss right where the tasks live."
              bullets={[
                "Shared team workspaces & folders",
                "Assignees, comments & reactions",
                "Roles and access controls",
              ]}
              cta={{ label: "Explore for Teams", onClick: () => setActiveView("teams") }}
            >
              <MockTeam />
            </FeatureSplit>

            {/* Final CTA */}
            <section className="px-6 py-24">
              <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-brand to-[#b23b30] px-8 py-16 text-center text-white shadow-xl">
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Start organizing your work &amp; life today
                </h2>
                <p className="mx-auto mt-3 max-w-md text-white/85">
                  Join millions who trust Todoist to keep life moving forward.
                  It&apos;s free to get started.
                </p>
                <div className="mt-8 flex justify-center">
                  <Link href={siteConfig.routes.signup}>
                    <button className="rounded-lg bg-white px-7 py-3 text-sm font-bold text-brand shadow-sm transition hover:bg-white/90">
                      Start for free
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === "teams" && (
          <div className="animate-fade-up max-w-4xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center space-y-4">
              <span className="text-xs font-extrabold uppercase bg-brand/10 text-brand px-3 py-1 rounded-full">
                Todoist Business
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-6xl">
                Organize your team’s work, <br /> projects &amp; tasks
              </h1>
              <p className="text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
                Connect your members, delegate goals, configure permissions, and
                protect operations under a centralized administrator panel.
              </p>
              <div className="pt-2">
                <Link href={siteConfig.routes.signup}>
                  <Button size="lg">Create business workspace</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <FeatureCard
                icon="users"
                title="Centralized Members"
                desc="Manage active and pending members, assign Roles, or remove members in Settings."
              />
              <FeatureCard
                icon="lock"
                title="Security & Admin"
                desc="Audit workspace actions, control external guest sharing, and safeguard domains."
              />
              <FeatureCard
                icon="chart"
                title="Team Analytics"
                desc="Review weekly completion curves, productivity cycles, and workload distributions."
              />
            </div>
          </div>
        )}

        {activeView === "pricing" && (
          <div className="animate-fade-up max-w-4xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900">
                Simple, transparent pricing
              </h1>
              <p className="text-sm text-neutral-500 max-w-md mx-auto">
                Select the ideal tier for your work. Switch cycle to unlock
                savings.
              </p>

              {/* Cycle Toggle */}
              <div className="flex justify-center pt-4">
                <div className="flex bg-neutral-100 p-1 rounded-xl">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={cn(
                      "px-4 py-1.5 text-xs font-bold rounded-lg transition",
                      billingCycle === "monthly"
                        ? "bg-white text-neutral-900 shadow-xs"
                        : "text-neutral-500",
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={cn(
                      "flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-lg transition",
                      billingCycle === "yearly"
                        ? "bg-white text-neutral-900 shadow-xs"
                        : "text-neutral-500",
                    )}
                  >
                    Yearly
                    <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded font-extrabold uppercase">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PriceCard
                title="Free"
                price="€0"
                cycle="forever"
                buttonText="Start for free"
                benefits={[
                  "Up to 5 active projects",
                  "3 collaborative members",
                  "Basic activity log",
                ]}
              />
              <PriceCard
                title="Pro"
                price={billingCycle === "yearly" ? "€4" : "€5"}
                cycle="member / month"
                buttonText="Upgrade to Pro"
                benefits={[
                  "Up to 300 active projects",
                  "25 collaborative members",
                  "Reminders & task durations",
                  "Unlimited activity logs",
                ]}
                active
              />
              <PriceCard
                title="Business"
                price={billingCycle === "yearly" ? "€6" : "€8"}
                cycle="member / month"
                buttonText="Get Business"
                benefits={[
                  "Up to 500 active projects",
                  "50 collaborative members",
                  "Admin & member roles",
                  "Priority team support",
                ]}
              />
            </div>
          </div>
        )}

        {activeView === "templates" && (
          <div className="animate-fade-up max-w-4xl mx-auto px-6 py-16 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
                Free templates for work &amp; life
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Browse pre-made task checklists to kickstart your next project.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {TEMPLATES.map((t) => (
                <div
                  key={t.name}
                  className="border border-neutral-100 rounded-2xl p-5 space-y-4 hover:border-neutral-200 hover:shadow-md transition bg-white flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span
                      className="inline-flex p-2.5 rounded-full text-neutral-700"
                      style={{ backgroundColor: t.bg }}
                    >
                      <LandingIcon name={t.icon} className="h-7 w-7" />
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 pt-1">
                      {t.name}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {t.tagline}
                    </p>
                  </div>
                  <Link
                    href={siteConfig.routes.signup}
                    className="w-full block"
                  >
                    <button className="w-full text-center py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-lg hover:bg-neutral-200 transition">
                      Preview template
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === "downloads" && (
          <div className="animate-fade-up max-w-3xl mx-auto px-6 py-16 space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-neutral-900">
                Downloads | Todoist
              </h1>
              <p className="text-sm text-neutral-500">
                Get native task planners for your desktop and mobile platforms.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
              <DownloadOption
                platform="macOS Desktop"
                icon="laptop"
                extension="dmg"
              />
              <DownloadOption
                platform="Windows App"
                icon="window"
                extension="exe"
              />
              <DownloadOption
                platform="Linux client"
                icon="terminal"
                extension="AppImage"
              />
              <DownloadOption
                platform="iOS Mobile"
                icon="phone"
                extension="AppStore"
              />
              <DownloadOption
                platform="Android Phone"
                icon="android"
                extension="APK"
              />
            </div>
          </div>
        )}

        {activeView === "developer" && (
          <div className="animate-fade-up max-w-3xl mx-auto px-6 py-16 space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                Developing with Todoist – Guides
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Integrate custom automations and connect external task triggers.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-200/80 bg-neutral-950 text-emerald-400 font-mono text-xs shadow-xl space-y-3">
              <div className="flex justify-between items-center text-[10px] text-neutral-500 border-b border-neutral-900 pb-2">
                <span>REST API Endpoint v2</span>
                <span className="font-bold">cURL</span>
              </div>
              <pre className="overflow-x-auto text-[11px] leading-relaxed">
                {`curl -X POST https://api.todoist.com/rest/v2/tasks \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer $ACCESS_TOKEN" \\\n  -d '{"content": "Draft release notes", "due_string": "today"}'`}
              </pre>
            </div>
          </div>
        )}

        {activeView === "support" && (
          <div className="animate-fade-up max-w-xl mx-auto px-6 py-16 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                Help Center / Contact Us
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Submit support tickets to log queries with Doist engineers.
              </p>
            </div>

            {supportSubmitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <LandingIcon name="check" className="h-5 w-5" />
                </span>
                <h3 className="text-sm font-bold text-neutral-900">
                  Support Ticket Logged
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  We have received your ticket. A support manager will follow up
                  shortly at <strong>{supportEmail}</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Subject title"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Message Details
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Write detailed query message..."
                    value={supportDesc}
                    onChange={(e) => setSupportDesc(e.target.value)}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-brand resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-brand py-2.5 text-xs font-semibold text-white hover:bg-brand-dark transition shadow-2xs"
                >
                  Submit Ticket
                </button>
              </form>
            )}
          </div>
        )}

        {activeView === "quiz" && (
          <div className="animate-fade-up max-w-xl mx-auto px-6 py-16 space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold text-neutral-900">
                Productivity Style Quiz
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Answer questions to find which workflow method fits your style.
              </p>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-6 bg-neutral-50/10">
              {quizStep === "intro" && (
                <div className="text-center py-6 space-y-4">
                  <LandingIcon
                    name="rocket"
                    className="mx-auto h-10 w-10 text-brand"
                  />
                  <h3 className="text-sm font-bold text-neutral-900">
                    Which method fits your brain?
                  </h3>
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
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="calendar"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Specific hours blocked on calendar
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(1, "pomodoro")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="timer"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Focused bursts followed by brief breaks
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(1, "gtd")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="inbox"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Inbox collecting systematically sorted later
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
                    What is your biggest blocker?
                  </h3>
                  <div className="space-y-2 mt-3">
                    <button
                      onClick={() => handleQuizAnswer(2, "pomodoro")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="moon"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Losing focus after working too long
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(2, "timebox")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="zap"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Reacting to urgent requests
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(2, "gtd")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="brain"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Keeping too many task items in my head
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
                    Which style makes you feel most organized?
                  </h3>
                  <div className="space-y-2 mt-3">
                    <button
                      onClick={() => handleQuizAnswer(3, "gtd")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="folder"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Project folders, tags, and reviews
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(3, "timebox")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="calendarUpcoming"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Hourly planners and time calendars
                    </button>
                    <button
                      onClick={() => handleQuizAnswer(3, "pomodoro")}
                      className="flex w-full items-center gap-2.5 text-left p-3.5 rounded-xl border border-neutral-200 hover:border-brand bg-white text-xs font-medium hover:bg-red-50/10 transition"
                    >
                      <LandingIcon
                        name="flame"
                        className="h-4 w-4 text-neutral-500"
                      />
                      Sprints of key focused items
                    </button>
                  </div>
                </div>
              )}

              {quizStep === "result" && (
                <div className="text-center py-6 space-y-4">
                  <LandingIcon
                    name="star"
                    className="mx-auto h-10 w-10 text-amber-400"
                  />
                  <h3 className="text-sm font-bold text-neutral-900">
                    Your Recommended Workflow
                  </h3>
                  <div className="p-4 rounded-xl bg-brand/5 border border-brand/10 max-w-sm mx-auto">
                    <h4 className="text-xs font-bold text-brand capitalize">
                      {quizResult === "gtd" && "Getting Things Done (GTD)"}
                      {quizResult === "pomodoro" && "Pomodoro Sprints"}
                      {quizResult === "timebox" && "Time Blocking"}
                    </h4>
                    <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                      You match this planning method! Create tasks, set
                      priorities, and organize them in boards.
                    </p>
                  </div>
                  <button
                    onClick={() => setQuizStep("intro")}
                    className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === "about" && (
          <div className="animate-fade-up max-w-2xl mx-auto px-6 py-16 space-y-6">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              About us | Doist
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We are a fully distributed remote team spanning 35+ countries. We
              bootstrapped our growth to design task management services that
              keep user routines simple and calm.
            </p>
            <div className="h-px bg-neutral-100" />
            <h3 className="text-sm font-bold text-neutral-900">Core Values</h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-neutral-600">
              <p>
                • <strong>Trust:</strong> We operate with complete transparency.
              </p>
              <p>
                • <strong>Independence:</strong> We are bootstrapped and
                self-sustainable.
              </p>
            </div>
          </div>
        )}

        {activeView === "careers" && (
          <div className="animate-fade-up max-w-2xl mx-auto px-6 py-16 space-y-6">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Careers | Doist
            </h1>
            <p className="text-sm text-neutral-500">
              Shape the future of daily task collaborations. Fully remote
              positions.
            </p>

            {applySubmitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-xs text-neutral-600 font-medium">
                  Application submitted! We will review your profile shortly.
                </p>
              </div>
            ) : applyJob ? (
              <form
                onSubmit={handleApplySubmit}
                className="space-y-4 border rounded-xl p-5"
              >
                <h3 className="text-sm font-bold text-neutral-900">
                  Applying for: {applyJob}
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={applyName}
                    onChange={(e) => setApplyName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={applyEmail}
                    onChange={(e) => setApplyEmail(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition"
                >
                  Submit Application
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <JobRow
                  title="Senior React Developer"
                  dept="Frontend Engineering"
                  onClick={() => setApplyJob("Senior React Developer")}
                />
                <JobRow
                  title="Product Designer"
                  dept="Design"
                  onClick={() => setApplyJob("Product Designer")}
                />
              </div>
            )}
          </div>
        )}

        {activeView === "status" && (
          <div className="animate-fade-up max-w-2xl mx-auto px-6 py-16 space-y-6">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Status | Todoist
            </h1>
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-xl text-xs font-bold text-green-700">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
              All systems are fully operational.
            </div>
            <div className="border border-neutral-100 rounded-xl divide-y text-xs">
              <div className="p-3.5 flex justify-between">
                <span>REST API gateway</span>
                <span className="text-green-600 font-bold">Operational</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span>Data Sync node</span>
                <span className="text-green-600 font-bold">Operational</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span>Web Client dashboard</span>
                <span className="text-green-600 font-bold">Operational</span>
              </div>
            </div>
          </div>
        )}

        {activeView === "partners" && (
          <div className="animate-fade-up max-w-xl mx-auto px-6 py-16 space-y-6">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Channel Partners | Todoist
            </h1>
            <p className="text-sm text-neutral-500">
              Connect with Doist to distribute our planner apps in your
              organization.
            </p>

            {partnerSubmitted ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <p className="text-xs text-neutral-600 font-medium">
                  Partner application submitted! We will log details soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Org Name"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@org.com"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition"
                >
                  Apply for Partner Program
                </button>
              </form>
            )}
          </div>
        )}

        {activeView === "press" && (
          <div className="animate-fade-up max-w-2xl mx-auto px-6 py-16 space-y-6">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Press &amp; Brand Resources
            </h1>
            <p className="text-sm text-neutral-500">
              Download official Todoist logo assets, screenshots, and color
              palettes.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 border rounded-xl space-y-2 text-center">
                <span className="flex items-center justify-center gap-1.5">
                  <LandingIcon name="image" className="h-4 w-4" /> Logo Pack
                </span>
                <button
                  onClick={() => alert("Downloading Logo Pack...")}
                  className="block w-full py-1.5 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200"
                >
                  Download ZIP
                </button>
              </div>
              <div className="p-4 border rounded-xl space-y-2 text-center">
                <span className="flex items-center justify-center gap-1.5">
                  <LandingIcon name="camera" className="h-4 w-4" /> Screen
                  mockups
                </span>
                <button
                  onClick={() => alert("Downloading Screen Pack...")}
                  className="block w-full py-1.5 bg-neutral-100 text-neutral-700 font-bold rounded-lg hover:bg-neutral-200"
                >
                  Download ZIP
                </button>
              </div>
            </div>
          </div>
        )}

        {activeView === "security" && (
          <div className="animate-fade-up max-w-2xl mx-auto px-6 py-16 space-y-6 text-xs text-neutral-600 leading-relaxed">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Security Policy
            </h1>
            <p className="text-sm text-neutral-500">
              Learn about our user data encryption protocols and server security
              metrics.
            </p>
            <h3 className="text-sm font-bold text-neutral-900 pt-2 border-b pb-1">
              Data protection at rest &amp; in transit
            </h3>
            <p>
              Task content, deadlines, email records, and custom user properties
              are encrypted using TLS 1.3 in transit and AES-256 protocols at
              rest.
            </p>
            <h3 className="text-sm font-bold text-neutral-900 pt-2 border-b pb-1">
              GDPR &amp; Compliance
            </h3>
            <p>
              Todoist is fully compliant with the EU General Data Protection
              Regulation. Users can trigger complete account deletion requests
              in settings panels at any time.
            </p>
          </div>
        )}

        {activeView === "privacy" && (
          <div className="animate-fade-up max-w-2xl mx-auto px-6 py-16 space-y-6 text-xs text-neutral-600 leading-relaxed">
            <h1 className="text-3xl font-extrabold text-neutral-900">
              Privacy Policy
            </h1>
            <p className="text-sm text-neutral-500">
              How Doist processes and secures user task details.
            </p>
            <h3 className="text-sm font-bold text-neutral-900 pt-2 border-b pb-1">
              Our Privacy Commitment
            </h3>
            <p>
              We believe in user trust. We do not sell task descriptions,
              comments, uploaded attachments, or user scheduling metadata to
              third-party ad networks.
            </p>
          </div>
        )}
      </main>

      {/* FOOTER NAVBAR (All Columns & Links) */}
      <footer className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
              Features
            </h4>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-neutral-500">
              <li>
                <button
                  onClick={() => setActiveView("home")}
                  className="hover:text-neutral-900"
                >
                  How it Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("templates")}
                  className="hover:text-neutral-900"
                >
                  Templates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("teams")}
                  className="hover:text-neutral-900"
                >
                  For Teams
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("pricing")}
                  className="hover:text-neutral-900"
                >
                  Pricing
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
              Resources
            </h4>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-neutral-500">
              <li>
                <button
                  onClick={() => setActiveView("downloads")}
                  className="hover:text-neutral-900"
                >
                  Downloads
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("support")}
                  className="hover:text-neutral-900"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("quiz")}
                  className="hover:text-neutral-900"
                >
                  Productivity Quiz
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("developer")}
                  className="hover:text-neutral-900"
                >
                  Developer API
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("partners")}
                  className="hover:text-neutral-900"
                >
                  Channel Partners
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
              About
            </h4>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-neutral-500">
              <li>
                <button
                  onClick={() => setActiveView("about")}
                  className="hover:text-neutral-900"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("careers")}
                  className="hover:text-neutral-900"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("press")}
                  className="hover:text-neutral-900"
                >
                  Press &amp; Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("status")}
                  className="hover:text-neutral-900"
                >
                  System Status
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
              Legal
            </h4>
            <ul className="mt-4 space-y-2 text-xs font-semibold text-neutral-500">
              <li>
                <button
                  onClick={() => setActiveView("security")}
                  className="hover:text-neutral-900"
                >
                  Security Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("privacy")}
                  className="hover:text-neutral-900"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-5xl border-t border-neutral-200/50 mt-10 pt-6 flex items-center justify-between text-xs text-neutral-400">
          <span>
            © {new Date().getFullYear()} Doist Inc. All rights reserved.
          </span>
          <button
            onClick={() => setActiveView("home")}
            className="hover:underline"
          >
            Back to top ↑
          </button>
        </div>
      </footer>
    </div>
  );
}

/* Local UI Helpers */
function TaskRow({
  title,
  completed,
  priority,
}: {
  title: string;
  completed?: boolean;
  priority?: "red" | "orange" | "blue" | "gray";
}) {
  const pColors = {
    red: "text-red-500 border-red-200 bg-red-50/50",
    orange: "text-orange-500 border-orange-200 bg-orange-50/50",
    blue: "text-blue-500 border-blue-200 bg-blue-50/50",
    gray: "text-neutral-400 border-neutral-200 bg-neutral-50/50",
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 text-xs">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 text-[10px]",
            completed
              ? "border-green-500 bg-green-50 text-green-600 font-bold"
              : "border-neutral-300",
          )}
        >
          {completed && <LandingIcon name="check" className="h-3 w-3" />}
        </span>
        <span
          className={cn(
            "text-xs leading-normal",
            completed
              ? "text-neutral-400 line-through"
              : "text-neutral-800 font-medium",
          )}
        >
          {title}
        </span>
      </div>
      {priority && (
        <span
          className={cn(
            "text-[9px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 uppercase tracking-wider scale-90",
            pColors[priority],
          )}
        >
          🚩 P
          {priority === "red"
            ? "1"
            : priority === "orange"
              ? "2"
              : priority === "blue"
                ? "3"
                : "4"}
        </span>
      )}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: IconName;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 border border-black/5 rounded-[30px] bg-white space-y-3 text-center shadow-[0px_6px_24px_0px_rgba(11,32,96,0.05)] hover:shadow-[0px_14px_42px_0px_rgba(15,28,71,0.07)] transition-all duration-300">
      <LandingIcon name={icon} className="mx-auto h-8 w-8 text-brand" />
      <h3 className="text-base font-bold text-[#191919]">{title}</h3>
      <p className="text-xs text-[#3d3d3d]/80 leading-relaxed">{desc}</p>
    </div>
  );
}

function PriceCard({
  title,
  price,
  cycle,
  buttonText,
  benefits,
  active,
}: {
  title: string;
  price: string;
  cycle: string;
  buttonText: string;
  benefits: string[];
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-8 rounded-[30px] border flex flex-col justify-between h-[370px] bg-white relative transition-all duration-300",
        active
          ? "border-brand shadow-[0px_12px_64px_0px_rgba(19,37,99,0.15)] scale-[1.02]"
          : "border-black/5 shadow-[0px_6px_24px_0px_rgba(11,32,96,0.05)]",
      )}
    >
      {active && (
        <span className="absolute top-3 right-3 bg-brand text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Best Value
        </span>
      )}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#191919]/60 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-baseline">
          <span className="text-3xl font-extrabold text-[#191919]">
            {price}
          </span>
          <span className="text-[#3d3d3d]/50 text-xs ml-1">/ {cycle}</span>
        </div>
        <ul className="text-xs text-[#3d3d3d] space-y-2 pt-2 text-left">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="text-brand/70 font-bold">•</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <Link href={siteConfig.routes.signup} className="w-full block pt-4">
        <button
          className={cn(
            "w-full py-2.5 text-xs font-bold rounded-full transition-all duration-200",
            active
              ? "bg-brand text-white hover:bg-brand-dark shadow-[0px_6px_24px_0px_rgba(11,32,96,0.15)]"
              : "border border-black/24 bg-transparent text-[#191919]/80 hover:bg-black/5",
          )}
        >
          {buttonText}
        </button>
      </Link>
    </div>
  );
}

function DownloadOption({
  platform,
  icon,
  extension,
}: {
  platform: string;
  icon: IconName;
  extension: string;
}) {
  const [loading, setLoading] = useState(false);
  const handleDownload = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Completed mock download for TickTick_${platform}.${extension}`);
    }, 1500);
  };

  return (
    <div className="p-8 border border-black/5 rounded-[30px] text-center space-y-4 bg-white shadow-[0px_8px_16px_0px_rgba(15,28,71,0.07)] hover:shadow-[0px_14px_42px_0px_rgba(15,28,71,0.07)] transition-all duration-300">
      <LandingIcon name={icon} className="mx-auto h-9 w-9 text-[#191919]/70" />
      <h3 className="text-xs font-bold text-[#191919]">{platform}</h3>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={cn(
          "w-full py-2.5 text-xs font-bold rounded-full transition-all duration-200",
          loading
            ? "bg-green-50 text-green-700"
            : "border border-black/24 bg-transparent text-[#191919]/80 hover:bg-black/5",
        )}
      >
        {loading ? "Downloading..." : `Download .${extension}`}
      </button>
    </div>
  );
}

function JobRow({
  title,
  dept,
  onClick,
}: {
  title: string;
  dept: string;
  onClick: () => void;
}) {
  return (
    <div className="p-5 border border-black/5 rounded-[20px] shadow-[0px_6px_24px_0px_rgba(11,32,96,0.05)] hover:shadow-[0px_14px_42px_0px_rgba(15,28,71,0.07)] transition-all duration-300 flex justify-between items-center bg-white">
      <div>
        <h4 className="text-xs font-bold text-[#191919]">{title}</h4>
        <span className="text-[10px] text-[#3d3d3d]/60 block mt-0.5">
          {dept} • Remote
        </span>
      </div>
      <button
        onClick={onClick}
        className="rounded-full border border-black/24 bg-transparent px-4 py-1.5 text-xs font-bold text-[#191919]/80 hover:bg-black/5 transition"
      >
        Apply
      </button>
    </div>
  );
}

/* ---------- Landing helper components ---------- */

function BrowserGlyph({ d }: { d: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeatureSplit({
  eyebrow,
  title,
  body,
  bullets,
  reverse,
  tinted,
  cta,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  reverse?: boolean;
  tinted?: boolean;
  cta?: { label: string; href?: string; onClick?: () => void };
  children: React.ReactNode;
}) {
  return (
    <section className={cn("py-16 sm:py-24", tinted && "bg-neutral-50/70")}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
        {/* Text */}
        <div className={cn(reverse && "md:order-2")}>
          <span className="text-xs font-extrabold uppercase tracking-wider text-brand">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-neutral-500">{body}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M5 12l5 5L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {b}
              </li>
            ))}
          </ul>
          {cta && (
            <div className="mt-8">
              {cta.href ? (
                <Link href={cta.href}>
                  <Button size="lg">{cta.label}</Button>
                </Link>
              ) : (
                <button
                  onClick={cta.onClick}
                  className="rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  {cta.label}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Visual */}
        <div className={cn("relative", reverse && "md:order-1")}>
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(222,72,58,0.08),transparent_70%)]" />
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function MockChrome({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
      <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
      <span className="h-2 w-2 rounded-full bg-[#28c840]" />
      <span className="ml-2 truncate rounded-full bg-white px-3 py-0.5 text-[9px] text-neutral-400">
        todoist.com/{path}
      </span>
    </div>
  );
}

function MockInbox() {
  const rows: [string, string | null][] = [
    ["Pay rent · every 1st", "red"],
    ["Draft Q3 marketing budget", "orange"],
    ["Reply to design feedback", "blue"],
    ["Book dentist appointment", null],
    ["Plan weekend trip", null],
  ];
  return (
    <div>
      <MockChrome path="app/inbox" />
      <div className="p-5">
        <p className="mb-3 text-sm font-bold text-[#202020]">Inbox</p>
        <div className="space-y-2.5">
          {rows.map(([t, c]) => (
            <div key={t} className="flex items-center gap-3">
              <span
                className="h-4 w-4 shrink-0 rounded-full border-2"
                style={{ borderColor: c ? dueHex(c) : "#cfcfcf" }}
              />
              <span className="text-sm text-neutral-700">{t}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1 text-sm font-medium text-brand">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
              +
            </span>
            Add task
          </div>
        </div>
      </div>
    </div>
  );
}

function MockCalendar() {
  return (
    <div>
      <MockChrome path="app/upcoming" />
      <div className="p-5">
        <p className="mb-3 text-sm font-bold text-[#202020]">Upcoming</p>
        <div className="grid grid-cols-4 gap-2">
          {["Mon 1", "Tue 2", "Wed 3", "Thu 4"].map((d, i) => (
            <div key={d}>
              <p className="mb-1.5 text-[10px] font-bold text-neutral-500">{d}</p>
              <div className="space-y-1.5">
                {i === 0 && (
                  <>
                    <CalChip color="#dc4c3e" label="09:30 Standup" />
                    <CalChip color="#2f6fed" label="14:00 Review" />
                  </>
                )}
                {i === 1 && <CalChip color="#e8833a" label="11:00 Crit" />}
                {i === 2 && <CalChip color="#4b8b3b" label="15:00 Pitch" />}
                {i === 3 && <CalChip color="#7c6fed" label="10:00 1:1" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalChip({ color, label }: { color: string; label: string }) {
  return (
    <div
      className="rounded p-1.5 text-[9px] font-semibold leading-tight"
      style={{ backgroundColor: `${color}1a`, color, borderLeft: `2px solid ${color}` }}
    >
      {label}
    </div>
  );
}

function MockKarma() {
  return (
    <div>
      <MockChrome path="app/productivity" />
      <div className="p-5">
        <p className="mb-3 text-sm font-bold text-[#202020]">Productivity</p>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            ["Daily", "5/5", "#4b8b3b"],
            ["Weekly", "32/30", "#4b8b3b"],
            ["Karma", "8,450", "#dc4c3e"],
          ].map(([l, v, c]) => (
            <div key={l} className="rounded-xl border border-neutral-200 p-2.5 text-center">
              <p className="text-[10px] font-bold text-neutral-400">{l}</p>
              <p className="mt-1 text-base font-extrabold" style={{ color: c }}>
                {v}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-end justify-between gap-1.5 px-1">
          {["h-5", "h-8", "h-11", "h-7", "h-10", "h-4", "h-6"].map((h, i) => (
            <div key={i} className={cn("flex-1 rounded-t bg-brand/80", h)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MockTeam() {
  const members: [string, string, string][] = [
    ["Tushar Jolly", "Owner", "#d6409f"],
    ["Sarah Conners", "Member", "#2f6fed"],
    ["Alex Rivera", "Member", "#4b8b3b"],
  ];
  return (
    <div>
      <MockChrome path="app/team" />
      <div className="p-5">
        <p className="mb-3 text-sm font-bold text-[#202020]">Nicelydone · Team</p>
        <div className="divide-y divide-neutral-100">
          {members.map(([n, r, c]) => (
            <div key={n} className="flex items-center justify-between py-2.5">
              <span className="flex items-center gap-2.5">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: c }}
                >
                  {n.charAt(0)}
                </span>
                <span className="text-sm text-neutral-700">{n}</span>
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                {r}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function dueHex(c: string): string {
  return (
    { red: "#dc4c3e", orange: "#ea580c", blue: "#2f6fed", green: "#16a34a" }[c] ??
    "#cfcfcf"
  );
}

/* ---------- Landing marketing sections ---------- */

function SocialProofBand() {
  return (
    <section className="bg-[#f6ece2] py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            300,000+ Reviews
          </p>
          <div className="mt-1 flex items-center justify-center gap-0.5 text-amber-500 md:justify-start">
            {[0, 1, 2, 3, 4].map((i) => (
              <PhStar key={i} size={16} weight="fill" />
            ))}
          </div>
          <p className="mt-1 text-sm font-semibold text-neutral-700">
            App Store and Google Play
          </p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Used by individuals and teams at
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-bold text-neutral-500 md:justify-end">
            <span className="text-[#ff9900]">amazon</span>
            <span className="text-neutral-700">Disney</span>
            <span className="text-[#5fa746]">shopify</span>
            <span className="text-[#57068c]">NYU</span>
            <span className="text-neutral-800"> Apple</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteSlider({ onExplore }: { onExplore: () => void }) {
  const steps: { label: string; Icon: React.ComponentType<{ size?: number }>; pro?: boolean }[] = [
    { label: "Add a task", Icon: PhPlus },
    { label: "Break it into subtasks", Icon: PhListChecks },
    { label: "Move tasks into projects", Icon: PhFolderSimple },
    { label: "Share your projects", Icon: PhShareNetwork },
    { label: "Give tasks a priority level", Icon: PhFlag },
    { label: "Set up reminders", Icon: PhAlarm, pro: true },
    { label: "Add some integrations", Icon: PhPuzzlePiece },
    { label: "Create filter views", Icon: PhFunnel },
    { label: "Complete tasks", Icon: PhCheckCircle },
  ];
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl rounded-3xl bg-[#fdf6f0] p-8 sm:p-14">
        <blockquote className="mx-auto max-w-2xl text-center text-2xl font-extrabold leading-snug text-neutral-900 sm:text-3xl">
          “Todoist makes it easy to go as simple or as complex as you want”{" "}
          <span className="text-neutral-400">– The Verge</span>
        </blockquote>
        <div className="mt-3 text-center">
          <button
            onClick={onExplore}
            className="text-sm font-bold text-brand hover:underline"
          >
            Explore more features
          </button>
        </div>

        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          {/* illustration placeholder */}
          <div className="relative flex h-60 items-center justify-center rounded-2xl border border-neutral-200/70 bg-white">
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(244,208,106,0.25),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(222,72,58,0.15),transparent_60%)]" />
            <PhListChecks size={56} className="relative text-brand/70" />
          </div>

          {/* simple → advanced rail */}
          <div className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                Simple
              </span>
              <span className="my-1 w-px flex-1 bg-gradient-to-b from-neutral-300 via-brand/40 to-neutral-300" />
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">
                Customize
              </span>
              <span className="my-1 w-px flex-1 bg-gradient-to-b from-neutral-300 via-brand/40 to-neutral-300" />
              <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                Advanced
              </span>
            </div>
            <ul className="flex-1 space-y-2.5">
              {steps.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5 text-sm text-neutral-700">
                  <span className="text-neutral-400">
                    <s.Icon size={16} />
                  </span>
                  {s.label}
                  {s.pro && (
                    <span className="rounded bg-brand-tint px-1.5 py-0.5 text-[9px] font-bold uppercase text-brand">
                      Pro
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ nav }: { nav: (v: ActiveView) => void }) {
  const items: {
    Icon: React.ComponentType<{ size?: number; className?: string }>;
    title: string;
    body: string;
    link: string;
    to: ActiveView;
  }[] = [
    {
      Icon: PhDownloadSimple,
      title: "With you everywhere",
      body: "Use Todoist's apps, extensions and widgets on any device or platform.",
      link: "Download apps",
      to: "downloads",
    },
    {
      Icon: PhSquaresFour,
      title: "There's a template for that",
      body: "Project templates are available to get you started with whatever's on your plate.",
      link: "Start with templates",
      to: "templates",
    },
    {
      Icon: PhSliders,
      title: "Make Todoist yours",
      body: "Customize your to-do list with filters, labels, priorities, and more.",
      link: "See all features",
      to: "teams",
    },
    {
      Icon: PhPuzzlePiece,
      title: "Connect with your other tools",
      body: "Link Todoist with your calendar, voice assistant, and 70+ other tools.",
      link: "Install integrations",
      to: "developer",
    },
    {
      Icon: PhBrain,
      title: "Productivity Methods",
      body: "Personal productivity recommendations based on your unique traits and strengths.",
      link: "Take the quiz",
      to: "quiz",
    },
  ];
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h2 className="max-w-2xl text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl">
          Delightfully simple and deceptively powerful task management
        </h2>
        <p className="mt-3 max-w-xl text-neutral-500">
          30 million+ people organize billions of tasks in Todoist for their
          work, education, and personal life.
        </p>
        <div className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {items.map((it) => (
            <div key={it.title} className="flex flex-col">
              <span className="text-brand">
                <it.Icon size={26} />
              </span>
              <p className="mt-3 text-sm font-bold text-[#202020]">{it.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {it.body}
              </p>
              <button
                onClick={() => nav(it.to)}
                className="mt-2 self-start text-sm font-semibold text-brand hover:underline"
              >
                → {it.link}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
