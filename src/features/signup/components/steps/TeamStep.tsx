"use client";

import { useState, type FormEvent } from "react";
import { Button, TextField } from "@/components/ui";
import { teamNameSchema, validateField } from "@/lib/validations/auth.schema";
import { useSignup } from "../../state/signup.context";
import { OnboardingScene } from "../OnboardingScene";
import { TeamIllustration } from "../previews/illustrations";

export function TeamStep() {
  const { state, dispatch } = useSignup();
  const [error, setError] = useState<string | null>(null);
  const { teamName } = state.data;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = validateField(teamNameSchema, teamName);
    if (message) {
      setError(message);
      return;
    }
    dispatch({ type: "NEXT" });
  }

  return (
    <OnboardingScene
      stepLabel="Step 3 of 4"
      preview={<TeamIllustration className="mx-auto w-full max-w-[420px]" />}
    >
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202020]">
        Create a team
      </h1>
      <p className="mt-4 text-base text-neutral-500">
        We&apos;ll set up a shared workspace for your team&apos;s projects
        alongside your personal ones.
      </p>

      <form className="mt-8 space-y-3" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Team name"
          autoFocus
          placeholder="e.g., Awesome Inc."
          value={teamName}
          error={error}
          hint={
            error
              ? undefined
              : "Keep it something simple your teammates will recognize."
          }
          onChange={(e) => {
            dispatch({ type: "SET_TEAM_NAME", teamName: e.target.value });
            if (error) setError(null);
          }}
        />
        <Button type="submit" fullWidth size="lg" className="py-3.5">
          Continue
        </Button>
        <Button
          type="button"
          variant="secondary"
          fullWidth
          size="lg"
          className="border-0 bg-neutral-100 py-3.5 hover:bg-neutral-200"
          onClick={() => dispatch({ type: "NEXT" })}
        >
          Skip for now
        </Button>
      </form>
    </OnboardingScene>
  );
}
