"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useTasks } from "../state";
import {
  CalendarBlank as PhCalendarBlank,
  CalendarCheck as PhCalendarCheck,
  User as PhUser,
  Paperclip as PhPaperclip,
  Flag as PhFlag,
  Alarm as PhAlarm,
  Tag as PhTag,
  Target as PhTarget,
  MapPin as PhMapPin,
  Timer as PhTimer,
  Microphone as PhMicrophone,
  EnvelopeSimple as PhEnvelope,
  Sparkle as PhSparkle,
  DeviceMobile as PhDeviceMobile,
  PushPin as PhPushPin,
  Flask as PhFlask,
  Buildings as PhBuildings,
  GoogleLogo as PhGoogleLogo,
  AppleLogo as PhAppleLogo,
  FacebookLogo as PhFacebookLogo,
  MicrosoftOutlookLogo as PhOutlookLogo,
} from "@phosphor-icons/react";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: Tab;
}

type Tab =
  | "account"
  | "general"
  | "advanced"
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

const AccountIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const GeneralIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const AdvancedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);
const SubscriptionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const ThemeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.34776 19.4929 6.00287 19.8396 6.5 20.5C7.03926 21.2165 6.77254 22 8 22H12Z" />
    <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
    <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
    <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
    <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
  </svg>
);
const SidebarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
  </svg>
);
const QuickAddIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
  </svg>
);
const ProductivityIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const RemindersIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8" />
    <polyline points="12 9 12 13 15 15" />
    <line x1="5" y1="3" x2="2" y2="6" />
    <line x1="19" y1="3" x2="22" y2="6" />
  </svg>
);
const NotificationsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const BackupsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.2 15c.9-1.2 1-2.9.2-4.1-1-1.6-2.9-2.2-4.7-1.4C15.8 6.4 13 4 9.8 4 6 4 3 7 3 10.8c0 1.2.3 2.3.9 3.2M12 12v9m-3-3l3 3 3-3" />
  </svg>
);
const IntegrationsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7h-2a5 5 0 0 1-10 0H5a7 7 0 0 0 7 7zM5 15V9a7 7 0 0 1 14 0v6" />
  </svg>
);

