"use client";

import { type ComponentType } from "react";
import { SignupProvider, useSignup } from "../state/signup.context";
import type { SignupStep } from "../state/signup.types";
import { DoneStep } from "./steps/DoneStep";
import { EmailStep } from "./steps/EmailStep";
import { InviteStep } from "./steps/InviteStep";
import { LoadingStep } from "./steps/LoadingStep";
import { ProfileStep } from "./steps/ProfileStep";
import { RoleStep } from "./steps/RoleStep";
import { TeamStep } from "./steps/TeamStep";

/**
 * Each step owns its full-screen layout (the signup screen and the onboarding
 * scenes differ), so the wizard simply renders the active step.
 */
const STEP_COMPONENTS: Record<SignupStep, ComponentType> = {
  email: EmailStep,
  loading: LoadingStep,
  profile: ProfileStep,
  role: RoleStep,
  team: TeamStep,
  invite: InviteStep,
  done: DoneStep,
};

function WizardBody() {
  const { state } = useSignup();
  const StepComponent = STEP_COMPONENTS[state.step];

  return (
    <div key={state.step} className="animate-fade-up">
      <StepComponent />
    </div>
  );
}

export function SignupWizard() {
  return (
    <SignupProvider>
      <WizardBody />
    </SignupProvider>
  );
}
