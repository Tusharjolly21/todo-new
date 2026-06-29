/** Workspace members available for task assignment. */

export interface Member {
  id: string;
  name: string;
  color: string;
}

export const MEMBERS: Member[] = [
  { id: "me", name: "Bertrand", color: "#22c55e" },
  { id: "ana", name: "Ana Ruiz", color: "#f59e0b" },
  { id: "kai", name: "Kai Tan", color: "#3b82f6" },
  { id: "mira", name: "Mira Singh", color: "#d6409f" },
];

export function getMember(id: string | null | undefined): Member | null {
  if (!id) return null;
  return MEMBERS.find((m) => m.id === id) ?? null;
}

export function memberInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
