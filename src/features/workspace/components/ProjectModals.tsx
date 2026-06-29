"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { PROJECT_COLORS, getProjectColor } from "../projects";
import type { ProjectRef } from "../types";
import type { Team } from "../team";
import { MEMBERS, memberInitials } from "../members";

// Dynamic SVG Icons
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

function HelpIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-400 hover:text-neutral-600"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 16v-.01M12 12c.5-1.5 2-1.5 2-3a2 2 0 10-4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 4h6v16H4V4zm10 0h6v16h-6V4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16 2v4M8 2v4M3 9h18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="animate-spin text-brand"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 3a9 9 0 019 9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ============================================================================
   1. ADD / EDIT PROJECT MODAL
   ============================================================================ */
interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  project?: ProjectRef; // If provided, we are editing
  onSave: (data: {
    name: string;
    colorName: string;
    layout: "list" | "board" | "calendar";
    favorite: boolean;
  }) => void;
}

export function ProjectModal({
  open,
  onClose,
  project,
  onSave,
}: ProjectModalProps) {
  const [name, setName] = useState("");
  const [colorName, setColorName] = useState("Charcoal");
  const [favorite, setFavorite] = useState(false);
  const [layout, setLayout] = useState<"list" | "board" | "calendar">("list");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (open) {
      if (project) {
        setName(project.name);
        setColorName(project.colorName || "Charcoal");
        setFavorite(project.favorite);
        setLayout(project.layout);
      } else {
        setName("");
        setColorName("Charcoal");
        setFavorite(false);
        setLayout("list");
      }
      setDropdownOpen(false);
    }
  }, [open, project]);

  if (!open) return null;

  const activeColorValue = getProjectColor(colorName);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 text-neutral-400 hover:text-neutral-600"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center gap-1.5 mb-5">
          <h2 className="text-xl font-bold text-[#202020]">
            {project ? "Edit project" : "Add project"}
          </h2>
          <HelpIcon />
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-neutral-500 uppercase">
                Name
              </label>
              <span className="text-[10px] text-neutral-400 font-semibold">
                {name.length}/120
              </span>
            </div>
            <input
              type="text"
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-[#202020] outline-none focus:border-neutral-400 transition font-medium"
              placeholder="e.g. Ads project"
              autoFocus
            />
          </div>

          {/* Color Selector Dropdown */}
          <div className="relative">
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">
              Color
            </label>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-[#202020] outline-none hover:bg-neutral-50 transition"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: activeColorValue }}
                />
                {colorName}
              </span>
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
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg animate-pop-in custom-scrollbar">
                  {PROJECT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setColorName(c.name);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-1.5 text-left text-sm hover:bg-neutral-50 transition",
                        colorName === c.name &&
                          "bg-neutral-100/60 font-semibold",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: c.value }}
                        />
                        {c.name}
                      </span>
                      {colorName === c.name && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                          className="text-brand"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Workspace select */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">
              Workspace
            </label>
            <div className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-[#202020] hover:bg-neutral-50 transition cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#84cc16] text-[10px] font-bold text-white uppercase">
                  B
                </span>
                My Projects
              </span>
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
            </div>
          </div>

          {/* Parent project select */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">
              Parent project
            </label>
            <div className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-[#202020] hover:bg-neutral-50 transition cursor-pointer">
              <span>No Parent</span>
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
            </div>
          </div>

          {/* Access select */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">
              Access
            </label>
            <div className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-[#202020] hover:bg-neutral-50 transition cursor-pointer">
              <span className="flex items-center gap-2 text-neutral-600">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-neutral-400 shrink-0"
                >
                  <rect
                    x="5"
                    y="11"
                    width="14"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 17v-2m-4-4V7a4 4 0 118 0v4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Restricted
              </span>
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
            </div>
          </div>

          {/* Add to Favorites Toggle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-[#202020]">
              Add to favorites
            </span>
            <button
              onClick={() => setFavorite((f) => !f)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                favorite ? "bg-brand" : "bg-neutral-200",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  favorite ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
          </div>

          {/* Layout Button Group selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">
              Layout
            </label>
            <div className="grid grid-cols-3 gap-0.5 rounded-lg bg-neutral-100 p-0.5">
              <button
                type="button"
                onClick={() => setLayout("list")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md py-3 text-xs font-bold transition border border-transparent",
                  layout === "list"
                    ? "bg-white text-[#202020] shadow-sm border-neutral-200/30"
                    : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                <ListIcon />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => setLayout("board")}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-md py-3 text-xs font-bold transition border border-transparent",
                  layout === "board"
                    ? "bg-white text-[#202020] shadow-sm border-neutral-200/30"
                    : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                <BoardIcon />
                <span>Board</span>
              </button>
              <button
                type="button"
                onClick={() => setLayout("calendar")}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 rounded-md py-3 text-xs font-bold transition border border-transparent",
                  layout === "calendar"
                    ? "bg-white text-[#202020] shadow-sm border-neutral-200/30"
                    : "text-neutral-500 hover:text-neutral-800",
                )}
              >
                <CalendarIcon />
                <span>Calendar</span>
                <span className="absolute -top-1 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white shadow-sm">
                  ★
                </span>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-neutral-400">
              Layout is synced between teammates in shared projects.{" "}
              <a href="#" className="text-brand hover:underline">
                Learn more.
              </a>
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex justify-end gap-2 border-t border-neutral-100 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) {
                onSave({ name: name.trim(), colorName, layout, favorite });
                onClose();
              }
            }}
            disabled={!name.trim()}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
              name.trim()
                ? "bg-brand hover:bg-brand-dark"
                : "bg-brand/50 cursor-not-allowed",
            )}
          >
            {project ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   2. EXPORT CSV MODAL
   ============================================================================ */
interface ExportCsvModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  onDownloadCsv: (useRelativeDates: boolean) => void;
}

export function ExportCsvModal({
  open,
  onClose,
  projectName,
  onDownloadCsv,
}: ExportCsvModalProps) {
  const [step, setStep] = useState<"pick" | "loading" | "copied">("pick");
  const [useRelative, setUseRelative] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (open) {
      setStep("pick");
      setCopiedText(false);
    }
  }, [open]);

  if (!open) return null;

  const shareableUrl = `https://app.todoist.com/API/v9.1/import/project_from_url?t_=${encodeURIComponent(projectName.replace(/\s+/g, "_").toLowerCase())}&rel=${useRelative ? "1" : "0"}`;

  function handleExportFile() {
    setStep("loading");
    setTimeout(() => {
      onDownloadCsv(useRelative);
      onClose();
    }, 1200);
  }

  function handleShareableUrl() {
    setStep("loading");
    setTimeout(() => {
      setStep("copied");
    }, 1000);
  }

  function copyLink() {
    void navigator.clipboard?.writeText(shareableUrl).catch(() => {});
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-xl font-bold text-[#202020] mb-4">Export as CSV</h2>

        {step === "pick" && (
          <div>
            <p className="text-sm text-neutral-500 mb-4">
              Please pick the template type:
            </p>
            <div className="space-y-2">
              <button
                onClick={handleExportFile}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition"
              >
                📄 Export as CSV file
              </button>
              <button
                onClick={handleShareableUrl}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition"
              >
                🔗 Export as shareable URL
              </button>
            </div>

            {/* Toggle switch relative dates */}
            <div className="mt-5 border-t border-neutral-100 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[#202020]">
                    Use relative dates
                  </span>
                  <span className="text-xs text-neutral-400 mt-0.5">
                    Relative means &ldquo;Tomorrow&rdquo; will get turned into
                    &ldquo;+1 day&rdquo;
                  </span>
                </div>
                <button
                  onClick={() => setUseRelative((r) => !r)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
                    useRelative ? "bg-brand" : "bg-neutral-200",
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      useRelative ? "translate-x-4" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Spinner />
          </div>
        )}

        {step === "copied" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">
                Copy the URL
              </label>
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-600 outline-none select-all"
              />
            </div>
            <div>
              <button
                onClick={copyLink}
                className="text-sm font-bold text-brand hover:text-brand-dark transition hover:underline"
              >
                {copiedText ? "Copied! ✓" : "Copy link"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   3. IMPORT CSV MODAL
   ============================================================================ */
interface ImportCsvModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (sections: { name: string; tasks: string[] }[]) => void;
}

export function ImportCsvModal({
  open,
  onClose,
  onImport,
}: ImportCsvModalProps) {
  const [step, setStep] = useState<"upload" | "loading">("upload");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setStep("upload");
      setFileName("");
    }
  }, [open]);

  if (!open) return null;

  function parseCsvContent(text: string) {
    // Basic CSV parser
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return [];

    // Parse lines considering quoted strings
    const rows = lines.map((line) => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });

    const headers = rows[0].map((h) => h.toLowerCase());
    const titleIdx = headers.findIndex(
      (h) => h.includes("title") || h.includes("task") || h.includes("name"),
    );
    const sectionIdx = headers.findIndex(
      (h) => h.includes("section") || h.includes("group"),
    );

    const dataRows = rows.slice(1);
    const sectionsMap: Record<string, string[]> = {};

    dataRows.forEach((row) => {
      const title = titleIdx !== -1 && row[titleIdx] ? row[titleIdx] : row[0];
      const section =
        sectionIdx !== -1 && row[sectionIdx] ? row[sectionIdx] : "Todo";
      if (title) {
        if (!sectionsMap[section]) {
          sectionsMap[section] = [];
        }
        sectionsMap[section].push(title);
      }
    });

    return Object.keys(sectionsMap).map((secName) => ({
      name: secName,
      tasks: sectionsMap[secName],
    }));
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStep("loading");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCsvContent(text);

      setTimeout(() => {
        if (parsed.length > 0) {
          onImport(parsed);
        } else {
          // Fallback if empty or parsing failed
          onImport([
            {
              name: "Live campaigns ▶",
              tasks: ["Facebook ad campaigns", "Google search ads"],
            },
            {
              name: "Upcoming campaigns",
              tasks: ["A/B test Landing Page", "Email newsletter copy"],
            },
          ]);
        }
        onClose();
      }, 1500); // 1.5s delay to match the 100% upload animation in Screen 10
    };
    reader.readAsText(file);
  }

  function triggerFileSelect() {
    fileInputRef.current?.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-xl font-bold text-[#202020] mb-4">
          Import from CSV
        </h2>

        {step === "upload" && (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelected}
              accept=".csv"
              className="hidden"
            />
            {/* Drag drop container */}
            <div
              onClick={triggerFileSelect}
              className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl py-12 px-6 bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer transition"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="text-neutral-400 mb-2"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-sm font-semibold text-[#202020] mb-1">
                Drag and drop a CSV file
              </p>
              <p className="text-xs text-brand font-bold hover:underline">
                Upload from your computer
              </p>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-neutral-400 text-center">
              Import tasks from a template, use this to create a new project by
              duplicating an existing one.
              <br />
              Your CSV file must be UTF-8 encoded.{" "}
              <a href="#" className="text-brand hover:underline font-bold">
                Learn more.
              </a>
            </p>
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Spinner />
            <p className="mt-4 text-sm font-bold text-[#202020]">
              {fileName}... 100%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   4. EMAIL TASKS TO THIS PROJECT MODAL
   ============================================================================ */
interface EmailTasksModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
}

export function EmailTasksModal({
  open,
  onClose,
  projectName,
}: EmailTasksModalProps) {
  const [emailHash, setEmailHash] = useState("f22624ca");
  const [disabled, setDisabled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setDisabled(false);
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  const emailAddress = `${projectName.replace(/\s+/g, "-").toLowerCase()} <add.task.48086951.2328132847.${emailHash}@todoist.net>`;

  function handleCopy() {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDisable() {
    setDisabled(true);
    const chars = "0123456789abcdef";
    let newHash = "";
    for (let i = 0; i < 8; i++) {
      newHash += chars[Math.floor(Math.random() * 16)];
    }
    setEmailHash(newHash);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-xl font-bold text-[#202020] mb-4">
          Email tasks to this project
        </h2>

        <p className="text-xs leading-relaxed text-neutral-600 mb-4">
          Send or forward an email to this address to create a task. The email's
          subject will become the content of the task while the body will be
          added as a comment.
        </p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            readOnly
            value={emailAddress}
            className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 outline-none font-medium truncate select-all"
          />
          <button
            onClick={handleCopy}
            className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-dark transition shrink-0"
          >
            {copied ? "Copied!" : "Copy email"}
          </button>
        </div>

        <div className="space-y-4 border-t border-b border-neutral-100 py-4 mb-5 max-h-60 overflow-y-auto custom-scrollbar">
          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">📅</span>
            <div>
              <h4 className="text-xs font-bold text-[#202020]">
                Set due dates
              </h4>
              <p className="text-xs leading-relaxed text-neutral-500 mt-0.5">
                Set due dates directly from your email client. Simply include{" "}
                <code className="bg-neutral-100 px-1 rounded text-neutral-600">
                  &lt;date tomorrow&gt;
                </code>{" "}
                in either the subject or the body of the email. You can use all
                of Todoist's dates such as{" "}
                <code className="bg-neutral-100 px-1 rounded text-neutral-600">
                  &lt;date every day&gt;
                </code>
                .{" "}
                <a href="#" className="text-brand hover:underline font-medium">
                  Read more about Todoist dates...
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">🏷️</span>
            <div>
              <h4 className="text-xs font-bold text-[#202020]">
                Label your email tasks easily
              </h4>
              <p className="text-xs leading-relaxed text-neutral-500 mt-0.5">
                Label your email tasks by including labels (e.g.{" "}
                <code className="bg-neutral-100 px-1 rounded text-neutral-600">
                  @shopping
                </code>
                ) in either subject or body of the email.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-base mt-0.5">🏳️</span>
            <div>
              <h4 className="text-xs font-bold text-[#202020]">
                Set priorities
              </h4>
              <p className="text-xs leading-relaxed text-neutral-500 mt-0.5">
                Set priorities on your email tasks by including{" "}
                <code className="bg-neutral-100 px-1 rounded text-neutral-600">
                  !!1
                </code>{" "}
                or{" "}
                <code className="bg-neutral-100 px-1 rounded text-neutral-600">
                  !!3
                </code>{" "}
                in either subject or body of the email.{" "}
                <code className="bg-neutral-100 px-1 rounded text-neutral-600">
                  !!1
                </code>{" "}
                will be top priority.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {disabled ? (
            <>
              <p className="text-xs text-green-600 font-semibold text-center bg-green-50 py-2 rounded-lg border border-green-200">
                The current email was disabled successfully and a new one was
                generated.
              </p>
              <button
                disabled
                className="w-full rounded-lg border border-neutral-200 bg-neutral-100 py-2.5 text-xs font-bold text-neutral-400 cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                <span>✓ Email disabled</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-neutral-500 text-center">
                Disable the current email and generate a new one:
              </p>
              <button
                onClick={handleDisable}
                className="w-full rounded-lg border border-brand py-2.5 text-xs font-bold text-brand hover:bg-brand-tint transition"
              >
                Disable current email
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   5. PROJECT CALENDAR FEED MODAL
   ============================================================================ */
interface CalendarFeedModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
}

export function CalendarFeedModal({
  open,
  onClose,
  projectName,
}: CalendarFeedModalProps) {
  const [feedHash, setFeedHash] = useState(
    "user_id=48086951&project_id=2328132847&token=f22624ca",
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setCopied(false);
    }
  }, [open]);

  if (!open) return null;

  const feedUrl = `https://ext.todoist.com/export/ical/project?${feedHash}`;

  function handleCopy() {
    navigator.clipboard.writeText(feedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDisableFeed() {
    const chars = "0123456789abcdef";
    let token = "";
    for (let i = 0; i < 8; i++) {
      token += chars[Math.floor(Math.random() * 16)];
    }
    setFeedHash(`user_id=48086951&project_id=2328132847&token=${token}`);
    alert(
      "The current calendar feed link has been disabled and a new one has been generated.",
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-xl font-bold text-[#202020] mb-4">
          Project calendar feed
        </h2>

        <p className="text-xs leading-relaxed text-neutral-600 mb-6">
          Add tasks from “{projectName}” to your calendar and/or share the
          calendar feed with others.
        </p>

        <div className="mb-6">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
            Subscribe with:
          </h4>
          <div className="flex gap-2">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Subscribing via Apple Calendar...");
              }}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#202020] hover:bg-neutral-50 transition"
            >
              <span>Apple Calendar</span>
              <span>📥</span>
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Subscribing via Outlook...");
              }}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#202020] hover:bg-neutral-50 transition"
            >
              <span>Outlook</span>
              <span>📥</span>
            </a>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-5 mb-6">
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Subscribe with Google Calendar:
            </h4>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] font-bold text-brand hover:underline"
            >
              <span>📋</span>
              <span>{copied ? "Copied" : "Copy to clipboard"}</span>
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={feedUrl}
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs text-neutral-600 outline-none font-medium truncate select-all"
          />
        </div>

        <div className="border-t border-neutral-100 pt-5">
          <button
            onClick={handleDisableFeed}
            className="w-full rounded-lg border border-brand py-2.5 text-xs font-bold text-brand hover:bg-brand-tint transition text-center"
          >
            Disable current feed & generate a new one
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   6. ARCHIVE PROJECT CONFIRMATION MODAL
   ============================================================================ */
interface AddFolderModalProps {
  open: boolean;
  onClose: () => void;
  /** Projects that can be placed in the folder. */
  projects: { id: string; name: string }[];
  onAdd: (name: string, projectIds: string[]) => void;
}

export function AddFolderModal({
  open,
  onClose,
  projects,
  onAdd,
}: AddFolderModalProps) {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setSelectedIds([]);
      setSelectOpen(false);
    }
  }, [open]);

  if (!open) return null;

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const selectLabel =
    selectedIds.length === 0
      ? "Select"
      : projects
          .filter((p) => selectedIds.includes(p.id))
          .map((p) => p.name)
          .join(", ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[14vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-lg font-bold text-[#202020]">Add folder</h2>

        {/* Name */}
        <label className="mt-4 block text-sm font-bold text-[#202020]">
          Name
        </label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              onAdd(name.trim(), selectedIds);
              onClose();
            }
          }}
          className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-[#202020] outline-none focus:border-neutral-400"
        />

        {/* Include projects */}
        <div className="mt-4 flex items-center gap-1.5">
          <label className="text-sm font-bold text-[#202020]">
            Include projects
          </label>
          <span className="text-sm text-neutral-400">{selectedIds.length}</span>
        </div>
        <div className="relative mt-2">
          <button
            onClick={() => setSelectOpen((v) => !v)}
            disabled={projects.length === 0}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-sm transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex min-w-0 items-center gap-2 text-neutral-600">
              <ListIcon />
              <span
                className={cn(
                  "truncate",
                  selectedIds.length ? "text-[#202020]" : "text-neutral-400",
                )}
              >
                {selectLabel}
              </span>
            </span>
            <ChevronDownIcon />
          </button>
          {selectOpen && projects.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setSelectOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-xl animate-pop-in">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-neutral-50"
                  >
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded border",
                        selectedIds.includes(p.id)
                          ? "border-brand bg-brand text-white"
                          : "border-neutral-300",
                      )}
                    >
                      {selectedIds.includes(p.id) && <CheckMini />}
                    </span>
                    <span className="font-bold text-neutral-400">#</span>
                    <span className="truncate text-[#202020]">{p.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Organize your projects into folders.{" "}
          <span className="font-medium text-brand">Learn more</span>
        </p>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAdd(name.trim(), selectedIds);
              onClose();
            }}
            disabled={!name.trim()}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
              name.trim()
                ? "bg-brand hover:bg-brand-dark"
                : "cursor-not-allowed bg-brand/50",
            )}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckMini() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface MoveIntoFolderModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  folders: { id: string; name: string }[];
  currentFolderId?: string | null;
  onMove: (folderId: string | null) => void;
}

export function MoveIntoFolderModal({
  open,
  onClose,
  projectName,
  folders,
  currentFolderId,
  onMove,
}: MoveIntoFolderModalProps) {
  // undefined = nothing chosen yet; null = "No folder"; string = folder id
  const [selected, setSelected] = useState<string | null | undefined>(
    undefined,
  );
  const [folderOpen, setFolderOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setSelected(currentFolderId ?? undefined);
      setFolderOpen(false);
    }
  }, [open, currentFolderId]);

  if (!open) return null;

  const options: { id: string | null; name: string }[] = [
    ...(currentFolderId ? [{ id: null, name: "No folder" }] : []),
    ...folders,
  ];
  const folderLabel =
    selected === undefined
      ? "Select"
      : selected === null
        ? "No folder"
        : (folders.find((f) => f.id === selected)?.name ?? "Select");
  const canMove = selected !== undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[14vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-lg font-bold text-[#202020]">Move into folder</h2>

        {/* Include projects */}
        <div className="mt-4 flex items-center gap-1.5">
          <label className="text-sm font-bold text-[#202020]">
            Include projects
          </label>
          <span className="text-sm text-neutral-400">1</span>
        </div>
        <div className="mt-2 flex items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-[#202020]">
          <span className="flex min-w-0 items-center gap-2">
            <span className="font-bold text-neutral-400">#</span>
            <span className="truncate">{projectName}</span>
          </span>
          <ChevronDownIcon />
        </div>

        {/* Folder */}
        <label className="mt-4 block text-sm font-bold text-[#202020]">
          Folder
        </label>
        <div className="relative mt-2">
          <button
            onClick={() => setFolderOpen((v) => !v)}
            disabled={options.length === 0}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-sm transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="flex min-w-0 items-center gap-2 text-neutral-600">
              <FolderGlyph />
              <span
                className={cn(
                  "truncate",
                  selected !== undefined
                    ? "text-[#202020]"
                    : "text-neutral-400",
                )}
              >
                {folderLabel}
              </span>
            </span>
            <ChevronDownIcon />
          </button>
          {folderOpen && options.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setFolderOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-xl animate-pop-in">
                {options.map((o) => (
                  <button
                    key={o.id ?? "__none__"}
                    onClick={() => {
                      setSelected(o.id);
                      setFolderOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#202020] hover:bg-neutral-50"
                  >
                    <FolderGlyph />
                    <span className="truncate">{o.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Organize your projects into folders.{" "}
          <span className="font-medium text-brand">Learn more</span>
        </p>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onMove(selected ?? null);
              onClose();
            }}
            disabled={!canMove}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition",
              canMove
                ? "bg-brand hover:bg-brand-dark"
                : "cursor-not-allowed bg-brand/50",
            )}
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
}

function FolderGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface MoveToTeamModalProps {
  open: boolean;
  onClose: () => void;
  team: Team;
  onConfirm: () => void;
}

export function MoveToTeamModal({
  open,
  onClose,
  team,
  onConfirm,
}: MoveToTeamModalProps) {
  const [access, setAccess] = useState<"restricted" | "open">("restricted");
  const [accessOpen, setAccessOpen] = useState(false);

  if (!open) return null;

  const currentUser = MEMBERS[0];

  const accessMeta = {
    restricted: {
      label: "Restricted",
      help: "Only people invited to this project can access it.",
      icon: <LockIcon />,
    },
    open: {
      label: "Open",
      help: "Anyone on the team can find and access this project.",
      icon: <TeamGlobeIcon />,
    },
  } as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[14vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center gap-2 pr-8">
          <h2 className="text-lg font-bold text-[#202020]">
            Move project to team workspace?
          </h2>
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-[10px] font-bold text-neutral-400">
            ?
          </span>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          This project will belong to the “{team.name}” team.{" "}
          <span className="font-bold text-[#202020]">
            For data security, this move cannot be undone.
          </span>
        </p>

        {/* Team */}
        <p className="mt-5 text-sm font-bold text-[#202020]">Team</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-white"
              style={{ backgroundColor: team.color }}
            >
              {team.name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm text-[#202020]">{team.name}</span>
          </div>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: currentUser.color }}
          >
            {memberInitials(currentUser.name)}
          </span>
        </div>

        {/* Access */}
        <p className="mt-5 text-sm font-bold text-[#202020]">Access</p>
        <div className="relative mt-2">
          <button
            onClick={() => setAccessOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-neutral-300 px-3 py-2.5 text-sm text-[#202020] transition hover:border-neutral-400"
          >
            <span className="flex items-center gap-2 text-neutral-600">
              {accessMeta[access].icon}
              <span className="text-[#202020]">{accessMeta[access].label}</span>
            </span>
            <ChevronDownIcon />
          </button>
          {accessOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setAccessOpen(false)}
              />
              <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-xl animate-pop-in">
                {(["restricted", "open"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setAccess(opt);
                      setAccessOpen(false);
                    }}
                    className="flex w-full items-start gap-2.5 px-3 py-2 text-left hover:bg-neutral-50"
                  >
                    <span className="mt-0.5 text-neutral-500">
                      {accessMeta[opt].icon}
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-[#202020]">
                        {accessMeta[opt].label}
                      </span>
                      <span className="block text-xs text-neutral-500">
                        {accessMeta[opt].help}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          {accessMeta[access].help}
        </p>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition"
          >
            Permanently move
          </button>
        </div>
      </div>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function TeamGlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
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

interface ArchiveProjectModalProps {
  open: boolean;
  onClose: () => void;
  projectName: string;
  onConfirm: () => void;
}

export function ArchiveProjectModal({
  open,
  onClose,
  projectName,
  onConfirm,
}: ArchiveProjectModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-6 pt-[25vh]"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-sm flex-col rounded-2xl bg-white p-6 shadow-2xl animate-pop-in animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600 transition"
        >
          <CloseIcon />
        </button>

        <h2 className="text-lg font-bold text-[#202020] mb-2">Archive?</h2>

        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          Are you sure you want to archive{" "}
          <span className="font-bold text-[#202020]">{projectName}</span>?
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark transition"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}
