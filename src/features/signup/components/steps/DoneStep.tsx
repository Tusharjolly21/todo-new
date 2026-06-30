"use client";

import { useRouter } from "next/navigation";
import { Button, Wordmark } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { useSignup } from "../../state/signup.context";

export function DoneStep() {
  const router = useRouter();
  const { state } = useSignup();
  const { fullName, teamName } = state.data;
  const firstName = fullName.trim().split(/\s+/)[0];

  const subtitle = teamName
    ? `${teamName} workspace is ready. Let's add your first task.`
    : "Your workspace is ready. Let's add your first task.";

  return (
    <main className="flex min-h-dvh flex-col">
      <header className="px-6 py-6 sm:px-12">
        <Wordmark />
      </header>
      <div className="flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M5 12.5l4.5 4.5L19 7"
                stroke="#171717"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            You&apos;re all set{firstName ? `, ${firstName}` : ""}!
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-neutral-500">{subtitle}</p>
          <div className="mt-8">
            <Button
              fullWidth
              size="lg"
              className="py-3.5"
              onClick={() => router.push(siteConfig.routes.app)}
            >
              Go to my tasks
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
