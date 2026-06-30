"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useTasks } from "../state";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

type Tab =
  | "account"
  | "general"
  | "subscription"
  | "theme"
  | "themes"
  | "sidebar"
  | "quick-add"
  | "productivity"
  | "reminders"
  | "notifications"
  | "backups"
  | "integrations"
  | "team-settings"
  | "members"
  | "billing"
  | "calendars";

interface ExtensionRef {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconColor: string;
  emoji: string;
}

const EXTENSIONS: ExtensionRef[] = [
  {
    id: "habit-tracker",
    name: "Habit Tracker",
    description: "Track your tasks to build and maintain good habits",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    emoji: "⭕",
  },
  {
    id: "task-helper",
    name: "Task Helper",
    description:
      "Speed up your work with automated task and sub-task operations.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    emoji: "⚙️",
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "Get AI-assisted help to make your goals more attainable.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    emoji: "✨",
  },
  {
    id: "conversation-starters",
    name: "Conversation Starters",
    description:
      "Add conversation starters to your projects to spark conversations.",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    emoji: "💡",
  },
  {
    id: "export-sheets",
    name: "Export to Google Sheets",
    description: "Easily export your Todoist projects to Google Sheets.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    emoji: "📊",
  },
];

interface IntegrationDef {
  id: string;
  name: string;
  creator: string;
  description: string;
  longDescription: string;
  category: "Productivity" | "Calendar" | "Developer" | "Communication";
  emoji: string;
  iconBg: string;
  iconColor: string;
}

