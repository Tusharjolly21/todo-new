import type { ReactNode } from "react";
import { Wordmark } from "@/components/ui";

interface OnboardingSceneProps {
  /** "Step N of 4" label shown in the preview pane. */
  stepLabel?: string;
  /** Left-hand form content. */
  children: ReactNode;
  /** Right-hand preview pane content (cream background, desktop only). */
  preview: ReactNode;
}

/**
 * Shared two-pane onboarding layout: white form pane on the left (logo
 * top-left), cream preview pane on the right with a step badge — matching
 * Todoist's onboarding screens.
 */
export function OnboardingScene({
  stepLabel,
  children,
  preview,
}: OnboardingSceneProps) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Left: form */}
      <div className="relative flex flex-col px-6 py-6 sm:px-12">
        <header>
          <Wordmark />
        </header>
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[420px] py-10">{children}</div>
        </div>
      </div>

      {/* Right: preview pane */}
      <div className="relative hidden items-center justify-center bg-[#fbf3ee] px-12 lg:flex">
        {stepLabel && (
          <span className="absolute right-10 top-8 rounded-md bg-[#f3e4d9] px-3 py-1.5 text-sm font-semibold text-[#7a5c48]">
            {stepLabel}
          </span>
        )}
        <div className="w-full max-w-[560px]">{preview}</div>
      </div>
    </div>
  );
}