export function SettingsModal({
  open,
  onClose,
  initialTab,
}: SettingsModalProps) {
  const { state, dispatch } = useTasks();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab || "account");
  const [theme, setTheme] = useState("todoist");
  const [pendingTheme, setPendingTheme] = useState<string | null>(null);
  const [syncTheme, setSyncTheme] = useState(true);
  const [autoDark, setAutoDark] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("account@refero.design");
  const [lang, setLang] = useState("en");
  const [dateFormat, setDateFormat] = useState("DD-MM-YYYY");
  const [emailNotif, setEmailNotif] = useState(true);
  const [gcalConnected, setGcalConnected] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  );

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
        className="flex w-full max-w-[850px] h-[580px] animate-pop-in overflow-hidden rounded-2xl bg-white dark:bg-[#151515] border border-neutral-200/60 dark:border-neutral-800 shadow-2xl relative font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Sidebar Tabs */}
        <aside className="w-[210px] shrink-0 bg-[#fafafa] dark:bg-[#1a1a1a]/40 border-r border-neutral-200/80 dark:border-neutral-800 p-3 flex flex-col h-full select-none">
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pr-0.5">
            <div>
              <h2 className="text-[19px] font-bold text-[#202020] dark:text-neutral-100 px-2.5 mb-3.5 select-none">
                Settings
              </h2>

              {/* Search Box */}
              <div className="relative px-2.5 mb-3.5 select-none">
                <svg
                  className="absolute left-5.5 top-1/2 -translate-y-1/2 text-neutral-400"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  value={sidebarSearch}
                  onChange={(e) => setSidebarSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-[13px] font-medium rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 outline-none focus:border-[#de4c4a] shadow-3xs text-[#202020] dark:text-white"
                />
              </div>

              <div className="space-y-0.5">
                {[
                  { id: "account" as Tab, label: "Account", icon: <AccountIcon /> },
                  { id: "general" as Tab, label: "General", icon: <GeneralIcon /> },
                  { id: "advanced" as Tab, label: "Advanced", icon: <AdvancedIcon /> },
                  { id: "subscription" as Tab, label: "Subscription", icon: <SubscriptionIcon /> },
                  { id: "theme" as Tab, label: "Theme", icon: <ThemeIcon /> },
                  { id: "sidebar" as Tab, label: "Sidebar", icon: <SidebarIcon /> },
                  { id: "quick-add" as Tab, label: "Quick Add", icon: <QuickAddIcon /> },
                  { id: "productivity" as Tab, label: "Productivity", icon: <ProductivityIcon /> },
                  { id: "reminders" as Tab, label: "Reminders", icon: <RemindersIcon /> },
                  { id: "notifications" as Tab, label: "Notifications", icon: <NotificationsIcon /> },
                  { id: "backups" as Tab, label: "Backups", icon: <BackupsIcon /> },
                  { id: "integrations" as Tab, label: "Integrations", icon: <IntegrationsIcon /> },
                ].filter(item =>
                  item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
                ).map((item) => (
                  <TabButton
                    key={item.id}
                    active={activeTab === item.id || (item.id === "theme" && activeTab === "themes")}
                    onClick={() => setActiveTab(item.id)}
                    icon={item.icon}
                  >
                    {item.id === "reminders" ? (
                      <div className="flex items-center justify-between w-full">
                        <span>{item.label}</span>
                        <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-[#f5efe9] text-[#cf8038] tracking-wider uppercase scale-90">
                          PRO
                        </span>
                      </div>
                    ) : (
                      item.label
                    )}
                  </TabButton>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom section: Add team */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850">
            <button
              onClick={() => alert("Add team flow")}
              className="w-full text-left rounded-lg px-2.5 py-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-850 transition flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="text-neutral-400 font-bold text-sm">+</span>
              <span>Add team</span>
            </button>
          </div>
        </aside>

        {/* Right: Tab content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#121212]">
          {/* Settings Tab Header with close button */}
          <div className="flex items-center justify-between px-6 pt-5 pb-1 shrink-0 select-none">
            <h3 className="text-sm font-bold text-neutral-850 dark:text-neutral-100 flex items-center gap-2">
              {activeTab === "reminders"
                ? "Reminders"
                : activeTab === "quick-add"
                  ? "Quick Add"
                  : activeTab === "team-settings"
                    ? "Team settings"
                    : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              {activeTab === "reminders" && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#f5efe9] text-[#cf8038] tracking-wider uppercase select-none">
                  PRO
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-655 dark:hover:text-neutral-200 transition cursor-pointer select-none"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-[#202020] dark:text-neutral-200">
            {activeTab === "advanced" && (
              <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 select-none">
                  Customize advanced client preferences and keyboard shortcut options.{" "}
                  <span className="text-[#de4c4a] hover:underline cursor-pointer">Learn more.</span>
                </p>

                <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-[#202020] dark:text-white">Experimental features</span>
                      <span className="text-[10px] text-neutral-500 block max-w-md">Test new productivity features before they are fully released.</span>
                    </div>
                    <ToggleSwitch checked={false} onChange={() => {}} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <GeneralTabContent
                lang={lang}
                setLang={setLang}
                homeView={homeView}
                setHomeView={setHomeView}
                timezone={timezone}
                setTimezone={setTimezone}
                timeFormat={timeFormat}
                setTimeFormat={setTimeFormat}
                dateFormat={dateFormat}
                setDateFormat={setDateFormat}
                weekStart={weekStart}
                setWeekStart={setWeekStart}
                onClose={onClose}
                setToastMessage={setToastMessage}
              />
            )}

            {activeTab === "account" && twoFAStage === "idle" && (
              <AccountTabContent
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                avatarSrc={avatarSrc}
                setAvatarSrc={setAvatarSrc}
                setToastMessage={setToastMessage}
                twoFAEnabled={twoFAEnabled}
                setTwoFAEnabled={setTwoFAEnabled}
                twoFAStage={twoFAStage}
                setTwoFAStage={setTwoFAStage}
                twoFACode={twoFACode}
                setTwoFACode={setTwoFACode}
                twoFAVerified={twoFAVerified}
                onClose={onClose}
              />
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
              <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
                <p className="text-xs leading-relaxed text-neutral-655 dark:text-neutral-400 select-none">
                  Personalize your Todoist with colors to match your style, mood, and personality.{" "}
                  <span className="text-[#de4c4a] hover:underline cursor-pointer">Learn more.</span>
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={syncTheme}
                      onChange={() => setSyncTheme((v) => !v)}
                    />
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Sync theme
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <ToggleSwitch
                      checked={autoDark}
                      onChange={() => setAutoDark((v) => !v)}
                    />
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Auto Dark Mode
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-450 dark:text-neutral-500 pl-12 select-none leading-snug">
                    Automatically switch between light and dark themes when your system does.
                  </p>
                </div>

                {/* Your themes */}
                <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-3">
                  <h4 className="text-xs font-bold text-[#202020] dark:text-white">Your themes</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { id: "todoist", label: "Todoist", accent: "#dc4c3e", dark: false },
                      { id: "obsidian", label: "Noir", accent: "#1f1f1f", dark: false },
                      { id: "dark", label: "Dark", accent: "#111111", dark: true },
                      { id: "moonstone", label: "Neutral", accent: "#e5e5e5", dark: false },
                      { id: "tangerine", label: "Tangerine", accent: "#f97316", dark: false },
                    ].map((th) => {
                      const isSelected = selectedTheme === th.id;
                      return (
                        <button
                          key={th.id}
                          onClick={() => {
                            setTheme(th.id);
                            localStorage.setItem("todo_app_theme", th.id);
                            applyThemeVars(th.id);
                          }}
                          className={cn(
                            "rounded-xl border p-2.5 text-left relative overflow-hidden bg-neutral-50 dark:bg-neutral-900/40 select-none cursor-pointer",
                            isSelected
                              ? "border-[#de4c4a] ring-1 ring-[#de4c4a]"
                              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                          )}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                            <span>{th.label}</span>
                            {isSelected && (
                              <span className="text-[#de4c4a] font-bold text-xs select-none">✓</span>
                            )}
                          </div>
                          <div className="mt-2 h-7 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex overflow-hidden">
                            <div className="w-1.5 h-full" style={{ backgroundColor: th.accent }} />
                            <div className="flex-1 p-1 space-y-1">
                              <div className="w-6 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                              <div className="w-10 h-0.5 rounded-full bg-neutral-105 dark:bg-neutral-900" />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pro themes */}
                <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-3">
                  <div className="flex justify-between items-center select-none">
                    <h4 className="text-xs font-bold text-[#202020] dark:text-white">Pro themes</h4>
                    <button className="text-[10px] font-bold text-[#de4c4a] hover:underline cursor-pointer">
                      Unlock all themes
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Sunflower", accent: "#fbbf24" },
                      { label: "Clover", accent: "#10b981" },
                      { label: "Blueberry", accent: "#3b82f6" },
                      { label: "Royal Blue", accent: "#1e3a8a" },
                      { label: "Sky", accent: "#0ea5e9" },
                      { label: "Amethyst", accent: "#8b5cf6" },
                    ].map((th) => (
                      <div
                        key={th.label}
                        className="rounded-xl border border-neutral-150 dark:border-neutral-850 p-2.5 bg-neutral-50/50 dark:bg-neutral-900/20 opacity-70 relative select-none"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
                          <span>{th.label}</span>
                          <span className="text-[9px] text-amber-500">★</span>
                        </div>
                        <div className="mt-2 h-7 rounded bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex overflow-hidden">
                          <div className="w-1.5 h-full" style={{ backgroundColor: th.accent }} />
                          <div className="flex-1 p-1 space-y-1">
                            <div className="w-6 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                            <div className="w-10 h-0.5 rounded-full bg-neutral-105 dark:bg-neutral-900" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                      <span className="text-neutral-300"><PhFlask size={40} /></span>
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
              <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
                {/* Plan and Billing and payments */}
                <div className="flex items-center justify-between text-xs select-none">
                  <span className="font-bold text-[#202020] dark:text-white">Plan</span>
                  <button className="text-[#de4c4a] hover:underline flex items-center gap-1 font-semibold cursor-pointer">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                    Billing and payments
                  </button>
                </div>
                
                <h4 className="text-xs font-bold text-[#202020] dark:text-white">Todoist Free</h4>

                {/* Main Upgrade Card panel */}
                <div className="rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#181818] p-5 shadow-3xs flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="space-y-3.5 flex-1">
                    <div>
                      <h5 className="text-xs font-bold text-[#202020] dark:text-white">Todoist Pro</h5>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Unlock features to do your best work, from €5/month.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {[
                        { label: "Unlimited reminders", desc: "Never forget an important date or deadline again.", icon: <span className="text-orange-500">⏰</span> },
                        { label: "Comments & Files", desc: "Add important details to your tasks and projects.", icon: <span className="text-teal-500">💬</span> },
                        { label: "Filters & Labels", desc: "Add richer context and create custom task views.", icon: <span className="text-blue-500">🏷️</span> },
                        { label: "Productivity Trends", desc: "Visualize your weekly & monthly progress with color-coded charts.", icon: <span className="text-orange-400">📈</span> },
                        { label: "Automatic Backups", desc: "Never worry about losing your important data.", icon: <span className="text-neutral-500">☁️</span> },
                        { label: "10+ themes, and more", desc: "Unlock premium style customization colors.", icon: <span className="text-neutral-400">⋯</span> },
                      ].map((feat) => (
                        <div key={feat.label} className="flex gap-2.5 items-start">
                          <span className="shrink-0 text-base leading-none">{feat.icon}</span>
                          <div>
                            <p className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 leading-snug">{feat.label}</p>
                            <p className="text-[9px] text-neutral-450 dark:text-neutral-500 mt-0.5 leading-snug">{feat.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="shrink-0 rounded-lg bg-[#de4c4a] px-4 py-2 text-xs font-bold text-white hover:bg-[#c5392d] transition select-none cursor-pointer">
                    Upgrade now
                  </button>
                </div>

                {/* Bottom plan text links */}
                <div className="pt-2 space-y-4">
                  <p className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400">
                    Working with a team? <span className="text-[#de4c4a] hover:underline cursor-pointer">Try the Business plan.</span>
                  </p>

                  <div className="border-t border-neutral-100 dark:border-neutral-900/60 pt-4 flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#202020] dark:text-white">Billing information</h4>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                        Add your billing address and VAT ID so they appear on invoices.
                      </p>
                    </div>
                    <button className="rounded-lg border border-neutral-200 dark:border-neutral-850 bg-neutral-50 dark:bg-neutral-900 px-3.5 py-1.5 text-xs font-bold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer select-none">
                      Update
                    </button>
                  </div>
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
              <QuickAddTabContent
                quickActions={quickActions}
                setQuickActions={setQuickActions}
                showActionLabels={showActionLabels}
                setShowActionLabels={setShowActionLabels}
              />
            )}

            {activeTab === "productivity" && (
              <ProductivityTabContent
                karmaOn={karmaOn}
                setKarmaOn={setKarmaOn}
                daysOff={daysOff}
                setDaysOff={setDaysOff}
                state={state}
                dispatch={dispatch}
              />
            )}

            {activeTab === "reminders" && (
              <RemindersTabContent
                autoReminder={autoReminder}
                setAutoReminder={setAutoReminder}
                remDesktop={remDesktop}
                setRemDesktop={setRemDesktop}
                remMobile={remMobile}
                setRemMobile={setRemMobile}
                remEmail={remEmail}
                setRemEmail={setRemEmail}
                setToastMessage={setToastMessage}
              />
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
                    <PhGoogleLogo size={18} /> Connect Google Calendar
                  </button>
                  <button
                    onClick={() =>
                      setToastMessage("Connecting Outlook Calendar…")
                    }
                    className="flex items-center gap-2.5 rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-[#202020] hover:bg-neutral-50"
                  >
                    <PhOutlookLogo size={18} /> Connect Outlook Calendar
                  </button>
                </div>

                <h4 className="mt-6 text-base font-bold text-[#202020]">
                  What you can do
                </h4>
                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <div className="flex h-40 items-center justify-center bg-[#fdeee9] text-brand">
                      <PhCalendarBlank size={48} />
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
                    <div className="flex h-40 items-center justify-center bg-[#eaf3ec] text-green-700">
                      <PhCalendarCheck size={48} />
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
              <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
                {/* Shared projects */}
                <div className="space-y-1 select-none">
                  <h4 className="text-xs font-bold text-[#202020] dark:text-white">Shared projects</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Keep work moving forward with notifications about teammate's comments, completed tasks, and more.
                  </p>
                </div>

                {/* Notifications options table */}
                <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-xl overflow-hidden shadow-3xs">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800 text-neutral-400 font-extrabold tracking-wider uppercase select-none">
                        <th className="px-4 py-2.5 font-bold">Send notifications about</th>
                        <th className="px-4 py-2.5 font-bold text-center w-20">
                          <span className="flex items-center justify-center gap-1 select-none">
                            ✉️ Email
                          </span>
                        </th>
                        <th className="px-4 py-2.5 font-bold text-center w-20">
                          <span className="flex items-center justify-center gap-1 select-none">
                            📱 Mobile
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
                      {[
                        { key: "comments", label: "Comments for you" },
                        { key: "assigned", label: "Tasks assigned to you" },
                        { key: "completed", label: "Tasks completed", sub: "Only for tasks you've created or assigned" },
                        { key: "uncompleted", label: "Tasks uncompleted", sub: "Only for tasks you've created or assigned" },
                        { key: "joining", label: "Collaborators joining project" },
                        { key: "declining", label: "Collaborators declining projects" },
                        { key: "leaving", label: "Collaborators leaving project" },
                        { key: "removed", label: "Collaborators being removed from projects" },
                      ].map((row) => (
                        <tr key={row.key} className="hover:bg-neutral-50/30 dark:hover:bg-neutral-900/10">
                          <td className="px-4 py-3">
                            <span className="font-bold text-neutral-700 dark:text-neutral-200">{row.label}</span>
                            {row.sub && (
                              <span className="block text-[9px] text-neutral-400 dark:text-neutral-500 font-medium mt-0.5">
                                {row.sub}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Checkbox
                              checked={notifMatrix[row.label]?.email ?? false}
                              onChange={() =>
                                setNotifMatrix((s) => ({
                                  ...s,
                                  [row.label]: {
                                    ...s[row.label],
                                    email: !s[row.label]?.email,
                                  },
                                }))
                              }
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Checkbox
                              checked={notifMatrix[row.label]?.mobile ?? false}
                              onChange={() =>
                                setNotifMatrix((s) => ({
                                  ...s,
                                  [row.label]: {
                                    ...s[row.label],
                                    mobile: !s[row.label]?.mobile,
                                  },
                                }))
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Todoist emails digest */}
                <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-2 select-none">
                  <h4 className="text-xs font-bold text-[#202020] dark:text-white">Todoist emails</h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Stay in-the-know about all things Todoist.
                  </p>
                  
                  <div className="pt-1.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={emailDigest}
                        onChange={() => setEmailDigest((v) => !v)}
                      />
                      <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Daily digest
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-450 dark:text-neutral-500 pl-12 select-none leading-snug">
                      Personalized productivity stats plus your tasks due today. Sent every morning.
                    </p>
                  </div>
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
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-lg px-2.5 py-1.5 text-[13px] flex items-center gap-3 transition select-none cursor-pointer",
        active
          ? "bg-[#efefef] dark:bg-neutral-800 text-[#202020] dark:text-white font-bold"
          : "text-[#202020] dark:text-neutral-300 font-medium hover:bg-neutral-100/70 dark:hover:bg-neutral-900/60 hover:text-[#202020] dark:hover:text-white",
      )}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-[#202020] dark:text-white" : "text-neutral-500 dark:text-neutral-400"
          )}
        >
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0">{children}</span>
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
        "flex h-5.5 w-10 shrink-0 items-center rounded-full px-0.5 transition cursor-pointer select-none",
        checked ? "bg-[#de4c4a]" : "bg-neutral-300 dark:bg-neutral-700",
      )}
    >
      <span
        className={cn(
          "h-4.5 w-4.5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4.5",
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
        "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition select-none cursor-pointer",
        checked
          ? "border-[#de4c4a] bg-[#de4c4a] text-white"
          : "border-neutral-300 bg-white dark:bg-neutral-900 dark:border-neutral-800",
      )}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
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
  const map: Record<string, React.ReactNode> = {
    Date: <PhCalendarBlank size={15} />,
    Assignee: <PhUser size={15} />,
    Attachment: <PhPaperclip size={15} />,
    Priority: <PhFlag size={15} />,
    Reminders: <PhAlarm size={15} />,
    Labels: <PhTag size={15} />,
    Deadline: <PhTarget size={15} />,
    Location: <PhMapPin size={15} />,
  };
  return (
    <span aria-hidden className="inline-flex items-center">
      {map[name] ?? "•"}
    </span>
  );
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

interface GeneralTabContentProps {
  lang: string;
  setLang: (v: string) => void;
  homeView: string;
  setHomeView: (v: string) => void;
  timezone: string;
  setTimezone: (v: string) => void;
  timeFormat: string;
  setTimeFormat: (v: string) => void;
  dateFormat: string;
  setDateFormat: (v: string) => void;
  weekStart: string;
  setWeekStart: (v: string) => void;
  onClose: () => void;
  setToastMessage: (v: string | null) => void;
}

function GeneralTabContent({
  lang,
  setLang,
  homeView,
  setHomeView,
  timezone,
  setTimezone,
  timeFormat,
  setTimeFormat,
  dateFormat,
  setDateFormat,
  weekStart,
  setWeekStart,
  onClose,
  setToastMessage,
}: GeneralTabContentProps) {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Language */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Language
        </label>
        <div className="relative w-full">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-450">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Home view */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Home view
        </label>
        <div className="relative w-full">
          <select
            value={homeView}
            onChange={(e) => setHomeView(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-255 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option value="Inbox">Inbox</option>
            <option value="Today">Today</option>
            <option value="Upcoming">Upcoming</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-455">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Date & Time Section Header */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900/60 max-w-sm">
        <h4 className="text-[15px] font-bold text-[#202020] dark:text-white">
          Date &amp; time
        </h4>
      </div>

      {/* Time zone */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Time zone
        </label>
        <div className="relative w-full">
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-255 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option value="Europe/Stockholm">Europe/Stockholm</option>
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-455">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Time format */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Time format
        </label>
        <div className="relative w-full">
          <select
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-255 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option value="13:00">13:00</option>
            <option value="1:00 PM">1:00 PM</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-455">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Date format */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Date format
        </label>
        <div className="relative w-full">
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-255 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-455">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Week start */}
      <div className="flex flex-col gap-1.5 max-w-sm">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Week start
        </label>
        <div className="relative w-full">
          <select
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-255 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option value="Monday">Monday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-455">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg bg-[#f5f5f5] dark:bg-neutral-850 px-4 py-2 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer select-none"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setToastMessage("Settings updated successfully");
            setTimeout(() => setToastMessage(null), 1500);
            onClose();
          }}
          className="rounded-lg bg-[#de4c4a] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#c5392d] transition cursor-pointer select-none"
        >
          Update
        </button>
      </div>
    </div>
  );
}

interface AccountTabContentProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  avatarSrc: string | null;
  setAvatarSrc: (v: string | null) => void;
  setToastMessage: (v: string | null) => void;
  twoFAEnabled: boolean;
  setTwoFAEnabled: (v: boolean) => void;
  twoFAStage: "idle" | "enable";
  setTwoFAStage: (v: "idle" | "enable") => void;
  twoFACode: string;
  setTwoFACode: (v: string) => void;
  twoFAVerified: boolean;
  onClose: () => void;
}

function AccountTabContent({
  name,
  setName,
  email,
  setEmail,
  avatarSrc,
  setAvatarSrc,
  setToastMessage,
  twoFAEnabled,
  setTwoFAEnabled,
  twoFAStage,
  setTwoFAStage,
  twoFACode,
  setTwoFACode,
  onClose,
}: AccountTabContentProps) {
  return (
    <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
      {/* Photo */}
      <div className="space-y-2 pt-0.5">
        <span className="block text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Photo
        </span>
        <div className="flex items-center gap-4">
          {avatarSrc ? (
            <img src={avatarSrc} className="w-14 h-14 rounded-full object-cover shadow-3xs" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#efefef] text-neutral-800 flex items-center justify-center font-extrabold text-base select-none">
              JD
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                const url = prompt("Enter a mock photo image URL (or leave blank):");
                if (url !== null) {
                  setAvatarSrc(url || null);
                  setToastMessage("Photo updated!");
                  setTimeout(() => setToastMessage(null), 1500);
                }
              }}
              className="rounded-lg bg-[#f5f5f5] dark:bg-neutral-855 px-3 py-1.5 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer select-none"
            >
              Change photo
            </button>
            <button
              type="button"
              onClick={() => {
                setAvatarSrc(null);
                setToastMessage("Photo removed!");
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="rounded-lg border border-[#de4c4a] px-3 py-1.5 text-[13px] font-semibold text-[#de4c4a] hover:bg-[#de4c4a]/5 transition cursor-pointer select-none"
            >
              Remove photo
            </button>
          </div>
        </div>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 leading-normal select-none">
          Pick a photo up to 4MB.
        </p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1 max-w-sm pt-2">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-[13px] font-medium text-[#202020] dark:text-white outline-none focus:border-[#de4c4a] shadow-3xs"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1 max-w-sm pt-2">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Email
        </label>
        <p className="text-[13px] font-medium text-[#202020] dark:text-neutral-200 mt-1 select-none">
          {email}
        </p>
        <button
          type="button"
          onClick={() => {
            const newMail = prompt("Enter new email:", email);
            if (newMail) setEmail(newMail);
          }}
          className="rounded-lg bg-[#f5f5f5] dark:bg-neutral-855 px-3 py-1.5 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer select-none w-32 mt-2"
        >
          Change email
        </button>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1 max-w-sm pt-2">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Password
        </label>
        <button
          type="button"
          onClick={() => {
            setToastMessage("Password change flow");
            setTimeout(() => setToastMessage(null), 1500);
          }}
          className="rounded-lg bg-[#f5f5f5] dark:bg-neutral-855 px-3 py-1.5 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer select-none w-36 mt-2"
        >
          Change password
        </button>
      </div>

      {/* Two-factor authentication */}
      <div className="flex flex-col gap-1.5 max-w-sm pt-2">
        <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">
          Two-factor authentication
        </label>
        <div className="mt-1">
          <ToggleSwitch
            checked={twoFAEnabled}
            onChange={() => {
              if (twoFAEnabled) {
                setTwoFAEnabled(false);
                setToastMessage("Two-factor authentication disabled");
                setTimeout(() => setToastMessage(null), 1800);
              } else {
                setTwoFACode("");
                setTwoFAStage("enable");
              }
            }}
          />
        </div>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 select-none mt-1">
          2FA is disabled on your Todoist account.
        </p>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-900/60 my-5" />

      {/* Connected accounts */}
      <div className="space-y-3 pt-2 max-w-sm select-none">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-neutral-100">Connected accounts</h4>
        <p className="text-[12px] text-[#666666] dark:text-neutral-450 leading-normal">
          Log in to Todoist with your Google, Facebook, or Apple account.
        </p>
        
        <div className="space-y-2 pt-1">
          {/* Google */}
          <button
            onClick={() => alert("Google login integration flow")}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-855 transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.386-2.876-6.386-6.386s2.876-6.386 6.386-6.386c1.644 0 3.125.62 4.28 1.637l3.123-3.123C19.294 2.213 15.992 1 12.24 1A10.74 10.74 0 001.5 11.74a10.74 10.74 0 0010.74 10.74c5.845 0 10.74-4.21 10.74-10.74 0-.69-.06-1.356-.177-1.995H12.24z" />
            </svg>
            Log in with Google
          </button>

          {/* Facebook */}
          <button
            onClick={() => alert("Facebook login integration flow")}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-855 transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Log in with Facebook
          </button>

          {/* Apple */}
          <button
            onClick={() => alert("Apple login integration flow")}
            className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181818] px-4 py-2 text-[13px] font-semibold text-[#202020] dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-855 transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.87-1.05 2.98 1.12.09 2.27-.58 2.97-1.43z" />
            </svg>
            Log in with Apple
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductivityTabContentProps {
  karmaOn: boolean;
  setKarmaOn: (v: boolean) => void;
  daysOff: Record<string, boolean>;
  setDaysOff: (v: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  state: any;
  dispatch: any;
}

function ProductivityTabContent({
  karmaOn,
  setKarmaOn,
  daysOff,
  setDaysOff,
  state,
  dispatch,
}: ProductivityTabContentProps) {
  return (
    <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
      <p className="text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400 select-none">
        Celebrating your progress goes a long way toward achieving long-term success. And setting goals can help you stay on track!{" "}
        <span className="text-[#de4c4a] hover:underline cursor-pointer">Learn more.</span>
      </p>

      {/* Karma */}
      <div className="space-y-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Todoist Karma</h4>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={karmaOn}
            onChange={() => setKarmaOn(!karmaOn)}
          />
          <span className="text-[13px] font-semibold text-[#202020] dark:text-neutral-300">
            {karmaOn ? "On" : "Off"}
          </span>
        </div>
        <p className="text-[12px] leading-normal text-[#666666] dark:text-neutral-400">
          Stay motivated and accountable with Todoist Karma. Achieve new levels by earning points for completing tasks, reaching your daily and weekly goals, and using advanced features like recurring due dates.{" "}
          <span className="text-[#de4c4a] hover:underline cursor-pointer">Learn more.</span>
        </p>
      </div>

      {/* Goals */}
      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Goals</h4>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 select-none leading-normal">
          Small steps add up to big achievements. Set task goals to keep your momentum.
        </p>
        
        <div className="space-y-3 max-w-[240px] pt-1">
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-200">Daily tasks</label>
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
              className="w-full mt-1 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-[13px] font-semibold text-[#202020] dark:text-white outline-none focus:border-[#de4c4a] shadow-3xs"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-[#202020] dark:text-neutral-200">Weekly tasks</label>
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
              className="w-full mt-1 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-1.5 text-[13px] font-semibold text-[#202020] dark:text-white outline-none focus:border-[#de4c4a] shadow-3xs"
            />
          </div>
        </div>
      </div>

      {/* Days off */}
      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-2.5">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Days off</h4>
        <div className="flex flex-wrap gap-4 select-none pt-0.5">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <label key={d} className="flex items-center gap-2 cursor-pointer group">
              <Checkbox
                checked={daysOff[d]}
                onChange={() => setDaysOff((s) => ({ ...s, [d]: !s[d] }))}
              />
              <span className="text-xs font-semibold text-[#202020] dark:text-neutral-300 group-hover:text-neutral-900 transition">
                {d}
              </span>
            </label>
          ))}
        </div>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 leading-normal">
          When you take a break, your Karma and streaks can take a break too.
        </p>
      </div>

      {/* Vacation mode */}
      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Vacation mode</h4>
        <div className="flex items-center gap-2">
          <ToggleSwitch
            checked={state.vacationMode ?? false}
            onChange={() =>
              dispatch({
                type: "TOGGLE_VACATION_MODE",
                val: !(state.vacationMode ?? false),
              })
            }
          />
          <span className="text-[13px] font-semibold text-[#202020] dark:text-neutral-300">
            {state.vacationMode ? "On" : "Off"}
          </span>
        </div>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 leading-normal">
          Time off means your streaks and Karma stay, even if you don't hit your task goals.
        </p>
      </div>
    </div>
  );
}

interface QuickAddTabContentProps {
  quickActions: string[];
  setQuickActions: (v: string[] | ((prev: string[]) => string[])) => void;
  showActionLabels: boolean;
  setShowActionLabels: (v: boolean | ((prev: boolean) => boolean)) => void;
}

function QuickAddTabContent({
  quickActions,
  setQuickActions,
  showActionLabels,
  setShowActionLabels,
}: QuickAddTabContentProps) {
  return (
    <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
      <p className="text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400 select-none">
        To reorder your task actions, use drag and drop to move actions up or down the list.{" "}
        <span className="text-[#de4c4a] hover:underline cursor-pointer">Learn more.</span>
      </p>

      {/* Show task actions */}
      <div className="space-y-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Show task actions</h4>
        <div className="mt-2 max-w-sm overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-3xs">
          {quickActions.map((a, i) => (
            <div
              key={a}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-[#202020] dark:text-white",
                i > 0 && "border-t border-neutral-100 dark:border-neutral-800",
              )}
            >
              <button
                onClick={() =>
                  setQuickActions((list) => list.filter((x) => x !== a))
                }
                aria-label={`Remove ${a}`}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
                </svg>
              </button>
              <span className="text-neutral-400 dark:text-neutral-500">
                <QuickActionIcon name={a} />
              </span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* More task actions */}
      <div className="space-y-2 pt-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">More task actions</h4>
        <div className="mt-2 max-w-sm overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-3xs">
          {["Labels", "Deadline", "Location"]
            .filter((a) => !quickActions.includes(a))
            .map((a, i) => (
              <div
                key={a}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-[#202020] dark:text-white",
                  i > 0 && "border-t border-neutral-100 dark:border-neutral-800",
                )}
              >
                <button
                  onClick={() =>
                    setQuickActions((list) => [...list, a])
                  }
                  aria-label={`Add ${a}`}
                  className="text-green-600 hover:text-green-800 cursor-pointer"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                </button>
                <span className="text-neutral-400 dark:text-neutral-500">
                  <QuickActionIcon name={a} />
                </span>
                <span>{a}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Show action labels */}
      <div className="space-y-2 pt-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Show action labels</h4>
        <div className="mt-2 flex items-center gap-2.5">
          <ToggleSwitch
            checked={showActionLabels}
            onChange={() => setShowActionLabels((v) => !v)}
          />
          <span className="text-[13px] font-semibold text-[#202020] dark:text-neutral-300">
            {showActionLabels ? "On" : "Off"}
          </span>
        </div>
        
        <p className="text-[12px] text-neutral-400 dark:text-neutral-500 font-semibold pt-2">Example:</p>
        <div className="mt-1.5 flex max-w-sm flex-wrap items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-[#fafafa] dark:bg-neutral-900/60 p-2.5 shadow-3xs select-none">
          {quickActions.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 shadow-3xs"
            >
              <QuickActionIcon name={a} />
              {showActionLabels && <span className="text-[11px] font-semibold text-[#202020] dark:text-white">{a}</span>}
            </span>
          ))}
          <span className="inline-flex items-center rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-2 py-1 text-xs text-neutral-500 dark:text-neutral-450 shadow-3xs">
            ⋯
          </span>
        </div>
      </div>
    </div>
  );
}

interface RemindersTabContentProps {
  autoReminder: string;
  setAutoReminder: (v: string) => void;
  remDesktop: boolean;
  setRemDesktop: (v: boolean) => void;
  remMobile: boolean;
  setRemMobile: (v: boolean) => void;
  remEmail: boolean;
  setRemEmail: (v: boolean) => void;
  setToastMessage: (v: string | null) => void;
}

function RemindersTabContent({
  autoReminder,
  setAutoReminder,
  remDesktop,
  setRemDesktop,
  remMobile,
  setRemMobile,
  remEmail,
  setRemEmail,
  setToastMessage,
}: RemindersTabContentProps) {
  return (
    <div className="space-y-5 animate-fade-up text-[#202020] dark:text-neutral-200">
      <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 select-none">
        The secret to effortlessly remembering everything? Have Todoist remind you.{" "}
        <span className="text-[#de4c4a] hover:underline cursor-pointer">Learn more.</span>
      </p>

      {/* Automatic reminders */}
      <div className="space-y-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Automatic reminders</h4>
        <div className="relative w-full max-w-sm">
          <select
            value={autoReminder}
            onChange={(e) => setAutoReminder(e.target.value)}
            className="w-full text-[13px] font-medium text-[#202020] dark:text-white bg-white dark:bg-neutral-900 border border-neutral-250 dark:border-neutral-800 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-[#de4c4a] shadow-3xs cursor-pointer appearance-none"
          >
            <option>At time of task</option>
            <option>10 minutes before</option>
            <option>30 minutes before</option>
            <option>1 hour before</option>
            <option>1 day before</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-450">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 select-none leading-snug">
          When enabled, a reminder before the task's time will be added by default.
        </p>
      </div>

      {/* How would you like to get reminded */}
      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-2.5">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">How would you like to get reminded?</h4>
        <div className="space-y-3">
          {[
            { label: "Desktop notifications", val: remDesktop, setter: setRemDesktop },
            { label: "Mobile notifications", val: remMobile, setter: setRemMobile },
            { label: "Emails", val: remEmail, setter: setRemEmail },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <ToggleSwitch
                checked={item.val}
                onChange={() => item.setter(!item.val)}
              />
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 select-none">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Send test reminder */}
      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="max-w-sm space-y-1.5">
          <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Send test reminder</h4>
          <p className="text-[12px] text-[#666666] dark:text-neutral-400 leading-normal select-none">
            Wondering how reminders help you stay productive, or want to check if your device settings are correct? Trigger a test reminder to see it in action. You should receive it within 1 minute.
          </p>
          <div className="flex gap-2 pt-1 select-none">
            <button
              onClick={() => {
                setToastMessage("Test reminder sent (web)");
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="rounded-lg bg-[#f5f5f5] dark:bg-neutral-855 px-3 py-1.5 text-xs font-bold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Test web
            </button>
            <button
              onClick={() => {
                setToastMessage("Test reminder sent (mobile)");
                setTimeout(() => setToastMessage(null), 1500);
              }}
              className="rounded-lg bg-[#f5f5f5] dark:bg-neutral-855 px-3 py-1.5 text-xs font-bold text-[#202020] dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Test mobile
            </button>
          </div>
        </div>
        
        <div className="shrink-0 w-full md:w-auto">
          <p className="text-[11px] font-bold text-neutral-400 uppercase select-none">Preview</p>
          <div className="mt-1.5 flex w-60 items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#181818] p-2.5 shadow-3xs select-none">
            <span className="text-[#de4c4a]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-[#202020] dark:text-white truncate">Get groceries</p>
              <p className="text-[9px] text-neutral-400 mt-0.5">Today 09:00</p>
            </div>
            <span className="text-[9px] text-neutral-400">now</span>
          </div>
        </div>
      </div>

      {/* Your devices */}
      <div className="pt-3.5 border-t border-neutral-100 dark:border-neutral-900/60 space-y-2">
        <h4 className="text-[13px] font-bold text-[#202020] dark:text-white">Your devices</h4>
        <p className="text-[12px] text-[#666666] dark:text-neutral-400 select-none">
          The following devices are connected to your Todoist.
        </p>
        <div className="max-w-md divide-y divide-neutral-150 dark:divide-neutral-855 pt-0.5">
          {["Apple Watch", "iPhone"].map((d) => (
            <div key={d} className="flex items-center justify-between py-2 text-xs">
              <span className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-semibold">
                {d === "Apple Watch" ? "⌚" : "📱"} {d}
              </span>
              <button
                onClick={() => alert(`Disconnected ${d}`)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer transition text-xs font-bold px-1.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
