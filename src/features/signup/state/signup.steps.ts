import type { SignupStep } from "./signup.types";

/**
 * Linear step graph for the wizard. `loading` is a transient step advanced by
 * an effect, not user action, so it is excluded from the progress indicator.
 */
export const STEP_ORDER: readonly SignupStep[] = [
  "email",
  "loading",
  "profile",
  "role",
  "team",
  "invite",
  "done",
];

/** Steps shown in the "Step N of 4" onboarding indicator. */
export const PROGRESS_STEPS: readonly SignupStep[] = [
  "profile",
  "role",
  "team",
  "invite",
];

export function getNextStep(current: SignupStep): SignupStep {
  const index = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.min(index + 1, STEP_ORDER.length - 1)];
}

export function getPreviousStep(current: SignupStep): SignupStep {
  const index = STEP_ORDER.indexOf(current);
  return STEP_ORDER[Math.max(index - 1, 0)];
}

/** 0-based index within the progress indicator, or -1 when not part of it. */
export function getProgressIndex(step: SignupStep): number {
  return PROGRESS_STEPS.indexOf(step);
}

export const TOTAL_PROGRESS_STEPS = PROGRESS_STEPS.length;
