"use client";

import { Button, Select, Toggle } from "@/components/ui";
import { ROLE_OPTIONS } from "../../constants";
import { useSignup } from "../../state/signup.context";
import { OnboardingScene } from "../OnboardingScene";
import { CustomizeIllustration } from "../previews/illustrations";

export function RoleStep() {
  const { state, dispatch } = useSignup();
  const { role, extraHelp } = state.data;

  return (
    <OnboardingScene
      stepLabel="Step 2 of 4"
      preview={
        <CustomizeIllustration className="mx-auto w-full max-w-[420px]" />
      }
    >
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202020]">
        Customize your Todo
      </h1>

      <div className="mt-8 space-y-3">
        <Select
          label="Your role"
          options={ROLE_OPTIONS}
          placeholder="Select your role"
          value={role}
          onChange={(e) => dispatch({ type: "SET_ROLE", role: e.target.value })}
        />

        <div className="flex items-center justify-between rounded-md border border-neutral-300 px-3.5 py-3">
          <span className="text-sm text-[#202020]">
            I&apos;d like extra help setting up Todo
          </span>
          <Toggle
            checked={extraHelp}
            onChange={(checked) =>
              dispatch({ type: "SET_EXTRA_HELP", extraHelp: checked })
            }
            label="Extra help setting up Todo"
          />
        </div>

        <Button
          fullWidth
          size="lg"
          className="py-3.5"
          onClick={() => dispatch({ type: "NEXT" })}
        >
          Continue
        </Button>
      </div>
    </OnboardingScene>
  );
}
