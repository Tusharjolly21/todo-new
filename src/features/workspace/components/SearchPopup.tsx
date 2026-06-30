"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "../state";
import { cn } from "@/lib/utils/cn";

interface SearchPopupProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenSettings: (tab: string) => void;
  onOpenFocusTimer: () => void;
}

interface CommandItem {
  id: string;
  type: "command" | "task";
  title: string;
  category: string;
  icon: React.ReactNode;
  shortcut?: string;
  onClick: () => void;
}

// THEMES matching SettingsModal.tsx
const THEMES = [
  { id: "obsidian", accent: "#171717", accentDark: "#0a0a0a", tint: "#f5f5f5" },
  {
    id: "dark",
    accent: "#f5f5f5",
    accentDark: "#e5e5e5",
    tint: "#1c1c1e",
    dark: true,
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
  localStorage.setItem("todo_app_theme", id);
}

export function SearchPopup({
  open,
  onClose,
  onNavigate,
  onOpenSettings,
  onOpenFocusTimer,
}: SearchPopupProps) {
  const { state, dispatch } = useTasks();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle global keyboard trigger Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else {
          // Open triggered (will be handled by AppShell)
          // We attach a custom window event for AppShell to listen to
          window.dispatchEvent(new CustomEvent("toggle-global-search"));
        }
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [open, onClose]);

  // Compute command items
  const getCommands = (): CommandItem[] => {
    const items: CommandItem[] = [];

    // 1. Navigation / Views commands
    items.push({
      id: "nav-inbox",
      type: "command",
      title: "Go to Inbox",
      category: "Navigation",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M228.44,120.4l-19.6-78.4a16.11,16.11,0,0,0-15.5-12H62.66a16.11,16.11,0,0,0-15.5,12l-19.6,78.4A16.08,16.08,0,0,0,24,142v66a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V142A16.08,16.08,0,0,0,228.44,120.4ZM62.66,46h130.68l18,72H170.67A24,24,0,0,1,148,136H108a24,24,0,0,1-22.67-18H44.66ZM216,208H40V136H78.67A40.06,40.06,0,0,0,116,152h24a40.06,40.06,0,0,0,37.33-16H216v72Z" />
        </svg>
      ),
      shortcut: "g i",
      onClick: () => {
        onNavigate("inbox");
        onClose();
      },
    });

    items.push({
      id: "nav-today",
      type: "command",
      title: "Go to Today",
      category: "Navigation",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
        </svg>
      ),
      shortcut: "g t",
      onClick: () => {
        onNavigate("today");
        onClose();
      },
    });

    items.push({
      id: "nav-upcoming",
      type: "command",
      title: "Go to Upcoming",
      category: "Navigation",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM184,48V56a8,8,0,0,0,16,0V48h8V80H48V48h8v8a8,8,0,0,0,16,0V48ZM48,208V96H208V208ZM165.66,130.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-16-16a8,8,0,0,1,11.32-11.32L128,156.69l26.34-26.35A8,8,0,0,1,165.66,130.34Z" />
        </svg>
      ),
      shortcut: "g u",
      onClick: () => {
        onNavigate("upcoming");
        onClose();
      },
    });

    items.push({
      id: "nav-labels",
      type: "command",
      title: "Go to Filters & Labels",
      category: "Navigation",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M243.31,136,144,36.68A15.86,15.86,0,0,0,132.69,32H40A16,16,0,0,0,24,48v92.69A15.86,15.86,0,0,0,28.69,152l99.31,99.32a16,16,0,0,0,22.63,0l92.68-92.69A16,16,0,0,0,243.31,136ZM139.31,239.31,40,140V48h92.69l99.31,99.31ZM96,84A12,12,0,1,1,84,72,12,12,0,0,1,96,84Z" />
        </svg>
      ),
      shortcut: "g l",
      onClick: () => {
        onNavigate("filters-labels");
        onClose();
      },
    });

    // 2. Action / Tool commands
    items.push({
      id: "tool-focus",
      type: "command",
      title: "Open Focus Space",
      category: "Workspace Tools",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm0-144a56,56,0,1,0,56,56A56.06,56.06,0,0,0,128,72Zm0,96a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z" />
        </svg>
      ),
      shortcut: "g f",
      onClick: () => {
        onOpenFocusTimer();
        onClose();
      },
    });

    items.push({
      id: "tool-theme",
      type: "command",
      title: "Toggle Dark Mode",
      category: "Appearance",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34L52.69,41.37a8,8,0,0,0-11.32,11.32Zm139.32,0,17-17a8,8,0,0,0-11.32-11.32l-17,17a8,8,0,0,0,11.32,11.32ZM136,216v24a8,8,0,0,1-16,0V216a8,8,0,0,1,16,0Zm-83.31,1.31,17-17a8,8,0,0,0-11.32-11.32l-17,17a8,8,0,0,0,11.32,11.32Zm151.32-17a8,8,0,0,0-11.32,11.32l17,17a8,8,0,0,0,11.32-11.32ZM240,120H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16ZM40,120H16a8,8,0,0,0,0,16H40a8,8,0,0,0,0-16Z" />
        </svg>
      ),
      shortcut: "t t",
      onClick: () => {
        const isDark = document.documentElement.classList.contains("dark");
        applyThemeVars(isDark ? "obsidian" : "dark");
        onClose();
      },
    });

    items.push({
      id: "tool-settings",
      type: "command",
      title: "Open General Settings",
      category: "Configuration",
      icon: (
        <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM224,112H204a8,8,0,0,0,0,16h20a8,8,0,0,0,0-16ZM52,112H32a8,8,0,0,0,0,16H52a8,8,0,0,0,0-16Z" />
        </svg>
      ),
      shortcut: "g s",
      onClick: () => {
        onOpenSettings("general");
        onClose();
      },
    });

    // 3. Dynamic Search Matches (Active/Incomplete tasks)
    const activeTasks = state.tasks.filter((t) => !t.completed);
    activeTasks.forEach((task) => {
      items.push({
        id: `task-${task.id}`,
        type: "task",
        title: task.title,
        category: "Tasks",
        icon: (
          <svg width="13" height="13" viewBox="0 0 256 256" fill="currentColor">
            <path d="M172,120a8,8,0,0,1-8,8H92a8,8,0,0,1,0-16h72A8,8,0,0,1,172,120Zm-8,24H92a8,8,0,0,0,0,16h72a8,8,0,0,0,0-16ZM224,48V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48Zm-16,0H48V208H208Z" />
          </svg>
        ),
        shortcut: "Enter",
        onClick: () => {
          dispatch({ type: "OPEN_TASK", id: task.id });
          onClose();
        },
      });
    });

    return items;
  };

  const allItems = getCommands();

  // Filter commands by search query
  const filteredItems = allItems.filter((item) => {
    if (!query) {
      // If query is empty, show navigation, settings, and first 4 tasks
      if (item.type === "task") {
        const taskIndex = allItems
          .filter((x) => x.type === "task")
          .indexOf(item);
        return taskIndex < 4;
      }
      return true;
    }
    return (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  });

  // Handle Keyboard inside Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length > 0
            ? (prev - 1 + filteredItems.length) % filteredItems.length
            : 0,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const active = filteredItems[selectedIndex];
        if (active) {
          active.onClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredItems, selectedIndex, onClose]);

  // Adjust selectedIndex limit on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/45 dark:bg-black/65 backdrop-blur-xs p-4 pt-[14vh]"
      onClick={onClose}
    >
      {/* Surgical specificity overrides to prevent browser outline border glows on inputs */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .search-popup-input-clean {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
        .search-popup-input-clean:focus,
        .search-popup-input-clean:focus-visible,
        .search-popup-input-clean:active {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          background: transparent !important;
        }
      `,
        }}
      />

      <motion.div
        initial={{ scale: 0.96, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 8, opacity: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="w-full max-w-xl bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl rounded-2xl flex flex-col overflow-hidden text-neutral-800 dark:text-neutral-200"
        onClick={(e) => e.stopPropagation()}
        ref={containerRef}
      >
        {/* Search Input Box */}
        <div className="p-4.5 flex items-center gap-3.5">
          <span className="text-neutral-400 dark:text-neutral-500 shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 256 256"
              fill="currentColor"
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Type a task, view, or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputRef}
            className="flex-1 bg-transparent text-sm font-semibold text-neutral-900 dark:text-white placeholder-neutral-400/80 p-0.5 w-full search-popup-input-clean"
          />
        </div>

        {/* Separator Line */}
        <div className="h-[1px] bg-neutral-100 dark:bg-neutral-900/60 w-full" />

        {/* Categories/Search for "query" Header */}
        <div className="px-5 py-2.5 bg-neutral-50/20 dark:bg-neutral-950/10 text-[10px] font-extrabold tracking-wider text-neutral-400 uppercase select-none border-b border-neutral-100/40 dark:border-neutral-900/40">
          {query ? `Search results for "${query}"` : "Quick suggestions"}
        </div>

        {/* Scrollable Items Grid */}
        <div className="max-h-[310px] overflow-y-auto flex-1 py-1 px-1.5 space-y-0.5">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.onClick}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer relative",
                    isSelected
                      ? "bg-neutral-100/80 dark:bg-neutral-900/50 border-l-[3px] border-[#ef4444] pl-2.5"
                      : "border-l-[3px] border-transparent",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "shrink-0",
                        isSelected
                          ? "text-red-500"
                          : "text-neutral-400 dark:text-neutral-550",
                      )}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold transition-colors",
                        isSelected
                          ? "text-neutral-950 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300",
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 tracking-wide lowercase">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected ? (
                      <span className="text-[9px] font-extrabold text-neutral-400 tracking-wider flex items-center gap-1 bg-white dark:bg-neutral-850 px-2 py-0.5 rounded-md border border-neutral-200/50 dark:border-neutral-800 select-none">
                        Select <span className="text-[8px]">↵</span>
                      </span>
                    ) : (
                      item.shortcut && (
                        <span className="text-[9px] font-bold text-neutral-400 px-1.5 py-0.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/20 dark:border-neutral-800 rounded-md select-none tracking-wide uppercase">
                          {item.shortcut}
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 px-4 text-center text-xs font-bold text-neutral-400 uppercase tracking-widest select-none">
              No matching results found
            </div>
          )}
        </div>

        {/* Symmetrical Legend/Keyboard hints status bar */}
        <div className="px-5 py-3.5 bg-neutral-50/40 dark:bg-neutral-950/20 border-t border-neutral-100 dark:border-neutral-900/60 flex items-center justify-between text-[9px] font-extrabold text-neutral-400 tracking-widest uppercase select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-[8px] shadow-3xs text-neutral-500">
                ↵
              </kbd>
              to select
            </span>
            <span className="flex items-center gap-1.5">
              <span className="flex gap-0.5">
                <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-[8px] shadow-3xs text-neutral-500">
                  ↑
                </kbd>
                <kbd className="px-1 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-[8px] shadow-3xs text-neutral-500">
                  ↓
                </kbd>
              </span>
              to navigate
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-[8px] shadow-3xs text-neutral-500">
                esc
              </kbd>
              to close
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-800 rounded-md text-[8px] shadow-3xs text-neutral-500">
                ⌘ K
              </kbd>
              to toggle
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