const ALL_INTEGRATIONS: IntegrationDef[] = [
  {
    id: "akiflow",
    name: "Akiflow",
    creator: "Akiflow Inc.",
    description: "Consolidate all your tasks in one place.",
    longDescription:
      "Akiflow lets you pull tasks from all your email accounts, Slack channels, calendars, and other project management utilities into a single, structured calendar timeline dashboard. Eliminate context-switching and align your focus.",
    category: "Productivity",
    emoji: "🗓️",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
  },
  {
    id: "chrome",
    name: "Chrome Extension",
    creator: "Doist",
    description: "Add tasks from web pages in one click.",
    longDescription:
      "The official Chrome extension allows you to save any web page, link, or highlighted text directly to your Todoist Inbox as a task. Keep articles, research items, and reference material perfectly organized.",
    category: "Productivity",
    emoji: "🌐",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    id: "slack",
    name: "Slack Integration",
    creator: "Doist",
    description: "Create and manage tasks from Slack channels.",
    longDescription:
      "Connect Slack with Todoist to easily add tasks from Slack conversations, check off finished items directly, or receive channels update notifications.",
    category: "Communication",
    emoji: "💬",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
  },
  {
    id: "gcal",
    name: "Google Calendar",
    creator: "Doist",
    description: "Sync tasks with your Google Calendar.",
    longDescription:
      "Real-time, two-way sync between your tasks and Google Calendar. Changes made in Todoist are reflected immediately in your calendar, and vice versa.",
    category: "Calendar",
    emoji: "📆",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    id: "outlook",
    name: "Outlook Add-in",
    creator: "Doist",
    description: "Turn emails into tasks with a single click.",
    longDescription:
      "Quickly convert emails into tasks using the official Microsoft Outlook plug-in. Keep client threads, bills, and support queries under active planning lists.",
    category: "Communication",
    emoji: "📧",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    id: "zapier",
    name: "Zapier Connector",
    creator: "Zapier",
    description: "Connect Todoist with 5,000+ apps.",
    longDescription:
      "Create custom workflow triggers and tasks creations dynamically. Automate data passes between sheets, CRM databases, forms, and Todoist channels.",
    category: "Developer",
    emoji: "⚡",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

interface ThemeDef {
  id: string;
  name: string;
  accent: string;
  accentDark: string;
  tint: string;
  dark?: boolean;
}

const THEMES: ThemeDef[] = [
  {
    id: "obsidian",
    name: "Obsidian (Default)",
    accent: "#171717",
    accentDark: "#0a0a0a",
    tint: "#f5f5f5",
  },
  {
    id: "todoist",
    name: "Todoist Red",
    accent: "#dc4c3e",
    accentDark: "#c3392b",
    tint: "#fdf0ee",
  },
  {
    id: "dark",
    name: "Dark Mode",
    accent: "#f5f5f5",
    accentDark: "#e5e5e5",
    tint: "#1c1c1e",
    dark: true,
  },
  {
    id: "moonstone",
    name: "Moonstone",
    accent: "#5b6b7b",
    accentDark: "#48555f",
    tint: "#eef1f4",
  },
  {
    id: "tangerine",
    name: "Tangerine",
    accent: "#e8833a",
    accentDark: "#cf6f2c",
    tint: "#fdf1e7",
  },
  {
    id: "kale",
    name: "Kale",
    accent: "#4b8b3b",
    accentDark: "#3d7531",
    tint: "#eef5ea",
  },
  {
    id: "blueberry",
    name: "Blueberry",
    accent: "#2f6fed",
    accentDark: "#225ad0",
    tint: "#e9f0fe",
  },
  {
    id: "lavender",
    name: "Lavender",
    accent: "#7c6fed",
    accentDark: "#6657db",
    tint: "#efedfd",
  },
  {
    id: "raspberry",
    name: "Raspberry",
    accent: "#c0457f",
    accentDark: "#a83a6d",
    tint: "#fbeaf2",
  },
];

function applyThemeVars(id: string) {
  const t = THEMES.find((x) => x.id === id) ?? THEMES[0];
  const root = document.documentElement;
  root.style.setProperty("--color-brand", t.accent);
  root.style.setProperty("--color-brand-dark", t.accentDark);
  root.style.setProperty("--color-brand-hover", t.accentDark);
  root.style.setProperty("--color-brand-tint", t.tint);
  root.classList.toggle("dark", !!t.dark);
}

export function SettingsModal({
  open,
  onClose,
  initialTab,
}: SettingsModalProps) {
  const { state, dispatch } = useTasks();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab || "general");
  const [theme, setTheme] = useState("todoist");
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [syncTheme, setSyncTheme] = useState(true);
  const [autoDark, setAutoDark] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [name, setName] = useState("Tushar Jolly");
  const [email, setEmail] = useState("tushar.gts7650@gmail.com");
  const [lang, setLang] = useState("en");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [gcalConnected, setGcalConnected] = useState(false);

  // General settings configuration
  const [homeView, setHomeView] = useState("Inbox");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [timeFormat, setTimeFormat] = useState("13:00");
  const [weekStart, setWeekStart] = useState("Monday");
  const [nextWeek, setNextWeek] = useState("Monday");
  const [weekend, setWeekend] = useState("Saturday");
  const [smartDateRec, setSmartDateRec] = useState(true);
  const [soundDesktop, setSoundDesktop] = useState(true);
  const [soundMobile, setSoundMobile] = useState(true);
  // Sidebar settings
  const [sidebarShow, setSidebarShow] = useState<Record<string, boolean>>({
    Inbox: true,
    Today: true,
    Upcoming: true,
    "Filters & Labels": true,
    Reporting: true,
  });
  const [showTaskCount, setShowTaskCount] = useState(true);
  // Quick Add settings
  const [quickActions, setQuickActions] = useState([
    "Date",
    "Assignee",
    "Attachment",
    "Priority",
    "Reminders",
  ]);
  const [showActionLabels, setShowActionLabels] = useState(true);
  // Productivity settings
  const [karmaOn, setKarmaOn] = useState(true);
  const [goalCelebrations, setGoalCelebrations] = useState(true);
  const [daysOff, setDaysOff] = useState<Record<string, boolean>>({
    Mon: false,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: true,
    Sun: true,
  });
  // Reminders settings
  const [autoReminder, setAutoReminder] = useState("At time of task");
  const [remDesktop, setRemDesktop] = useState(true);
  const [remMobile, setRemMobile] = useState(true);
  const [remEmail, setRemEmail] = useState(true);
  // Notifications settings
  const [desktopNotif, setDesktopNotif] = useState(true);
  const NOTIF_ROWS = [
    "Comments for you",
    "Tasks assigned to you",
    "Tasks completed",
    "Tasks uncompleted",
    "Project archived",
    "Project invite accepted",
    "Project invite declined",
    "Project collaborator left",
    "Project collaborator removed",
  ];
  const [notifMatrix, setNotifMatrix] = useState<
    Record<string, { email: boolean; mobile: boolean }>
  >(() =>
    Object.fromEntries(
      NOTIF_ROWS.map((r) => [r, { email: true, mobile: true }]),
    ),
  );
  const [emailDigest, setEmailDigest] = useState(true);
  const [whatsNew, setWhatsNew] = useState(true);
  const [tipsTricks, setTipsTricks] = useState(true);
  const [loginAlert, setLoginAlert] = useState(true);
  const [resetSubtasks, setResetSubtasks] = useState(true);
  const [autoAcceptInvites, setAutoAcceptInvites] = useState(true);
  const [emailAssist, setEmailAssist] = useState(false);
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);

  // Integrations states
  const [integrationsView, setIntegrationsView] = useState<
    "installed" | "browse" | "developer"
  >("installed");
  const [integrationQuery, setIntegrationQuery] = useState("");
  const [integrationCat, setIntegrationCat] = useState<string>("All");
  const [selectedIntegrationId, setSelectedIntegrationId] = useState<
    string | null
  >(null);
  const [installedIntegrations, setInstalledIntegrations] = useState<
    Record<string, boolean>
  >({});

  // Subscription states
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );

  // Team configurations state
  const [teamName, setTeamName] = useState("Nicelydone");
  const [teamDomain, setTeamDomain] = useState("nicelydone.club");
  const [teamDiscovery, setTeamDiscovery] = useState(false);
  const [prohibitGuests, setProhibitGuests] = useState(false);
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(true);
  const [inviteCode, setInviteCode] = useState("ks4AAbfC2SAzNGMw...");

  // Pending Invites list
  const [pendingInvites, setPendingInvites] = useState([
    { email: "alice@nicelydone.club", role: "Pending" },
    { email: "jo@nicelydone.club", role: "Pending" },
  ]);

  // Active members
  const [activeMembers, setActiveMembers] = useState([
    {
      name: "Tushar Jolly (You)",
      email: "tushar.gts7650@gmail.com",
      role: "Admin",
    },
  ]);

  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Admin");
  const [membersView, setMembersView] = useState<"list" | "invite">("list");
  const [memberSearch, setMemberSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Two-factor authentication
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAStage, setTwoFAStage] = useState<"idle" | "enable">("idle");
  const [twoFACode, setTwoFACode] = useState("");
  const TFA_SECRET = "OZG3YU7PO3YMIQD7AHINWMJAAE2RRL44";
  const TFA_RECOVERY = [
    "QpSWj0KX",
    "RkycQuvz",
    "8H8bukaC",
    "OzGCaQOd",
    "FyQ7eB5d",
    "Gte6ccXn",
    "TRGhLxNk",
    "v2SoXVvR",
  ];
  const twoFAVerified = twoFACode.replace(/\D/g, "").length === 6;

  function copyText(text: string, message: string) {
    void navigator.clipboard?.writeText(text).catch(() => {});
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 1800);
  }

  useEffect(() => {
    if (open && initialTab) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Load theme on startup
  useEffect(() => {
    const savedTheme = localStorage.getItem("todo_app_theme") || "obsidian";
    setTheme(savedTheme);
    applyThemeVars(savedTheme);
  }, []);

  // Live-preview a theme without committing it yet.
  const previewTheme = (themeId: string) => {
    setPendingTheme(themeId);
    applyThemeVars(themeId);
  };

  const themeDirty = pendingTheme !== null && pendingTheme !== theme;
  const selectedTheme = pendingTheme ?? theme;

  const commitTheme = () => {
    if (!pendingTheme) return;
    setTheme(pendingTheme);
    localStorage.setItem("todo_app_theme", pendingTheme);
    setPendingTheme(null);
    setToastMessage("Theme updated");
    setTimeout(() => setToastMessage(null), 1800);
  };

  const discardTheme = () => {
    applyThemeVars(theme);
    setPendingTheme(null);
    setDiscardOpen(false);
  };

  // Revert an uncommitted preview if the modal is closed.
  useEffect(() => {
    if (!open && pendingTheme) {
      applyThemeVars(theme);
      setPendingTheme(null);
    }
  }, [open, pendingTheme, theme]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-4xl h-[520px] animate-pop-in overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Sidebar Tabs */}
        <aside className="w-[220px] shrink-0 bg-[#fafafa] border-r border-neutral-200/80 p-3 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pr-1">
            <div>
              <h2 className="text-[11px] font-bold text-neutral-400 px-2.5 mb-2 uppercase tracking-wider">
                Settings
              </h2>
              <div className="space-y-0.5">
                <TabButton
                  active={activeTab === "account"}
                  onClick={() => setActiveTab("account")}
                >
                  Account
                </TabButton>
                <TabButton
                  active={activeTab === "general"}
                  onClick={() => setActiveTab("general")}
                >
                  General
                </TabButton>
                <TabButton
                  active={activeTab === "subscription"}
                  onClick={() => setActiveTab("subscription")}
                >
                  Subscription
                </TabButton>
                <TabButton
                  active={activeTab === "theme" || activeTab === "themes"}
                  onClick={() => setActiveTab("theme")}
                >
                  Theme
                </TabButton>
                <TabButton
                  active={activeTab === "sidebar"}
                  onClick={() => setActiveTab("sidebar")}
                >
                  Sidebar
                </TabButton>
                <TabButton
                  active={activeTab === "quick-add"}
                  onClick={() => setActiveTab("quick-add")}
                >
                  Quick Add
                </TabButton>
                <TabButton
                  active={activeTab === "productivity"}
                  onClick={() => setActiveTab("productivity")}
                >
                  Productivity
                </TabButton>
                <TabButton
                  active={activeTab === "reminders"}
                  onClick={() => setActiveTab("reminders")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Reminders</span>
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-brand-tint text-brand scale-90">
                      PRO
                    </span>
                  </div>
                </TabButton>
                <TabButton
                  active={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                >
                  Notifications
                </TabButton>
                <TabButton
                  active={activeTab === "backups"}
                  onClick={() => setActiveTab("backups")}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>Backups</span>
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-brand-tint text-brand scale-90">
                      PRO
                    </span>
                  </div>
                </TabButton>
                <TabButton
                  active={activeTab === "integrations"}
                  onClick={() => setActiveTab("integrations")}
                >
                  Integrations
                </TabButton>
                <TabButton
                  active={activeTab === "calendars"}
                  onClick={() => setActiveTab("calendars")}
                >
                  Calendars
                </TabButton>
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-bold text-neutral-400 px-2.5 mb-2 uppercase tracking-wider">
                Nicelydone
              </h2>
              <div className="space-y-0.5">
                <TabButton
                  active={activeTab === "team-settings"}
                  onClick={() => setActiveTab("team-settings")}
                >
                  Team settings
                </TabButton>
                <TabButton
                  active={activeTab === "members"}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </TabButton>
                <TabButton
                  active={activeTab === "billing"}
                  onClick={() => setActiveTab("billing")}
                >
                  Billing
                </TabButton>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200/60 pt-2 mt-2 space-y-1">
            <button
              onClick={() => alert("Add team flow")}
              className="w-full text-left rounded-lg px-2.5 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-100 transition flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Add team</span>
            </button>
            <button
              onClick={onClose}
              className="w-full text-center text-xs font-semibold py-1.5 text-neutral-500 rounded hover:bg-neutral-100 hover:text-neutral-800 transition"
            >
              Close
            </button>
          </div>
        </aside>

        {/* Right: Tab content */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-up text-[#202020]">
                <div>
                  <h3 className="text-lg font-bold text-[#202020]">General</h3>
                </div>

                <div className="space-y-4">
                  {/* Language */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Language
                    </label>
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  {/* Home view */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Home view
                    </label>
                    <select
                      value={homeView}
                      onChange={(e) => setHomeView(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="Inbox">Inbox</option>
                      <option value="Today">Today</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                  </div>

                  {/* Date & Time Section Header */}
                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-[#202020] border-b pb-1">
                      Date &amp; time
                    </h4>
                  </div>

                  {/* Time zone */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Time zone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>

                  {/* Time format */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Time format
                    </label>
                    <select
                      value={timeFormat}
                      onChange={(e) => setTimeFormat(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="13:00">13:00</option>
                      <option value="1:00 PM">1:00 PM</option>
                    </select>
                  </div>

                  {/* Date format */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Date format
                    </label>
                    <select
                      value={dateFormat}
                      onChange={(e) => setDateFormat(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                      <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Week start */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Week start
                    </label>
                    <select
                      value={weekStart}
                      onChange={(e) => setWeekStart(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <span className="text-[10px] text-neutral-400">
                      Begin your week on this day in Upcoming and calendar
                      views.
                    </span>
                  </div>

                  {/* Next week */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Next week
                    </label>
                    <select
                      value={nextWeek}
                      onChange={(e) => setNextWeek(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                    </select>
                    <span className="text-[10px] text-neutral-400">
                      Postpone tasks to this day when using &ldquo;Next
                      week&rdquo;.
                    </span>
                  </div>

                  {/* Weekend */}
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    <label className="text-xs font-bold text-neutral-600">
                      Weekend
                    </label>
                    <select
                      value={weekend}
                      onChange={(e) => setWeekend(e.target.value)}
                      className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                    >
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                    <span className="text-[10px] text-neutral-400">
                      Postpone tasks to this day when using
                      &ldquo;Weekend&rdquo;.
                    </span>
                  </div>

                  <span className="block text-[10px] text-neutral-400">
                    Date &amp; time settings do not affect how Karma is
                    calculated. To set your days off for Karma, head to{" "}
                    <button
                      type="button"
                      onClick={() => setActiveTab("productivity")}
                      className="text-brand hover:underline font-semibold"
                    >
                      Productivity settings
                    </button>
                    .
                  </span>

                  {/* Smart date recognition */}
                  <div className="flex items-start justify-between gap-4 py-3 border-t max-w-sm">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-[#202020]">
                        Smart date recognition
                      </span>
                      <span className="block text-[10px] text-neutral-400">
                        Automatically recognize dates when typing a task&apos;s
                        name.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSmartDateRec(!smartDateRec)}
                      className={cn(
                        "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition",
                        smartDateRec ? "bg-brand" : "bg-neutral-300",
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full bg-white shadow transition-transform",
                          smartDateRec && "translate-x-4",
                        )}
                      />
                    </button>
                  </div>

                  {/* Sound effects */}
                  <div className="pt-2">
                    <h4 className="text-sm font-bold text-[#202020] border-b pb-1">
                      Sound effects
                    </h4>
                  </div>

                  <div className="space-y-2 max-w-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                      <span>Desktop and web</span>
                      <button
                        type="button"
                        onClick={() => setSoundDesktop(!soundDesktop)}
                        className={cn(
                          "flex h-5 w-9 items-center rounded-full px-0.5 transition",
                          soundDesktop ? "bg-brand" : "bg-neutral-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow transition-transform",
                            soundDesktop && "translate-x-4",
                          )}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                      <span>Mobile</span>
                      <button
                        type="button"
                        onClick={() => setSoundMobile(!soundMobile)}
                        className={cn(
                          "flex h-5 w-9 items-center rounded-full px-0.5 transition",
                          soundMobile ? "bg-brand" : "bg-neutral-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow transition-transform",
                            soundMobile && "translate-x-4",
                          )}
                        />
                      </button>
                    </div>
                    <span className="block text-[10px] text-neutral-400">
                      Play sounds when you complete tasks or use Ramble.
                    </span>
                  </div>

                  {/* Advanced settings */}
                  <div className="pt-4">
                    <h4 className="text-sm font-bold text-[#202020] border-b pb-1">
                      Advanced
                    </h4>
                  </div>

                  <div className="space-y-4 max-w-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-[#202020]">
                          Reset sub-tasks
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          Reset sub-tasks when you complete a recurring task.{" "}
                          <span className="text-brand hover:underline cursor-pointer">
                            Learn more
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResetSubtasks(!resetSubtasks)}
                        className={cn(
                          "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition",
                          resetSubtasks ? "bg-brand" : "bg-neutral-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow transition-transform",
                            resetSubtasks && "translate-x-4",
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-[#202020]">
                          Auto accept project invites
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          Automatically accept project invites from known
                          collaborators.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAutoAcceptInvites(!autoAcceptInvites)}
                        className={cn(
                          "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition",
                          autoAcceptInvites ? "bg-brand" : "bg-neutral-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow transition-transform",
                            autoAcceptInvites && "translate-x-4",
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#202020]">
                          Email Assist
                          <span className="rounded bg-brand-tint px-1 py-0.5 text-[8px] font-bold text-brand uppercase">
                            BETA
                          </span>
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          Automatically add key details to tasks created from
                          emails.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailAssist(!emailAssist)}
                        className={cn(
                          "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition",
                          emailAssist ? "bg-brand" : "bg-neutral-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow transition-transform",
                            emailAssist && "translate-x-4",
                          )}
                        />
                      </button>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-0.5">
                        <span className="block text-xs font-bold text-[#202020]">
                          Experimental features
                        </span>
                        <span className="block text-[10px] text-neutral-400">
                          Preview early versions of new features before anyone
                          else.{" "}
                          <span className="text-brand hover:underline cursor-pointer">
                            Learn more
                          </span>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setExperimentalFeatures(!experimentalFeatures)
                        }
                        className={cn(
                          "flex h-5 w-9 shrink-0 items-center rounded-full px-0.5 transition",
                          experimentalFeatures ? "bg-brand" : "bg-neutral-300",
                        )}
                      >
                        <span
                          className={cn(
                            "h-4 w-4 rounded-full bg-white shadow transition-transform",
                            experimentalFeatures && "translate-x-4",
                          )}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 text-xs">
                    Do you have more feedback?{" "}
                    <button
                      type="button"
                      className="text-brand hover:underline font-semibold"
                    >
                      Let&apos;s talk
                    </button>
                    .
                  </div>

                  {/* Clear local data */}
                  <div className="pt-4 border-t max-w-sm space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-[#202020]">
                        Clear local data
                      </h4>
                      <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                        Reloads your latest data from the server while
                        preserving local preferences like your theme and display
                        settings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage("Data reloaded successfully");
                        setTimeout(() => setToastMessage(null), 1500);
                      }}
                      className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      Reload
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "account" && twoFAStage === "idle" && (
              <div className="space-y-6 animate-fade-up text-[#202020]">
                <div>
                  <h3 className="text-lg font-bold text-[#202020]">Account</h3>
                </div>

                <div className="space-y-5">
                  {/* Plan */}
                  <div className="flex items-center justify-between gap-4 max-w-xl">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-neutral-600">
                        Plan
                      </span>
                      <span className="block text-sm font-extrabold text-[#202020]">
                        Beginner
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("subscription")}
                      className="rounded-lg border border-neutral-300 px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                    >
                      Manage plan
                    </button>
                  </div>

                  {/* Photo */}
                  <div className="space-y-2 border-t pt-4">
                    <span className="block text-xs font-bold text-neutral-600">
                      Photo
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d6409f] text-lg font-bold text-white shadow-sm">
                        T
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setToastMessage("Avatar image upload mock");
                            setTimeout(() => setToastMessage(null), 1500);
                          }}
                          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                        >
                          Change photo
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setToastMessage("Avatar image removed");
                            setTimeout(() => setToastMessage(null), 1500);
                          }}
                          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                        >
                          Remove photo
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-400">
                      Pick a photo up to 4MB. Your avatar photo will be public.
                    </p>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col gap-1.5 max-w-sm border-t pt-4">
                    <label className="text-xs font-bold text-neutral-600">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand font-medium"
                    />
                    <span className="text-[10px] text-neutral-400 self-end">
                      12/255
                    </span>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5 max-w-sm border-t pt-4">
                    <label className="text-xs font-bold text-neutral-600">
                      Email
                    </label>
                    <p className="text-sm font-semibold text-[#202020]">
                      {email}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const newMail = prompt("Enter new email:", email);
                        if (newMail) setEmail(newMail);
                      }}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition w-32 mt-1.5"
                    >
                      Change email
                    </button>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5 max-w-sm border-t pt-4">
                    <label className="text-xs font-bold text-neutral-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage("Password change flow");
                        setTimeout(() => setToastMessage(null), 1500);
                      }}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition w-32"
                    >
                      Add password
                    </button>
                  </div>

                  {/* Two-factor authentication */}
                  <div className="border-t pt-4 max-w-xl">
                    <h4 className="text-xs font-bold text-neutral-600">
                      Two-factor authentication
                    </h4>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={twoFAEnabled}
                      onClick={() => {
                        if (twoFAEnabled) {
                          setTwoFAEnabled(false);
                          setToastMessage("Two-factor authentication disabled");
                          setTimeout(() => setToastMessage(null), 1800);
                        } else {
                          setTwoFACode("");
                          setTwoFAStage("enable");
                        }
                      }}
                      className={cn(
                        "mt-2 flex h-5 w-9 items-center rounded-full px-0.5 transition",
                        twoFAEnabled ? "bg-brand" : "bg-neutral-300",
                      )}
                    >
                      <span
                        className={cn(
                          "h-4 w-4 rounded-full bg-white shadow transition-transform",
                          twoFAEnabled && "translate-x-4",
                        )}
                      />
                    </button>
                    <p className="mt-1.5 text-[10px] text-neutral-400">
                      {twoFAEnabled
                        ? "2FA is enabled on your Todoist account."
                        : "2FA is disabled on your Todoist account."}
                    </p>
                  </div>

                  {/* Connected accounts */}
                  <div className="border-t pt-4 max-w-xl space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-600">
                        Connected accounts
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Log in to Todoist with your Google, Facebook, or Apple
                        account.
                      </p>
                    </div>
                    <div className="bg-neutral-50 border p-3 rounded-lg text-[11px] leading-relaxed text-neutral-600 space-y-1.5">
                      <p>
                        You can log in to Todoist with your Google account{" "}
                        <strong>{email}</strong>.
                      </p>
                      <p>
                        Your password is not set, so we cannot disconnect you
                        from your Google account. If you want to disconnect,
                        please{" "}
                        <button
                          type="button"
                          className="text-brand hover:underline font-semibold"
                        >
                          set your password
                        </button>{" "}
                        first.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          alert("Facebook account connect link...")
                        }
                        className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                      >
                        <span className="text-[#1877f2] text-sm">📘</span>{" "}
                        Connect with Facebook
                      </button>
                      <button
                        type="button"
                        onClick={() => alert("Apple account connect link...")}
                        className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                      >
                        <span className="text-[#000000] text-sm">🍎</span>{" "}
                        Connect with Apple
                      </button>
                    </div>
                  </div>

                  {/* Delete account */}
                  <div className="border-t pt-4 max-w-xl space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-red-600">
                        Delete account
                      </h4>
                      <p className="text-[10px] text-neutral-400 mt-1">
                        Deleting your account is permanent. You will immediately
                        lose access to all your data.{" "}
                        <span className="text-brand hover:underline cursor-pointer">
                          Here&apos;s how to export your data first
                        </span>
                        .
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const conf = confirm(
                          "Are you sure you want to delete your account permanently?",
                        );
                        if (conf) {
                          alert("Account deleted.");
                          onClose();
                        }
                      }}
                      className="rounded-lg border border-red-200 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enable 2FA multi-step panel */}
            {activeTab === "account" && twoFAStage === "enable" && (
              <div className="animate-fade-up">
                <button
                  type="button"
                  onClick={() => setTwoFAStage("idle")}
                  className="mb-4 flex items-center gap-2 text-base font-bold text-[#202020]"
                >
                  <span className="text-neutral-500">←</span> Enable 2FA
                </button>

                {/* QR code */}
                <QrCode seed={TFA_SECRET} />

                {/* 1. secret */}
                <p className="mt-5 text-sm font-bold text-[#202020]">
                  1. Scan or copy secret code
                </p>
                <input
                  readOnly
                  value={TFA_SECRET}
                  className="mt-2 w-full max-w-md rounded-md border border-neutral-300 px-3 py-2.5 font-mono text-sm text-[#202020] outline-none"
                />
                <button
                  type="button"
                  onClick={() => copyText(TFA_SECRET, "Copied to clipboard")}
                  className="mt-2 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                >
                  Copy secret code
                </button>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600">
                  Scan the QR code above or copy the secret code to your
                  authentication app on your mobile device. Then paste the
                  two-factor verification code generated by your app below.{" "}
                  <span className="text-brand">Learn more</span>.
                </p>

                <div className="my-5 h-px bg-neutral-100" />

                {/* 2. verification */}
                <p className="text-sm font-bold text-[#202020]">
                  2. Enter verification code
                </p>
                <input
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="mt-2 w-full max-w-md rounded-md border border-neutral-300 px-3 py-2.5 text-sm tracking-widest text-[#202020] outline-none focus:border-brand"
                />
                {twoFAVerified && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-green-600">
                    <CheckCircleMini /> Verification completed
                  </p>
                )}

                {/* 3. recovery codes */}
                {twoFAVerified && (
                  <>
                    <div className="my-5 h-px bg-neutral-100" />
                    <p className="text-sm font-bold text-[#202020]">
                      3. Save your recovery codes
                    </p>
                    <p className="mt-1 max-w-xl text-sm leading-relaxed text-neutral-600">
                      Save the codes below in a secure place. If you ever get
                      locked out of your account, you&apos;ll need them to
                      recover access to it.
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        copyText(TFA_RECOVERY.join("\n"), "Copied to clipboard")
                      }
                      className="mt-3 rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                    >
                      Copy all codes
                    </button>
                    <div className="mt-3 max-w-2xl divide-y divide-neutral-100">
                      {TFA_RECOVERY.map((code) => (
                        <div
                          key={code}
                          className="flex items-center justify-between py-2.5"
                        >
                          <span className="font-mono text-sm text-[#202020]">
                            {code}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              copyText(code, "Copied to clipboard")
                            }
                            className="text-sm font-medium text-brand hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* footer */}
                <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setTwoFAStage("idle")}
                    className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!twoFAVerified}
                    onClick={() => {
                      setTwoFAEnabled(true);
                      setTwoFAStage("idle");
                      setToastMessage("Two-factor authentication enabled");
                      setTimeout(() => setToastMessage(null), 1800);
                    }}
                    className={cn(
                      "rounded-md px-4 py-2 text-sm font-semibold text-white transition",
                      twoFAVerified
                        ? "bg-brand hover:bg-brand-dark"
                        : "cursor-not-allowed bg-brand/50",
                    )}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {(activeTab === "themes" || activeTab === "theme") && (
              <div className="animate-fade-up">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Personalize your tasks with colors to match your style, mood,
                  and personality.{" "}
                  <span className="text-brand">Learn more</span>.
                </p>

                {/* Sync theme */}
                <div className="mt-4 flex items-center gap-3">
                  <ToggleSwitch
                    checked={syncTheme}
                    onChange={() => setSyncTheme((v) => !v)}
                  />
                  <span className="text-sm font-bold text-[#202020]">
                    Sync theme
                  </span>
                </div>

                {/* Auto Dark Mode */}
                <div className="mt-4 flex items-center gap-3">
                  <ToggleSwitch
                    checked={autoDark}
                    onChange={() => setAutoDark((v) => !v)}
                  />
                  <span className="text-sm font-bold text-[#202020]">
                    Auto Dark Mode
                  </span>
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Automatically switch between light and dark themes when your
                  system does.
                </p>

                {/* Your themes */}
                <h4 className="mt-5 text-base font-bold text-[#202020]">
                  Your themes
                </h4>
                <div className="mt-3 grid grid-cols-2 gap-4 lg:grid-cols-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => previewTheme(t.id)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition hover:shadow-sm",
                        selectedTheme === t.id
                          ? "border-2 border-brand"
                          : "border-neutral-200",
                        t.dark && "bg-[#1f1f1f]",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm font-bold"
                          style={{ color: t.dark ? "#f5f5f5" : t.accent }}
                        >
                          {t.name}
                        </span>
                        {selectedTheme === t.id && (
                          <span style={{ color: t.accent }}>
                            <CheckMark />
                          </span>
                        )}
                      </div>
                      <ThemePreview accent={t.accent} dark={t.dark} />
                    </button>
                  ))}
                </div>

                {/* Update / Cancel footer */}
                {themeDirty && (
                  <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
                    <button
                      onClick={() => setDiscardOpen(true)}
                      className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={commitTheme}
                      className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="animate-fade-up text-[#202020]">
                {/* sub-tabs */}
                <div className="mb-5 inline-flex items-center gap-1 rounded-lg bg-neutral-100 p-0.5 text-sm font-semibold">
                  {(["installed", "browse", "developer"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setIntegrationsView(v);
                        setSelectedIntegrationId(null);
                      }}
                      className={cn(
                        "rounded-md px-3 py-1 capitalize transition",
                        integrationsView === v
                          ? "bg-white text-[#202020] shadow-sm"
                          : "text-neutral-500 hover:text-neutral-700",
                      )}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                {/* Installed */}
                {integrationsView === "installed" && (
                  <div>
                    <div className="flex flex-col items-center py-10 text-center">
                      <span className="text-4xl">⚗️</span>
                      <p className="mt-4 text-sm text-neutral-600">
                        Integrations you&apos;ve installed will show up here
                      </p>
                      <button
                        onClick={() => setIntegrationsView("browse")}
                        className="mt-4 rounded-md bg-amber-400 px-3.5 py-2 text-sm font-bold text-[#202020] hover:bg-amber-300"
                      >
                        Add integrations
                      </button>
                    </div>
                    <div className="mt-2 rounded-xl border border-neutral-200 p-4">
                      <p className="text-sm font-bold text-[#202020]">
                        Calendar Subscription URL (iCal)
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        See your scheduled tasks as read-only events by
                        subscribing from the URL. Updates will sync
                        periodically.{" "}
                        <span className="text-brand">Learn more</span>
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          readOnly
                          value="https://ext.todoist.com/export/ical/todoist?user_id=57210148&ical_token=6ab906b6b12b0f99a69b0d…"
                          className="flex-1 truncate rounded-md border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-600 outline-none"
                        />
                        <button
                          onClick={() =>
                            copyText(
                              "https://ext.todoist.com/export/ical/todoist",
                              "Link copied!",
                            )
                          }
                          className="rounded-md bg-amber-400 px-3 py-2 text-sm font-bold text-[#202020] hover:bg-amber-300"
                        >
                          Copy link
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Developer */}
                {integrationsView === "developer" && (
                  <div>
                    <h4 className="text-base font-bold text-[#202020]">
                      Explore the API
                    </h4>
                    <p className="mt-1 text-sm text-neutral-500">
                      Use the Todoist API to interact with your data or build
                      integrations for Todoist.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200">
                        API documentation
                      </button>
                      <button className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200">
                        App management
                      </button>
                    </div>
                    <h4 className="mt-6 text-base font-bold text-[#202020]">
                      API token
                    </h4>
                    <p className="mt-1 text-sm text-neutral-500">
                      Your API token provides full access to view and modify
                      your Todoist data. Please treat this like a password and
                      take care when sharing it.
                    </p>
                    <input
                      readOnly
                      type="password"
                      value="0123456789abcdef0123456789abcdef01234567"
                      className="mt-3 w-full max-w-md rounded-md border border-neutral-300 px-3 py-2.5 text-sm text-neutral-600 outline-none"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          copyText("0123456789abcdef", "Copied to clipboard")
                        }
                        className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                      >
                        Copy API token
                      </button>
                      <button className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                        Issue a new API token
                      </button>
                    </div>
                  </div>
                )}

                {/* Browse (existing) */}
                {integrationsView === "browse" && (
                  <div className="space-y-5">
                    {selectedIntegrationId ? (
                      // INTEGRATION DETAIL VIEW (Screens 6 & 9)
                      (() => {
                        const integration = ALL_INTEGRATIONS.find(
                          (item) => item.id === selectedIntegrationId,
                        );
                        if (!integration) return null;
                        const isInstalled =
                          !!installedIntegrations[integration.id];

                        return (
                          <div className="space-y-6">
                            <button
                              onClick={() => setSelectedIntegrationId(null)}
                              className="flex items-center gap-1 text-xs font-bold text-neutral-500 hover:text-neutral-700 transition"
                            >
                              <span>← Browse integrations</span>
                            </button>

                            <div className="flex items-start gap-4 justify-between">
                              <div className="flex items-start gap-4">
                                <span
                                  className={cn(
                                    "flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-sm border border-neutral-100",
                                    integration.iconBg,
                                    integration.iconColor,
                                  )}
                                >
                                  {integration.emoji}
                                </span>
                                <div>
                                  <h2 className="text-xl font-bold text-[#202020]">
                                    {integration.name}
                                  </h2>
                                  <p className="text-xs text-neutral-400 mt-0.5">
                                    by {integration.creator}
                                  </p>
                                  <span className="inline-block mt-2 rounded bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                                    {integration.category}
                                  </span>
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setInstalledIntegrations((prev) => ({
                                    ...prev,
                                    [integration.id]: !isInstalled,
                                  }));
                                }}
                                className={cn(
                                  "rounded-lg px-4 py-2 text-xs font-bold transition shadow-xs",
                                  isInstalled
                                    ? "bg-green-50 text-green-700 border border-green-200"
                                    : "bg-brand text-white hover:bg-brand-dark",
                                )}
                              >
                                {isInstalled ? "Added ✓" : "Add to Todoist"}
                              </button>
                            </div>

                            <div className="h-px bg-neutral-100" />

                            <div className="space-y-4 max-w-xl">
                              <h3 className="text-sm font-bold text-[#202020]">
                                About this integration
                              </h3>
                              <p className="text-xs text-neutral-600 leading-relaxed">
                                {integration.longDescription}
                              </p>
                            </div>

                            <div className="h-px bg-neutral-100" />

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="block font-bold text-neutral-400 uppercase text-[9px] tracking-wider">
                                  Developer
                                </span>
                                <span className="block text-[#202020] mt-0.5">
                                  {integration.creator}
                                </span>
                              </div>
                              <div>
                                <span className="block font-bold text-neutral-400 uppercase text-[9px] tracking-wider">
                                  Website
                                </span>
                                <a
                                  href="#"
                                  className="block text-brand hover:underline mt-0.5"
                                >
                                  Visit developer website
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // BROWSE LIST (Screens 1, 2, 7, 8)
                      <div className="space-y-5">
                        <div>
                          <h3 className="text-xl font-bold text-[#202020]">
                            Integrations
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1">
                            Connect your favorite apps and customize Todoist
                            features.
                          </p>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Search integrations..."
                            value={integrationQuery}
                            onChange={(e) =>
                              setIntegrationQuery(e.target.value)
                            }
                            className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs text-[#202020] outline-none focus:border-brand"
                          />
                        </div>

                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {[
                            "All",
                            "Productivity",
                            "Calendar",
                            "Developer",
                            "Communication",
                          ].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setIntegrationCat(cat)}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold border transition",
                                integrationCat === cat
                                  ? "bg-[#202020] text-white border-[#202020]"
                                  : "bg-white text-neutral-500 border-neutral-200 hover:text-[#202020]",
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Grid List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {ALL_INTEGRATIONS.filter((item) => {
                            const matchCat =
                              integrationCat === "All" ||
                              item.category === integrationCat;
                            const matchQuery =
                              item.name
                                .toLowerCase()
                                .includes(integrationQuery.toLowerCase()) ||
                              item.description
                                .toLowerCase()
                                .includes(integrationQuery.toLowerCase());
                            return matchCat && matchQuery;
                          }).length === 0 ? (
                            <p className="text-xs text-neutral-400 py-6 text-center col-span-2">
                              No integrations match your search.
                            </p>
                          ) : (
                            ALL_INTEGRATIONS.filter((item) => {
                              const matchCat =
                                integrationCat === "All" ||
                                item.category === integrationCat;
                              const matchQuery =
                                item.name
                                  .toLowerCase()
                                  .includes(integrationQuery.toLowerCase()) ||
                                item.description
                                  .toLowerCase()
                                  .includes(integrationQuery.toLowerCase());
                              return matchCat && matchQuery;
                            }).map((item) => (
                              <div
                                key={item.id}
                                onClick={() =>
                                  setSelectedIntegrationId(item.id)
                                }
                                className="flex items-start gap-3.5 rounded-xl border border-neutral-200 bg-white p-4 text-left hover:shadow-md transition cursor-pointer hover:border-neutral-300 animate-fade-up"
                              >
                                <span
                                  className={cn(
                                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-xs border border-neutral-100",
                                    item.iconBg,
                                    item.iconColor,
                                  )}
                                >
                                  {item.emoji}
                                </span>
                                <div className="min-w-0">
                                  <span className="block text-sm font-bold text-[#202020] truncate">
                                    {item.name}
                                  </span>
                                  <span className="block text-[11px] text-neutral-500 mt-1 leading-normal pr-1">
                                    {item.description}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="animate-fade-up text-[#202020]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#202020]">Plan</p>
                    <p className="mt-1 text-lg font-bold text-[#202020]">
                      Beginner
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      You are on{" "}
                      <span className="text-brand">the Beginner plan</span> with
                      all the basics you need to start organizing your life.
                    </p>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#202020]">
                    <InfoMini /> Billing FAQ
                  </button>
                </div>

                {/* Unlock card */}
                <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-amber-500">
                        <SparkIcon />
                      </span>
                      <h4 className="text-base font-bold text-[#202020]">
                        Unlock the full power of Todoist
                      </h4>
                    </div>
                    <button
                      onClick={() => setToastMessage("Starting Pro trial…")}
                      className="rounded-md bg-amber-400 px-3.5 py-2 text-sm font-bold text-[#202020] hover:bg-amber-300 transition"
                    >
                      Try Pro for free
                    </button>
                  </div>
                  <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                    {[
                      ["⏳", "Task Durations", "Better time-blocking."],
                      [
                        "🎙️",
                        "Unlimited Ramble",
                        "Turn your thoughts into tasks with voice input.",
                      ],
                      ["🎯", "Deadlines", "Distinguish critical dates."],
                      [
                        "📧",
                        "Email Assist",
                        "Turn forwarded emails into organized tasks.",
                      ],
                      [
                        "🐤",
                        "Task Assist",
                        "Get work unstuck and move forward faster.",
                      ],
                      ["📅", "Calendar layout", "Time-block like a pro."],
                    ].map(([emoji, title, desc]) => (
                      <div key={title} className="flex items-start gap-3">
                        <span className="text-xl">{emoji}</span>
                        <div>
                          <p className="text-sm font-bold text-[#202020]">
                            {title}
                          </p>
                          <p className="text-sm text-neutral-500">{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teamwork */}
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-neutral-100 pt-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🏢</span>
                    <div>
                      <h4 className="text-base font-bold text-[#202020]">
                        Organize your teamwork, too!
                      </h4>
                      <p className="mt-0.5 max-w-md text-sm text-neutral-500">
                        Add a team to Todoist and get a shared workspace to
                        collaborate with your teammates - alongside but separate
                        from your personal tasks and projects.
                      </p>
                    </div>
                  </div>
                  <button className="shrink-0 rounded-md bg-neutral-100 px-3.5 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200">
                    Add a team
                  </button>
                </div>
              </div>
            )}

            {activeTab === "sidebar" && (
              <div className="animate-fade-up text-[#202020]">
                <h4 className="text-base font-bold text-[#202020]">
                  Show in sidebar
                </h4>
                <div className="mt-3 max-w-md space-y-3">
                  {(
                    [
                      ["Inbox", <InboxGlyph key="i" />],
                      ["Today", <TodayGlyph key="t" />],
                      ["Upcoming", <UpcomingGlyph key="u" />],
                      ["Filters & Labels", <FiltersGlyph key="f" />],
                      ["Reporting", <ReportingGlyph key="r" />],
                    ] as const
                  ).map(([label, icon]) => (
                    <label
                      key={label}
                      className="flex cursor-pointer items-center gap-3"
                    >
                      <Checkbox
                        checked={sidebarShow[label]}
                        onChange={() =>
                          setSidebarShow((s) => ({ ...s, [label]: !s[label] }))
                        }
                      />
                      <span className="text-neutral-500">{icon}</span>
                      <span className="text-sm text-[#202020]">{label}</span>
                    </label>
                  ))}
                </div>

                <h4 className="mt-7 text-base font-bold text-[#202020]">
                  Show task count
                </h4>
                <div className="mt-2 flex items-center gap-2.5">
                  <ToggleSwitch
                    checked={showTaskCount}
                    onChange={() => setShowTaskCount((v) => !v)}
                  />
                  <span className="text-sm text-neutral-500">
                    {showTaskCount ? "On" : "Off"}
                  </span>
                </div>

                <p className="mt-4 text-xs text-neutral-400">Example:</p>
                <div className="mt-2 max-w-xs rounded-lg bg-neutral-50 p-2">
                  {[
                    ["Personal", 2],
                    ["Family", 8],
                    ["Health", 1],
                  ].map(([n, c]) => (
                    <div
                      key={n as string}
                      className="flex items-center justify-between rounded px-2 py-1.5 text-sm"
                    >
                      <span className="flex items-center gap-2 text-[#202020]">
                        <span className="font-bold text-neutral-400">#</span>
                        {n}
                      </span>
                      {showTaskCount && (
                        <span className="text-xs text-neutral-400">{c}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "quick-add" && (
              <div className="animate-fade-up text-[#202020]">
                <p className="text-sm leading-relaxed text-neutral-600">
                  To reorder your task actions, use drag and drop to move
                  actions up or down the list.{" "}
                  <span className="text-brand">Learn more</span>
                </p>

                <h4 className="mt-5 text-sm font-bold text-[#202020]">
                  Show task actions
                </h4>
                <div className="mt-2 max-w-md overflow-hidden rounded-lg border border-neutral-200">
                  {quickActions.map((a, i) => (
                    <div
                      key={a}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-sm",
                        i > 0 && "border-t border-neutral-100",
                      )}
                    >
                      <button
                        onClick={() =>
                          setQuickActions((list) => list.filter((x) => x !== a))
                        }
                        aria-label={`Remove ${a}`}
                        className="text-red-500"
                      >
                        <MinusCircle />
                      </button>
                      <span className="text-neutral-500">
                        <QuickActionIcon name={a} />
                      </span>
                      <span className="text-[#202020]">{a}</span>
                    </div>
                  ))}
                </div>

                <h4 className="mt-5 text-sm font-bold text-[#202020]">
                  More actions
                </h4>
                <div className="mt-2 max-w-md overflow-hidden rounded-lg border border-neutral-200">
                  {["Labels", "Deadline", "Location"]
                    .filter((a) => !quickActions.includes(a))
                    .map((a, i) => (
                      <div
                        key={a}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 text-sm",
                          i > 0 && "border-t border-neutral-100",
                        )}
                      >
                        <button
                          onClick={() =>
                            setQuickActions((list) => [...list, a])
                          }
                          aria-label={`Add ${a}`}
                          className="text-green-600"
                        >
                          <PlusCircle />
                        </button>
                        <span className="text-neutral-500">
                          <QuickActionIcon name={a} />
                        </span>
                        <span className="text-[#202020]">{a}</span>
                      </div>
                    ))}
                </div>

                <h4 className="mt-6 text-sm font-bold text-[#202020]">
                  Show action labels
                </h4>
                <div className="mt-2 flex items-center gap-2.5">
                  <ToggleSwitch
                    checked={showActionLabels}
                    onChange={() => setShowActionLabels((v) => !v)}
                  />
                  <span className="text-sm text-neutral-500">
                    {showActionLabels ? "On" : "Off"}
                  </span>
                </div>

                <p className="mt-4 text-xs text-neutral-400">Example:</p>
                <div className="mt-2 flex max-w-xl flex-wrap items-center gap-2 rounded-lg border border-neutral-200 p-3">
                  {quickActions.slice(0, 5).map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600"
                    >
                      <QuickActionIcon name={a} />
                      {showActionLabels && a}
                    </span>
                  ))}
                  <span className="inline-flex items-center rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-500">
                    ⋯
                  </span>
                </div>
              </div>
            )}

            {activeTab === "productivity" && (
              <div className="animate-fade-up text-[#202020]">
                <p className="text-sm leading-relaxed text-neutral-600">
                  Celebrating your progress goes a long way toward achieving
                  long-term success. And setting goals can help you stay on
                  track! <span className="text-brand">Learn more</span>
                </p>

                {/* Karma */}
                <h4 className="mt-5 text-sm font-bold text-[#202020]">
                  Todoist Karma
                </h4>
                <div className="mt-2 flex items-center gap-2.5">
                  <ToggleSwitch
                    checked={karmaOn}
                    onChange={() => setKarmaOn((v) => !v)}
                  />
                  <span className="text-sm text-neutral-500">
                    {karmaOn ? "On" : "Off"}
                  </span>
                </div>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
                  Stay motivated and accountable with Todoist Karma. Achieve new
                  levels by earning points for completing tasks, reaching your
                  daily and weekly goals, and using advanced features like
                  recurring due dates.{" "}
                  <span className="text-brand">Learn more</span>
                </p>

                {/* Goals */}
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <h4 className="text-base font-bold text-[#202020]">Goals</h4>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    Small steps add up to big achievements. Set task goals to
                    keep your momentum.
                  </p>
                  <label className="mt-4 block text-sm font-bold text-[#202020]">
                    Daily tasks
                  </label>
                  <input
                    type="number"
                    value={state.productivityGoalDaily ?? 5}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_GOALS",
                        daily: Number(e.target.value),
                        weekly: state.productivityGoalWeekly ?? 30,
                      })
                    }
                    className="mt-2 w-full max-w-xs rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-[#202020] outline-none focus:border-brand"
                  />
                  <label className="mt-4 block text-sm font-bold text-[#202020]">
                    Weekly tasks
                  </label>
                  <input
                    type="number"
                    value={state.productivityGoalWeekly ?? 30}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_GOALS",
                        daily: state.productivityGoalDaily ?? 5,
                        weekly: Number(e.target.value),
                      })
                    }
                    className="mt-2 w-full max-w-xs rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-[#202020] outline-none focus:border-brand"
                  />

                  <p className="mt-4 text-sm font-bold text-[#202020]">
                    Goal celebrations
                  </p>
                  <div className="mt-2 flex items-center gap-2.5">
                    <ToggleSwitch
                      checked={goalCelebrations}
                      onChange={() => setGoalCelebrations((v) => !v)}
                    />
                    <span className="text-sm text-neutral-500">
                      {goalCelebrations ? "On" : "Off"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Celebrate reaching daily and weekly task goals.
                  </p>
                </div>

                {/* Days off */}
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <h4 className="text-base font-bold text-[#202020]">
                    Days off
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-4">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (d) => (
                        <label
                          key={d}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Checkbox
                            checked={daysOff[d]}
                            onChange={() =>
                              setDaysOff((s) => ({ ...s, [d]: !s[d] }))
                            }
                          />
                          <span className="text-sm text-[#202020]">{d}</span>
                        </label>
                      ),
                    )}
                  </div>
                  <p className="mt-3 text-sm text-neutral-500">
                    When you take a break, your Karma and streaks can take a
                    break too.
                  </p>
                </div>

                {/* Vacation mode */}
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <h4 className="text-base font-bold text-[#202020]">
                    Vacation mode
                  </h4>
                  <div className="mt-2 flex items-center gap-2.5">
                    <ToggleSwitch
                      checked={state.vacationMode ?? false}
                      onChange={() =>
                        dispatch({
                          type: "TOGGLE_VACATION_MODE",
                          val: !(state.vacationMode ?? false),
                        })
                      }
                    />
                    <span className="text-sm text-neutral-500">
                      {state.vacationMode ? "On" : "Off"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-500">
                    Time off means your streaks and Karma stay, even if you
                    don&apos;t hit your task goals.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reminders" && (
              <div className="animate-fade-up text-[#202020]">
                {/* upgrade banner */}
                <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4">
                  <div className="flex items-start gap-2.5">
                    <span className="text-amber-500">
                      <SparkIcon />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#202020]">
                        Give your memory a rest
                      </p>
                      <p className="mt-0.5 max-w-md text-sm text-neutral-500">
                        Free accounts only get reminders at the time of a task.
                        Upgrade to add multiple reminders, trigger them at
                        specific times or locations, and more.
                      </p>
                    </div>
                  </div>
                  <button className="shrink-0 rounded-md bg-amber-400 px-3.5 py-2 text-sm font-bold text-[#202020] hover:bg-amber-300">
                    Upgrade
                  </button>
                </div>

                <p className="mt-5 text-sm text-neutral-600">
                  The secret to effortlessly remembering everything? Have
                  Todoist remind you.{" "}
                  <span className="text-brand">Learn more</span>
                </p>

                <h4 className="mt-5 text-sm font-bold text-[#202020]">
                  Automatic reminders
                </h4>
                <select
                  value={autoReminder}
                  onChange={(e) => setAutoReminder(e.target.value)}
                  className="mt-2 w-full max-w-md rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-sm text-[#202020] outline-none focus:border-brand"
                >
                  <option>At time of task</option>
                  <option>10 minutes before</option>
                  <option>30 minutes before</option>
                  <option>1 hour before</option>
                  <option>1 day before</option>
                </select>
                <p className="mt-1.5 text-sm text-neutral-500">
                  When enabled, a reminder before the task&apos;s time will be
                  added by default.
                </p>

                <h4 className="mt-6 text-sm font-bold text-[#202020]">
                  How would you like to get reminded?
                </h4>
                <div className="mt-2 max-w-md space-y-3">
                  {[
                    ["Desktop notifications", remDesktop, setRemDesktop],
                    ["Mobile notifications", remMobile, setRemMobile],
                    ["Emails", remEmail, setRemEmail],
                  ].map(([label, val, setter]) => (
                    <div
                      key={label as string}
                      className="flex items-center gap-2.5"
                    >
                      <ToggleSwitch
                        checked={val as boolean}
                        onChange={() =>
                          (setter as (v: boolean) => void)(!(val as boolean))
                        }
                      />
                      <span className="text-sm text-[#202020]">
                        {label as string}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Send test reminder */}
                <div className="mt-6 flex items-start justify-between gap-6 border-t border-neutral-100 pt-5">
                  <div className="max-w-sm">
                    <h4 className="text-sm font-bold text-[#202020]">
                      Send test reminder
                    </h4>
                    <p className="mt-1 text-sm text-neutral-500">
                      Wondering how reminders help you stay productive, or want
                      to check if your device settings are correct? Trigger a
                      test reminder to see it in action. You should receive it
                      within 1 minute.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          setToastMessage("Test reminder sent (web)")
                        }
                        className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                      >
                        Test web
                      </button>
                      <button
                        onClick={() =>
                          setToastMessage("Test reminder sent (mobile)")
                        }
                        className="rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
                      >
                        Test mobile
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <p className="text-sm text-neutral-500">Preview</p>
                    <div className="mt-2 flex w-64 items-center gap-3 rounded-lg border border-neutral-200 p-3 shadow-sm">
                      <span className="text-lg">📌</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#202020]">
                          Get groceries
                        </p>
                        <p className="text-xs text-neutral-400">Today 09:00</p>
                      </div>
                      <span className="text-xs text-neutral-400">now</span>
                    </div>
                  </div>
                </div>

                {/* Your devices */}
                <div className="mt-6 border-t border-neutral-100 pt-5">
                  <h4 className="text-sm font-bold text-[#202020]">
                    Your devices
                  </h4>
                  <p className="mt-1 text-sm text-neutral-500">
                    The following devices are connected to your Todoist.
                  </p>
                  <div className="mt-3 max-w-md divide-y divide-neutral-100">
                    {["Apple Watch", "iPhone"].map((d) => (
                      <div
                        key={d}
                        className="flex items-center justify-between py-3 text-sm"
                      >
                        <span className="flex items-center gap-2 text-[#202020]">
                          <span></span> {d}
                        </span>
                        <button className="text-neutral-400 hover:text-neutral-600">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "backups" && (
              <div className="space-y-4 animate-fade-up">
                <div>
                  <h3 className="text-lg font-bold text-[#202020]">Backups</h3>
                  <p className="text-xs text-neutral-500">
                    Download database copies of your workspace records.
                  </p>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="rounded-lg border border-neutral-100 p-3.5 flex justify-between items-center text-xs bg-neutral-50/50">
                    <div>
                      <span className="block font-bold text-[#202020]">
                        Backup_2026-06-28.zip
                      </span>
                      <span className="text-neutral-400">
                        Automatic backup • 15KB
                      </span>
                    </div>
                    <button
                      onClick={() => alert("Downloading backup...")}
                      className="text-brand font-bold hover:underline"
                    >
                      Download
                    </button>
                  </div>
                  <button
                    onClick={() => alert("Creating database backup...")}
                    className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition shadow-sm w-full"
                  >
                    Create backup copy now
                  </button>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-4 animate-fade-up">
                <div>
                  <h3 className="text-lg font-bold text-[#202020]">Billing</h3>
                  <p className="text-xs text-neutral-500">
                    Configure team invoices and view payment receipts.
                  </p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-neutral-500">
                        Current Payment Method
                      </span>
                      <span className="font-bold text-neutral-800">
                        Visa ending in 4242
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-200/60 pt-2">
                      <span className="font-semibold text-neutral-500">
                        Subscription Amount
                      </span>
                      <span className="font-bold text-neutral-800">
                        €6.00 / month
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Manage credit card details portal.")}
                    className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition shadow-sm w-full"
                  >
                    Update payment card details
                  </button>
                </div>
              </div>
            )}
            {activeTab === "calendars" && (
              <div className="animate-fade-up text-[#202020]">
                <p className="text-sm text-neutral-600">
                  Show events in Todoist and sync scheduled tasks to your
                  calendar.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      setToastMessage("Connecting Google Calendar…")
                    }
                    className="flex items-center gap-2.5 rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-[#202020] hover:bg-neutral-50"
                  >
                    <span className="text-lg">📅</span> Connect Google Calendar
                  </button>
                  <button
                    onClick={() =>
                      setToastMessage("Connecting Outlook Calendar…")
                    }
                    className="flex items-center gap-2.5 rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-[#202020] hover:bg-neutral-50"
                  >
                    <span className="text-lg">🗓️</span> Connect Outlook Calendar
                  </button>
                </div>

                <h4 className="mt-6 text-base font-bold text-[#202020]">
                  What you can do
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <div className="flex h-40 items-center justify-center bg-[#fdeee9] text-4xl">
                      🗓️
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-[#202020]">
                        See events in Todoist
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Events are shown in Today and Upcoming.{" "}
                        <span className="text-brand">Learn more</span>
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <div className="flex h-40 items-center justify-center bg-[#eaf3ec] text-4xl">
                      📆
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-bold text-[#202020]">
                        Sync tasks to calendar
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Scheduled tasks assigned to you will be synced to a new
                        “Todoist” calendar in your connected account.{" "}
                        <span className="text-brand">Learn more</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "notifications" && (
              <div className="animate-fade-up text-[#202020]">
                <p className="text-sm text-neutral-600">
                  Customize how you&apos;d like to be notified about updates in
                  Todoist. <span className="text-brand">Learn more</span>
                </p>

                <div className="mt-4 flex items-center gap-2.5">
                  <ToggleSwitch
                    checked={desktopNotif}
                    onChange={() => setDesktopNotif((v) => !v)}
                  />
                  <span className="text-sm text-[#202020]">
                    Desktop and web notifications
                  </span>
                </div>

                {/* Project notifications matrix */}
                <div className="mt-6">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <h4 className="text-base font-bold text-[#202020]">
                      Project notifications
                    </h4>
                    <div className="flex items-center gap-8 pr-1 text-xs font-semibold text-neutral-500">
                      <span className="flex items-center gap-1">📧 Email</span>
                      <span className="flex items-center gap-1">📱 Mobile</span>
                    </div>
                  </div>
                  {NOTIF_ROWS.map((row) => (
                    <div
                      key={row}
                      className="flex items-center justify-between border-b border-neutral-100 py-3"
                    >
                      <span className="text-sm text-[#202020]">{row}</span>
                      <div className="flex items-center gap-10 pr-2">
                        <Checkbox
                          checked={notifMatrix[row].email}
                          onChange={() =>
                            setNotifMatrix((m) => ({
                              ...m,
                              [row]: { ...m[row], email: !m[row].email },
                            }))
                          }
                        />
                        <Checkbox
                          checked={notifMatrix[row].mobile}
                          onChange={() =>
                            setNotifMatrix((m) => ({
                              ...m,
                              [row]: { ...m[row], mobile: !m[row].mobile },
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Account & update emails */}
                <h4 className="mt-7 text-base font-bold text-[#202020]">
                  Account &amp; update emails
                </h4>
                <div className="mt-3 space-y-4">
                  {[
                    [
                      "Daily digest",
                      "Personalized productivity stats plus your tasks for today. Sent every morning.",
                      emailDigest,
                      setEmailDigest,
                      false,
                    ],
                    [
                      "What's new",
                      "Exciting features and updates from the Todoist team. Sent no more than once a month.",
                      whatsNew,
                      setWhatsNew,
                      false,
                    ],
                    [
                      "Tips and tricks",
                      "Get ahead of the game with insider tips and powerful productivity advice.",
                      tipsTricks,
                      setTipsTricks,
                      false,
                    ],
                    [
                      "New login alert",
                      "Get an email notification every time a new device is logged into your account.",
                      loginAlert,
                      setLoginAlert,
                      true,
                    ],
                  ].map(([label, desc, val, setter, rec]) => (
                    <div key={label as string}>
                      <div className="flex items-center gap-2.5">
                        <ToggleSwitch
                          checked={val as boolean}
                          onChange={() =>
                            (setter as (v: boolean) => void)(!(val as boolean))
                          }
                        />
                        <span className="text-sm font-bold text-[#202020]">
                          {label as string}
                        </span>
                        {rec && (
                          <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-bold text-green-700">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                      <p className="mt-1 ml-[3.25rem] text-sm text-neutral-500">
                        {desc as string}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "members" && (
              <div className="space-y-4 animate-fade-up">
                {membersView === "list" ? (
                  <div className="space-y-5">
                    {/* Header */}
                    <div>
                      <h3 className="text-lg font-bold text-[#202020]">
                        Members
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Manage members and invite new ones to your team.
                      </p>
                    </div>

                    {/* Invite Link Section */}
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#202020]">
                          Enable invite link
                        </span>
                        <button
                          onClick={() =>
                            setInviteLinkEnabled(!inviteLinkEnabled)
                          }
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                            inviteLinkEnabled ? "bg-brand" : "bg-neutral-200",
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              inviteLinkEnabled
                                ? "translate-x-4"
                                : "translate-x-0",
                            )}
                          />
                        </button>
                      </div>

                      {inviteLinkEnabled && (
                        <div className="mt-3 space-y-3">
                          <input
                            type="text"
                            readOnly
                            value={`https://app.todoist.com/auth/join?invite_code=${inviteCode}`}
                            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-500 outline-none select-all"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `https://app.todoist.com/auth/join?invite_code=${inviteCode}`,
                                );
                                setToastMessage("Link copied to clipboard");
                                setTimeout(() => setToastMessage(null), 2500);
                              }}
                              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition"
                            >
                              Copy link
                            </button>
                            <button
                              onClick={() => {
                                setInviteCode(
                                  Math.random().toString(36).substring(2, 10) +
                                    Math.random().toString(36).substring(2, 10),
                                );
                                setToastMessage("Invite link reset");
                                setTimeout(() => setToastMessage(null), 2500);
                              }}
                              className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                            >
                              Reset link
                            </button>
                          </div>
                        </div>
                      )}
                      <p className="mt-2 text-[11px] text-neutral-400">
                        Share this link to invite people to your team.
                      </p>
                    </div>

                    {/* Invite Button and Search Row */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => setMembersView("invite")}
                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition"
                      >
                        Invite by email
                      </button>
                      <input
                        type="text"
                        placeholder="Search by name or email"
                        value={memberSearch}
                        onChange={(e) => setMemberSearch(e.target.value)}
                        className="w-48 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs outline-none focus:border-brand"
                      />
                    </div>

                    {/* Pending Invites */}
                    {pendingInvites.filter((p) =>
                      p.email
                        .toLowerCase()
                        .includes(memberSearch.toLowerCase()),
                    ).length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                          Pending
                        </h4>
                        <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                          {pendingInvites
                            .filter((p) =>
                              p.email
                                .toLowerCase()
                                .includes(memberSearch.toLowerCase()),
                            )
                            .map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-2.5"
                              >
                                <div className="min-w-0">
                                  <span className="block text-sm font-bold text-[#202020] truncate">
                                    {p.email}
                                  </span>
                                  <span className="text-xs text-neutral-400">
                                    Pending invite
                                  </span>
                                </div>
                                <select
                                  value={p.role}
                                  onChange={(e) => {
                                    if (
                                      e.target.value === "Revoke" ||
                                      e.target.value === "Remove"
                                    ) {
                                      if (
                                        window.confirm(
                                          "Are you sure you want to remove " +
                                            p.email +
                                            "?",
                                        )
                                      ) {
                                        const next = pendingInvites.filter(
                                          (_, i) => i !== idx,
                                        );
                                        setPendingInvites(next);
                                        setToastMessage("Invitation removed");
                                        setTimeout(
                                          () => setToastMessage(null),
                                          2500,
                                        );
                                      }
                                    } else {
                                      const next = [...pendingInvites];
                                      next[idx].role = e.target.value;
                                      setPendingInvites(next);
                                    }
                                  }}
                                  className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-600 outline-none cursor-pointer"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Admin">Admin</option>
                                  <option value="Member">Member</option>
                                  <option value="Remove">Remove member</option>
                                  <option value="Revoke">Revoke invite</option>
                                </select>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* On This Team */}
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        On this team
                      </h4>
                      <div className="divide-y divide-neutral-100 border-t border-neutral-100">
                        {activeMembers
                          .filter(
                            (m) =>
                              m.name
                                .toLowerCase()
                                .includes(memberSearch.toLowerCase()) ||
                              m.email
                                .toLowerCase()
                                .includes(memberSearch.toLowerCase()),
                          )
                          .map((m, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between py-2.5"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#22c55e] text-sm font-bold text-white shrink-0">
                                  {m.name.charAt(0)}
                                </span>
                                <div className="min-w-0">
                                  <span className="block text-sm font-bold text-[#202020] truncate">
                                    {m.name}
                                  </span>
                                  <span className="text-xs text-neutral-400 block truncate">
                                    {m.email}
                                  </span>
                                </div>
                              </div>
                              <select
                                value={m.role}
                                disabled={m.name.includes("(You)")}
                                onChange={(e) => {
                                  if (e.target.value === "Remove") {
                                    if (
                                      window.confirm(
                                        "Are you sure you want to remove " +
                                          m.name +
                                          "?",
                                      )
                                    ) {
                                      const next = activeMembers.filter(
                                        (_, i) => i !== idx,
                                      );
                                      setActiveMembers(next);
                                      setToastMessage("Member removed");
                                      setTimeout(
                                        () => setToastMessage(null),
                                        2500,
                                      );
                                    }
                                  } else {
                                    const next = [...activeMembers];
                                    next[idx].role = e.target.value;
                                    setActiveMembers(next);
                                  }
                                }}
                                className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-600 outline-none disabled:opacity-50 cursor-pointer"
                              >
                                <option value="Admin">Admin</option>
                                <option value="Member">Member</option>
                                <option value="Remove">Remove member</option>
                              </select>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-up">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMembersView("list")}
                        className="rounded-full p-1.5 hover:bg-neutral-100 text-neutral-500 transition"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M19 12H5M12 19l-7-7 7-7"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <h3 className="text-lg font-bold text-[#202020]">
                        Invite people
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Email tag list */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600">
                          Email addresses
                        </label>
                        <div className="flex flex-wrap gap-2.5 rounded-lg border border-neutral-300 p-2 bg-white min-h-[80px] focus-within:border-brand transition">
                          {inviteEmails.map((email, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded bg-neutral-100 pl-2 pr-1 py-0.5 text-xs text-[#202020]"
                            >
                              {email}
                              <button
                                type="button"
                                onClick={() =>
                                  setInviteEmails(
                                    inviteEmails.filter((_, i) => i !== idx),
                                  )
                                }
                                className="text-neutral-400 hover:text-neutral-600 font-bold ml-0.5"
                              >
                                &times;
                              </button>
                            </span>
                          ))}
                          <input
                            type="text"
                            placeholder={
                              inviteEmails.length === 0
                                ? "e.g., jess@nicelydone.club"
                                : "Add more..."
                            }
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Enter" ||
                                e.key === "," ||
                                e.key === " "
                              ) {
                                e.preventDefault();
                                const trimmed = emailInput
                                  .replace(/[,\s]/g, "")
                                  .trim();
                                if (
                                  trimmed &&
                                  trimmed.includes("@") &&
                                  !inviteEmails.includes(trimmed)
                                ) {
                                  setInviteEmails([...inviteEmails, trimmed]);
                                }
                                setEmailInput("");
                              }
                            }}
                            className="flex-1 min-w-[120px] text-xs text-[#202020] outline-none border-none p-0 focus:ring-0"
                          />
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-1">
                          Press Enter, Comma, or Space after typing an email to
                          add it as a tag.
                        </p>
                      </div>

                      {/* Role selector dropdown */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-neutral-600">
                          Role
                        </label>
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value as any)}
                          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-700 outline-none focus:border-brand cursor-pointer"
                        >
                          <option value="Admin">
                            Admin (Can add/remove members, change settings,
                            delete team)
                          </option>
                          <option value="Member">
                            Member (Can manage projects, tasks, and comments)
                          </option>
                        </select>
                      </div>

                      {/* Submit */}
                      <div className="flex gap-2.5 pt-4 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={() => {
                            if (inviteEmails.length === 0) return;
                            // Add emails to pending list
                            const newInvites = inviteEmails.map((email) => ({
                              email,
                              role: inviteRole,
                            }));
                            setPendingInvites([
                              ...pendingInvites,
                              ...newInvites,
                            ]);
                            setInviteEmails([]);
                            setMembersView("list");
                            setToastMessage(
                              `Sent ${newInvites.length} invitation${newInvites.length > 1 ? "s" : ""}`,
                            );
                            setTimeout(() => setToastMessage(null), 2500);
                          }}
                          disabled={inviteEmails.length === 0}
                          className={cn(
                            "rounded-md px-4 py-2 text-xs font-semibold text-white transition",
                            inviteEmails.length > 0
                              ? "bg-brand hover:bg-brand-dark"
                              : "cursor-not-allowed bg-brand/50",
                          )}
                        >
                          Send invites
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setInviteEmails([]);
                            setMembersView("list");
                          }}
                          className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "team-settings" && (
              <div className="space-y-6 animate-fade-up">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-bold text-[#202020]">
                    Team Settings
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Configure team information, security domains, and discovery.
                  </p>
                </div>

                {/* Logo section */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-pink-100 text-pink-600 font-bold text-xl border border-pink-200 shadow-sm shrink-0">
                      {teamName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <button
                        onClick={() =>
                          alert("Upload logo functionality mocked.")
                        }
                        className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-50 transition shadow-sm"
                      >
                        Upload logo
                      </button>
                      <p className="mt-1.5 text-[10px] text-neutral-400">
                        Pick a photo up to 4MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Name Section */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600 block">
                    Team name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-brand"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Keep it something simple your teammates will recognize.
                  </p>
                </div>

                {/* Security Domain Discovery */}
                <div className="space-y-4 border-t border-neutral-100 pt-4">
                  <h4 className="text-sm font-bold text-[#202020]">Security</h4>

                  {/* Alert banner */}
                  <div className="flex gap-2.5 rounded-lg border border-blue-100 bg-blue-50/50 p-3 text-xs text-blue-700">
                    <span className="shrink-0 text-base mt-0.5">ℹ️</span>
                    <div>
                      Verify your email address to enable Team Discovery.{" "}
                      <button
                        onClick={() =>
                          alert(
                            "Verification email sent to bertrand@nicelydone.club",
                          )
                        }
                        className="font-bold underline hover:text-blue-800 transition"
                      >
                        Send verification email
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600 block">
                      Team domain
                    </label>
                    <input
                      type="text"
                      value={teamDomain}
                      onChange={(e) => setTeamDomain(e.target.value)}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-xs outline-none focus:border-brand"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Your team domain is the suffix of your company email
                      address. If your email is bertrand@nicelydone.club, your
                      domain is nicelydone.club. Learn more.
                    </p>
                  </div>

                  {/* Discovery Toggle */}
                  <div className="flex items-start justify-between gap-4 py-2 border-b border-neutral-100 pb-4">
                    <div className="space-y-0.5">
                      <span className="block text-sm font-bold text-[#202020]">
                        Team Discovery
                      </span>
                      <span className="text-xs text-neutral-500 block">
                        Anyone with the same email domain will be able to find
                        and automatically join the team.
                      </span>
                    </div>
                    <button
                      onClick={() => setTeamDiscovery(!teamDiscovery)}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none mt-1",
                        teamDiscovery ? "bg-brand" : "bg-neutral-200",
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          teamDiscovery ? "translate-x-4" : "translate-x-0",
                        )}
                      />
                    </button>
                  </div>

                  {/* External Guests Toggle with Upgrade Badge */}
                  <div className="flex items-start justify-between gap-4 py-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#202020]">
                          Prohibit external guests
                        </span>
                        <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold text-brand uppercase">
                          UPGRADE
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 block">
                        Disable inviting people outside of your team to projects
                        as guests.
                      </span>
                    </div>
                    <button
                      onClick={() => setProhibitGuests(!prohibitGuests)}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none mt-1",
                        prohibitGuests ? "bg-brand" : "bg-neutral-200",
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                          prohibitGuests ? "translate-x-4" : "translate-x-0",
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="border-t border-neutral-200 pt-4 space-y-4">
                  <h4 className="text-sm font-bold text-[#b91c1c]">
                    Danger zone
                  </h4>

                  <div className="flex items-start justify-between gap-4 py-1.5">
                    <div className="space-y-0.5">
                      <span className="block text-sm font-bold text-[#202020]">
                        Leave team
                      </span>
                      <span className="text-xs text-neutral-500 block max-w-md">
                        By leaving, you'll immediately lose access to all
                        Nicelydone team projects. You'll need to be re-invited
                        to join again. Learn more.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to leave Nicelydone team?",
                          )
                        ) {
                          alert("Left team successfully.");
                          onClose();
                        }
                      }}
                      className="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      Leave team
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4 py-1.5 border-t border-neutral-100 pt-3.5">
                    <div className="space-y-0.5">
                      <span className="block text-sm font-bold text-[#202020]">
                        Delete team
                      </span>
                      <span className="text-xs text-neutral-500 block max-w-md">
                        This will immediately and permanently delete the
                        Nicelydone team and its data for everyone - including
                        all projects and tasks. This cannot be undone. Learn
                        more.
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete Nicelydone team permanently? This CANNOT be undone.",
                          )
                        ) {
                          alert("Deleted team permanently.");
                          onClose();
                        }
                      }}
                      className="rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition"
                    >
                      Delete team
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-100 pt-4 flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Mock save confirmation toast
                alert("Preferences updated!");
                onClose();
              }}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
      {discardOpen && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/40 p-6"
          onClick={() => setDiscardOpen(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#202020]">
                Discard changes?
              </h2>
              <button
                onClick={() => setDiscardOpen(false)}
                aria-label="Close"
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-sm text-neutral-600">
              The changes you&apos;ve made won&apos;t be saved.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDiscardOpen(false)}
                className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={discardTheme}
                className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[90] flex items-center gap-3 rounded-lg bg-[#202020] px-4 py-3 text-sm text-white shadow-xl animate-pop-in">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-white font-semibold text-xs ml-1"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg px-2.5 py-2 text-sm font-semibold transition",
        active
          ? "bg-brand-tint text-brand"
          : "text-[#202020] hover:bg-neutral-100",
      )}
    >
      {children}
    </button>
  );
}

/** Deterministic QR-code-like grid rendered from a seed string. */
function QrCode({ seed }: { seed: string }) {
  const N = 25;
  // Simple seeded pseudo-random so the pattern is stable per secret.
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = (i: number) => {
    const x = Math.sin(h + i * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) =>
      r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const local = (br: number, bc: number) => {
      const rr = r - br;
      const cc = c - bc;
      if (rr === 0 || rr === 6 || cc === 0 || cc === 6) return true; // outer ring
      if (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4) return true; // inner block
      return false;
    };
    if (r < 7 && c < 7) return local(0, 0);
    if (r < 7 && c >= N - 7) return local(0, N - 7);
    if (r >= N - 7 && c < 7) return local(N - 7, 0);
    return false;
  };
  const cells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const on = isFinder(r, c) ? finderOn(r, c) : rand(r * N + c) > 0.5;
      if (on) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c}
            y={r}
            width={1}
            height={1}
            fill="#202020"
          />,
        );
      }
    }
  }
  return (
    <svg
      width="140"
      height="140"
      viewBox={`0 0 ${N} ${N}`}
      shapeRendering="crispEdges"
      aria-label="2FA QR code"
      className="rounded"
    >
      <rect x={0} y={0} width={N} height={N} fill="#ffffff" />
      {cells}
    </svg>
  );
}

function CheckCircleMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8.5 12.5l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition",
        checked ? "bg-brand" : "bg-neutral-300",
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

/** Mini theme preview card body: accent bar + skeleton rows + a circle. */
function ThemePreview({ accent, dark }: { accent: string; dark?: boolean }) {
  const skeleton = dark ? "#3a3a3a" : "#e7e5e4";
  return (
    <div
      className="mt-3 rounded-lg p-2.5"
      style={{ backgroundColor: dark ? "#161616" : "#faf9f8" }}
    >
      <div
        className="h-2 w-12 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <div className="mt-2.5 flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full border"
          style={{ borderColor: dark ? "#4a4a4a" : "#c9c7c5" }}
        />
        <span
          className="h-2 flex-1 rounded-full"
          style={{ backgroundColor: skeleton }}
        />
      </div>
      <div
        className="mt-2 ml-5 h-2 w-3/4 rounded-full"
        style={{ backgroundColor: skeleton }}
      />
      <div
        className="mt-2 ml-5 h-2 w-1/2 rounded-full"
        style={{ backgroundColor: skeleton }}
      />
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition",
        checked
          ? "border-brand bg-brand text-white"
          : "border-neutral-300 bg-white",
      )}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12l5 5L20 6"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function InfoMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6z" />
    </svg>
  );
}
function MinusCircle() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M7 12h10"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function PlusCircle() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path
        d="M12 7v10M7 12h10"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function QuickActionIcon({ name }: { name: string }) {
  const map: Record<string, string> = {
    Date: "📅",
    Assignee: "👤",
    Attachment: "📎",
    Priority: "🚩",
    Reminders: "⏰",
    Labels: "🏷️",
    Deadline: "🎯",
    Location: "📍",
  };
  return <span aria-hidden>{map[name] ?? "•"}</span>;
}

const sg = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
} as const;
function InboxGlyph() {
  return (
    <svg {...sg} aria-hidden>
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
function TodayGlyph() {
  return (
    <svg {...sg} aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 9h16M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function UpcomingGlyph() {
  return (
    <svg {...sg} aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 14l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function FiltersGlyph() {
  return (
    <svg {...sg} aria-hidden>
      <rect
        x="4"
        y="4"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="4"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="13"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <rect
        x="13"
        y="13"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function ReportingGlyph() {
  return (
    <svg {...sg} aria-hidden>
      <path
        d="M4 13h3l2 5 4-12 2 7h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
