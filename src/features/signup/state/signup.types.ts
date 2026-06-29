/**
 * Domain types for the signup flow. Kept free of React/UI concerns so the
 * reducer stays a pure, testable function over plain data.
 */

export type SignupStep =
  "email" | "loading" | "profile" | "role" | "team" | "invite" | "done";

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
  photoDataUrl: string | null;
  role: string;
  extraHelp: boolean;
  teamName: string;
  invites: string[];
}

export interface SignupState {
  step: SignupStep;
  data: SignupData;
}

export type SignupAction =
  | { type: "SET_EMAIL"; email: string }
  | { type: "SET_PASSWORD"; password: string }
  | { type: "SET_FULL_NAME"; fullName: string }
  | { type: "SET_PHOTO"; photoDataUrl: string | null }
  | { type: "SET_ROLE"; role: string }
  | { type: "SET_EXTRA_HELP"; extraHelp: boolean }
  | { type: "SET_TEAM_NAME"; teamName: string }
  | { type: "SET_INVITE"; index: number; email: string }
  | { type: "ADD_INVITE_ROW" }
  | { type: "GO_TO"; step: SignupStep }
  | { type: "NEXT" }
  | { type: "BACK" };
