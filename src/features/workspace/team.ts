/** The team workspace(s) the current user belongs to. */

export interface Team {
  id: string;
  name: string;
  /** Avatar background colour. */
  color: string;
}

export const TEAMS: Team[] = [
  { id: "nicelydone", name: "Nicelydone", color: "#d6409f" },
];

/** The team a project is moved into. First team for now (single-team app). */
export const CURRENT_TEAM: Team = TEAMS[0];

export function teamInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
