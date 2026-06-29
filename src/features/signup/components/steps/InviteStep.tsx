"use client";

import { Button, TextField } from "@/components/ui";
import { useSignup } from "../../state/signup.context";
import { OnboardingScene } from "../OnboardingScene";
import { InviteIllustration } from "../previews/illustrations";

export function InviteStep() {
  const { state, dispatch } = useSignup();
  const { invites } = state.data;

  return (
    <OnboardingScene
      stepLabel="Step 4 of 4"
      preview={<InviteIllustration className="mx-auto w-full max-w-[420px]" />}
    >
      <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202020]">
        Invite people to your team
      </h1>
      <p className="mt-4 text-base text-neutral-500">
        Members will be able to browse and join team projects. (You can create
        private ones, too.)
      </p>

      <div className="mt-8 space-y-2.5">
        {invites.map((value, index) => (
          <TextField
            key={index}
            label="Email"
            type="email"
            placeholder="name@example.com"
            value={value}
            onChange={(e) =>
              dispatch({ type: "SET_INVITE", index, email: e.target.value })
            }
          />
        ))}
        <button
          type="button"
          onClick={() => dispatch({ type: "ADD_INVITE_ROW" })}
          className="pt-1 text-sm font-bold text-brand transition hover:underline"
        >
          + Add email
        </button>
      </div>

      <div className="mt-6 space-y-2.5">
        <Button
          fullWidth
          size="lg"
          className="py-3.5"
          onClick={() => dispatch({ type: "NEXT" })}
        >
          Continue
        </Button>
        <Button
          variant="secondary"
          fullWidth
          size="lg"
          className="border-0 bg-neutral-100 py-3.5 hover:bg-neutral-200"
          onClick={() => dispatch({ type: "NEXT" })}
        >
          Copy invite link
        </Button>
        <Button
          variant="secondary"
          fullWidth
          size="lg"
          className="border-0 bg-neutral-100 py-3.5 hover:bg-neutral-200"
          onClick={() => dispatch({ type: "NEXT" })}
        >
          Skip for now
        </Button>
      </div>
    </OnboardingScene>
  );
}
