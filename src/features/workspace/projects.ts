import { ProjectRef } from "./types";

export interface ProjectColor {
  name: string;
  value: string;
}

export const PROJECT_COLORS: ProjectColor[] = [
  { name: "Mint Green", value: "#2de0a5" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Sky Blue", value: "#0ea5e9" },
  { name: "Light Blue", value: "#60a5fa" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Grape", value: "#8b5cf6" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Lavender", value: "#c084fc" },
  { name: "Magenta", value: "#d6409f" },
  { name: "Salmon", value: "#f43f5e" },
  { name: "Charcoal", value: "#4b5563" },
];

export const DEFAULT_PROJECTS: ProjectRef[] = [
  {
    id: "inbox",
    name: "Inbox",
    icon: "inbox",
    group: "favorites",
    layout: "list",
    favorite: false,
    archived: false,
  },
  {
    id: "my-work",
    name: "My work",
    icon: "hash",
    emoji: "🎯",
    color: "#eab308",
    colorName: "Yellow",
    group: "my",
    layout: "list",
    favorite: false,
    archived: false,
  },
  {
    id: "home",
    name: "Home",
    icon: "hash",
    emoji: "🏡",
    color: "#22c55e",
    colorName: "Mint Green",
    group: "my",
    layout: "list",
    favorite: false,
    archived: false,
  },
];

export const PROJECTS = DEFAULT_PROJECTS;

export function getProject(id: string): ProjectRef {
  return PROJECTS.find((p) => p.id === id) ?? PROJECTS[0];
}

export const DEFAULT_PROJECT_ID = "inbox";

export function getProjectColor(colorName?: string): string {
  if (!colorName) return "#4b5563";
  return (
    PROJECT_COLORS.find((c) => c.name.toLowerCase() === colorName.toLowerCase())
      ?.value ?? "#4b5563"
  );
}
