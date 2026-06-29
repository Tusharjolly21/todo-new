"use client";

import { useState, useEffect, useRef } from "react";
import { useTasks } from "../state";
import { PROJECT_COLORS } from "../projects";
import { cn } from "@/lib/utils/cn";
import type { FilterRef, LabelRef } from "../types";

// Simple robust query matching engine
export function matchFilterQuery(task: any, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (q === "assigned: me" || q === "assigned:me") {
    return task.assigneeId === "me";
  }
  if (q === "priority: 1" || q === "p1") return task.priority === 1;
  if (q === "priority: 2" || q === "p2") return task.priority === 2;
  if (q === "priority: 3" || q === "p3") return task.priority === 3;
  if (q === "priority: 4" || q === "p4") return task.priority === 4;
  if (q === "no date" || q === "nodate" || q === "no due date") {
    return !task.dueDate;
  }
  if (q.startsWith("project:")) {
    const projName = q.replace("project:", "").trim();
    return task.projectId.toLowerCase() === projName;
  }
  return (
    task.title.toLowerCase().includes(q) ||
    (task.description && task.description.toLowerCase().includes(q))
  );
}

export function FiltersLabelsView({
  onNavigate,
}: {
  onNavigate: (view: string) => void;
}) {
  const { state, dispatch } = useTasks();

  // Collapsible sections
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [labelsCollapsed, setLabelsCollapsed] = useState(false);

  // Modals state
  const [filterModal, setFilterModal] = useState<{
    mode: "add" | "edit";
    id?: string;
    name: string;
    query: string;
    colorName: string;
    favorite: boolean;
  } | null>(null);

  const [labelModal, setLabelModal] = useState<{
    mode: "add" | "edit";
    id?: string;
    name: string;
    colorName: string;
    favorite: boolean;
  } | null>(null);

  // Dropdown options popover
  const [itemDropdown, setItemDropdown] = useState<{
    type: "filter" | "label";
    id: string;
    x: number;
    y: number;
  } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setItemDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Assist States
  const [filterAssistOpen, setFilterAssistOpen] = useState(false);
  const [assistPrompt, setAssistPrompt] = useState("");
  const [assistResult, setAssistResult] = useState<{
    query: string;
    name: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const translateAssistPrompt = (
    prompt: string,
  ): { query: string; name: string } => {
    const p = prompt.toLowerCase().trim();

    if (
      (p.includes("priority 1") && p.includes("no due date")) ||
      (p.includes("p1") && p.includes("no date"))
    ) {
      return { query: "priority: 1, no date", name: "P1 & No Due Date" };
    }
    if (p.includes("priority 1") || p.includes("p1")) {
      return { query: "priority: 1", name: "High Priority" };
    }
    if (p.includes("priority 2") || p.includes("p2")) {
      return { query: "priority: 2", name: "Medium Priority" };
    }
    if (p.includes("priority 3") || p.includes("p3")) {
      return { query: "priority: 3", name: "Low Priority" };
    }
    if (p.includes("priority 4") || p.includes("p4")) {
      return { query: "priority: 4", name: "Normal Priority" };
    }
    if (
      p.includes("assigned to me") ||
      p.includes("my tasks") ||
      p.includes("mine")
    ) {
      return { query: "assigned: me", name: "Assigned to Me" };
    }
    if (
      p.includes("no due date") ||
      p.includes("no date") ||
      p.includes("nodate")
    ) {
      return { query: "no date", name: "No Due Date" };
    }
    if (p.includes("project:")) {
      const proj = p.split("project:")[1].trim().split(" ")[0];
      return { query: `project: ${proj}`, name: `${proj.toUpperCase()} Tasks` };
    }
    if (p.includes("in project")) {
      const proj = p
        .split("in project")[1]
        .trim()
        .split(" ")[0]
        .replace(/['"]/g, "");
      return {
        query: `project: ${proj}`,
        name: `${proj.charAt(0).toUpperCase() + proj.slice(1)} Tasks`,
      };
    }

    const cleanName = prompt.split(" ").slice(0, 3).join(" ");
    return {
      query: p.replace(/tasks|show|find|list/g, "").trim() || "no date",
      name:
        cleanName.charAt(0).toUpperCase() + cleanName.slice(1) ||
        "AI Custom Filter",
    };
  };

  const handleGenerateAssist = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const res = translateAssistPrompt(assistPrompt);
      setAssistResult(res);
      setIsGenerating(false);
    }, 600);
  };

  const handleApplyAssist = () => {
    if (!assistResult || !filterModal) return;
    setFilterModal({
      ...filterModal,
      name: assistResult.name,
      query: assistResult.query,
    });
    setFilterAssistOpen(false);
    setAssistResult(null);
    setAssistPrompt("");
  };

  const openAddFilter = () => {
    setFilterModal({
      mode: "add",
      name: "",
      query: "",
      colorName: "Charcoal",
      favorite: false,
    });
    setFilterAssistOpen(false);
    setAssistPrompt("");
    setAssistResult(null);
  };

  const openEditFilter = (f: FilterRef) => {
    setFilterModal({
      mode: "edit",
      id: f.id,
      name: f.name,
      query: f.query,
      colorName: f.colorName,
      favorite: f.favorite,
    });
    setFilterAssistOpen(false);
    setAssistPrompt("");
    setAssistResult(null);
  };

  const openAddLabel = () => {
    setLabelModal({
      mode: "add",
      name: "",
      colorName: "Charcoal",
      favorite: false,
    });
  };

  const openEditLabel = (l: LabelRef) => {
    setLabelModal({
      mode: "edit",
      id: l.id,
      name: l.name,
      colorName: l.colorName,
      favorite: l.favorite,
    });
  };

  // Handlers for Filters
  const handleSaveFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterModal) return;
    if (filterModal.mode === "add") {
      dispatch({
        type: "ADD_FILTER",
        name: filterModal.name,
        query: filterModal.query,
        colorName: filterModal.colorName,
        favorite: filterModal.favorite,
      });
    } else if (filterModal.mode === "edit" && filterModal.id) {
      dispatch({
        type: "EDIT_FILTER",
        id: filterModal.id,
        name: filterModal.name,
        query: filterModal.query,
        colorName: filterModal.colorName,
        favorite: filterModal.favorite,
      });
    }
    setFilterModal(null);
  };

  const handleSaveLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labelModal) return;
    if (labelModal.mode === "add") {
      dispatch({
        type: "ADD_LABEL",
        name: labelModal.name.toLowerCase().trim(),
        colorName: labelModal.colorName,
        favorite: labelModal.favorite,
      });
    } else if (labelModal.mode === "edit" && labelModal.id) {
      dispatch({
        type: "EDIT_LABEL",
        id: labelModal.id,
        name: labelModal.name.toLowerCase().trim(),
        colorName: labelModal.colorName,
        favorite: labelModal.favorite,
      });
    }
    setLabelModal(null);
  };

  const handleToggleFavoriteFilter = (f: FilterRef) => {
    dispatch({ type: "EDIT_FILTER", id: f.id, favorite: !f.favorite });
  };

  const handleToggleFavoriteLabel = (l: LabelRef) => {
    dispatch({ type: "EDIT_LABEL", id: l.id, favorite: !l.favorite });
  };

  const handleDuplicateFilter = (f: FilterRef) => {
    dispatch({
      type: "ADD_FILTER",
      name: `${f.name} (Copy)`,
      query: f.query,
      colorName: f.colorName,
      favorite: f.favorite,
    });
  };

  const handleDuplicateLabel = (l: LabelRef) => {
    dispatch({
      type: "ADD_LABEL",
      name: `${l.name}_copy`,
      colorName: l.colorName,
      favorite: l.favorite,
    });
  };

  const handleDotsClick = (
    e: React.MouseEvent,
    type: "filter" | "label",
    id: string,
  ) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setItemDropdown({
      type,
      id,
      x: rect.right - 180,
      y: rect.bottom + window.scrollY + 4,
    });
  };

  return (
    <div className="bg-white">
      {/* Top Bar */}
      <div className="flex items-center justify-end gap-2 px-6 py-3 border-b border-neutral-100 select-none h-[47px]" />

      {/* Main Content Area */}
      <div className="mx-auto max-w-3xl px-8 py-8 pb-32">
        <h1 className="text-2xl font-bold tracking-tight text-[#202020] mb-8">
          Filters & Labels
        </h1>

        <div className="space-y-6">
          {/* Section: My Filters */}
          <div className="border-b border-neutral-100 pb-4">
            <div className="group flex items-center justify-between py-2 cursor-pointer select-none">
              <div
                className="flex items-center gap-2"
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
              >
                <span className="text-neutral-400 p-0.5 hover:bg-neutral-100 rounded">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={cn(
                      "transition-transform",
                      filtersCollapsed ? "-rotate-90" : "",
                    )}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span className="text-sm font-bold text-[#202020]">
                  My Filters
                </span>
                <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider scale-90">
                  USED: {state.customFilters?.length || 0}/5
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openAddFilter();
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                title="Add filter"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!filtersCollapsed && (
              <div className="mt-2 pl-6 space-y-0.5">
                {!state.customFilters || state.customFilters.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-1">
                    No custom filters created yet.
                  </p>
                ) : (
                  state.customFilters.map((f: FilterRef) => (
                    <div
                      key={f.id}
                      onClick={() => onNavigate(`filter:${f.id}`)}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-50 cursor-pointer transition select-none"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={f.color}
                          strokeWidth="2.5"
                          className="shrink-0"
                        >
                          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
                        </svg>
                        <span className="text-sm text-neutral-800">
                          {f.name}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleToggleFavoriteFilter(f)}
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-200/60 text-neutral-400 transition",
                            f.favorite && "text-brand",
                          )}
                          title={
                            f.favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={f.favorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditFilter(f)}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition"
                          title="Edit"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDotsClick(e, "filter", f.id)}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition"
                          title="More actions"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Section: Labels */}
          <div>
            <div className="group flex items-center justify-between py-2 cursor-pointer select-none">
              <div
                className="flex items-center gap-2"
                onClick={() => setLabelsCollapsed(!labelsCollapsed)}
              >
                <span className="text-neutral-400 p-0.5 hover:bg-neutral-100 rounded">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className={cn(
                      "transition-transform",
                      labelsCollapsed ? "-rotate-90" : "",
                    )}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
                <span className="text-sm font-bold text-[#202020]">Labels</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openAddLabel();
                }}
                className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
                title="Add label"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {!labelsCollapsed && (
              <div className="mt-2 pl-6 space-y-0.5">
                {!state.customLabels || state.customLabels.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-4 font-normal">
                    Your list of labels will show up here.
                  </p>
                ) : (
                  state.customLabels.map((l: LabelRef) => (
                    <div
                      key={l.id}
                      onClick={() => onNavigate(`label:${l.name}`)}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 hover:bg-neutral-50 cursor-pointer transition select-none"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={l.color}
                          strokeWidth="2.5"
                          className="shrink-0"
                        >
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01" />
                        </svg>
                        <span className="text-sm text-neutral-800">
                          {l.name}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleToggleFavoriteLabel(l)}
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-200/60 text-neutral-400 transition",
                            l.favorite && "text-brand",
                          )}
                          title={
                            l.favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill={l.favorite ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditLabel(l)}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition"
                          title="Edit"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => handleDotsClick(e, "label", l.id)}
                          className="flex h-6 w-6 items-center justify-center rounded hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-700 transition"
                          title="More actions"
                        >
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="19" cy="12" r="1" />
                            <circle cx="5" cy="12" r="1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Dots Options Popover Menu */}
      {itemDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setItemDropdown(null)}
          />
          <div
            ref={dropdownRef}
            style={{ top: itemDropdown.y, left: itemDropdown.x }}
            className="absolute z-50 w-52 rounded-xl border border-neutral-200 bg-white py-1.5 shadow-2xl animate-pop-in text-[#202020] select-none"
          >
            {itemDropdown.type === "filter" ? (
              <>
                <button
                  onClick={() => {
                    setItemDropdown(null);
                    openAddFilter();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  Add filter above
                </button>
                <button
                  onClick={() => {
                    setItemDropdown(null);
                    openAddFilter();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Add filter below
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={() => {
                    const f = state.customFilters.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (f) openEditFilter(f);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    const f = state.customFilters.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (f) handleToggleFavoriteFilter(f);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Add to favorites
                </button>
                <button
                  onClick={() => {
                    const f = state.customFilters.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (f) handleDuplicateFilter(f);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    setItemDropdown(null);
                    navigator.clipboard.writeText(
                      window.location.origin + `/filter:${itemDropdown.id}`,
                    );
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Copy link to filter
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={() => {
                    const f = state.customFilters.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (
                      f &&
                      window.confirm(
                        "Are you sure you want to delete " + f.name,
                      )
                    ) {
                      dispatch({ type: "DELETE_FILTER", id: f.id });
                    }
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-bold hover:bg-neutral-100 text-red-500"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                  </svg>
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setItemDropdown(null);
                    openAddLabel();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  Add label above
                </button>
                <button
                  onClick={() => {
                    setItemDropdown(null);
                    openAddLabel();
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Add label below
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={() => {
                    const l = state.customLabels.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (l) openEditLabel(l);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => {
                    const l = state.customLabels.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (l) handleToggleFavoriteLabel(l);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Add to favorites
                </button>
                <button
                  onClick={() => {
                    const l = state.customLabels.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (l) handleDuplicateLabel(l);
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    setItemDropdown(null);
                    navigator.clipboard.writeText(
                      window.location.origin + `/label:${itemDropdown.id}`,
                    );
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-semibold hover:bg-neutral-100 text-neutral-700"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  Copy link to label
                </button>
                <div className="h-px bg-neutral-100 my-1" />
                <button
                  onClick={() => {
                    const l = state.customLabels.find(
                      (item) => item.id === itemDropdown.id,
                    );
                    setItemDropdown(null);
                    if (
                      l &&
                      window.confirm(
                        "Are you sure you want to delete " + l.name,
                      )
                    ) {
                      dispatch({ type: "DELETE_LABEL", id: l.id });
                    }
                  }}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-xs font-bold hover:bg-neutral-100 text-red-500"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Filter Modal */}
      {filterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-2xl animate-pop-in">
            <h3 className="text-base font-bold text-[#202020] mb-4">
              {filterModal.mode === "add" ? "Add filter" : "Edit filter"}
            </h3>

            {/* Filter Assist AI Section */}
            <div className="mb-4 rounded-lg bg-indigo-50/60 border border-indigo-100 p-3 select-none">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">✨</span>
                  <span className="text-xs font-bold text-indigo-950">
                    Filter Assist (AI)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFilterAssistOpen(!filterAssistOpen)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  {filterAssistOpen ? "Close" : "Try it"}
                </button>
              </div>

              {filterAssistOpen && (
                <div className="mt-3 space-y-3">
                  <textarea
                    value={assistPrompt}
                    onChange={(e) => setAssistPrompt(e.target.value)}
                    placeholder="e.g. priority 1 tasks with no due date"
                    className="w-full rounded border border-indigo-200 p-2 text-xs outline-none focus:border-indigo-500 text-black bg-white"
                    rows={2}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAssist}
                    disabled={isGenerating || !assistPrompt.trim()}
                    className="w-full rounded bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {isGenerating ? "Generating..." : "Generate Query"}
                  </button>

                  {assistResult && (
                    <div className="rounded bg-white border border-indigo-100 p-2.5 text-xs space-y-2.5">
                      <div>
                        <span className="font-bold text-neutral-400 block uppercase tracking-wider text-[9px]">
                          Suggested Name
                        </span>
                        <span className="font-semibold text-neutral-800">
                          {assistResult.name}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-neutral-400 block uppercase tracking-wider text-[9px]">
                          Suggested Query
                        </span>
                        <code className="bg-neutral-50 px-1 py-0.5 rounded text-indigo-600 font-mono text-[10px]">
                          {assistResult.query}
                        </code>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyAssist}
                        className="w-full rounded bg-indigo-50 py-1.5 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition"
                      >
                        Apply Suggestion
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveFilter} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Filter name
                </label>
                <input
                  type="text"
                  required
                  value={filterModal.name}
                  onChange={(e) =>
                    setFilterModal({ ...filterModal, name: e.target.value })
                  }
                  placeholder="e.g. High priority"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand text-black bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Filter query
                </label>
                <input
                  type="text"
                  required
                  value={filterModal.query}
                  onChange={(e) =>
                    setFilterModal({ ...filterModal, query: e.target.value })
                  }
                  placeholder="e.g. priority: 1, no date"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand text-black bg-white"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Queries supported: `priority: 1`, `no date`, `assigned: me`
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Color
                </label>
                <select
                  value={filterModal.colorName}
                  onChange={(e) =>
                    setFilterModal({
                      ...filterModal,
                      colorName: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand bg-white text-neutral-800"
                >
                  {PROJECT_COLORS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterModal.favorite}
                  onChange={(e) =>
                    setFilterModal({
                      ...filterModal,
                      favorite: e.target.checked,
                    })
                  }
                  className="rounded border-neutral-300 text-brand focus:ring-brand"
                />
                <span className="text-xs font-bold text-neutral-600">
                  Add to favorites
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setFilterModal(null)}
                  className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Label Modal */}
      {labelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs select-none">
          <div className="w-[420px] rounded-xl bg-white p-6 shadow-2xl animate-pop-in">
            <h3 className="text-base font-bold text-[#202020] mb-4">
              {labelModal.mode === "add" ? "Add label" : "Edit label"}
            </h3>
            <form onSubmit={handleSaveLabel} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Label name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-neutral-400 text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={labelModal.name}
                    onChange={(e) =>
                      setLabelModal({ ...labelModal, name: e.target.value })
                    }
                    placeholder="e.g. work"
                    className="w-full rounded-md border border-neutral-300 pl-7 pr-3 py-2 text-sm outline-none focus:border-brand text-black bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-600 block mb-1">
                  Color
                </label>
                <select
                  value={labelModal.colorName}
                  onChange={(e) =>
                    setLabelModal({ ...labelModal, colorName: e.target.value })
                  }
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand bg-white text-neutral-800"
                >
                  {PROJECT_COLORS.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={labelModal.favorite}
                  onChange={(e) =>
                    setLabelModal({ ...labelModal, favorite: e.target.checked })
                  }
                  className="rounded border-neutral-300 text-brand focus:ring-brand"
                />
                <span className="text-xs font-bold text-neutral-600">
                  Add to favorites
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setLabelModal(null)}
                  className="rounded-lg bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand px-4 py-2 text-xs font-bold text-white hover:bg-brand-dark transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
