"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface TourStep {
  selector: string;
  title: string;
  description: string;
  placement: "bottom" | "right" | "top";
}

const TOUR_STEPS: TourStep[] = [
  {
    selector: "#sidebar-inbox",
    title: "Your Inbox 📬",
    description:
      "This is where all your quick thoughts and personal tasks land. Try starting here!",
    placement: "right",
  },
  {
    selector: "#sidebar-add-task",
    title: "Create a Task 📝",
    description:
      "Click this button (or press 'Q') to write a task name, add priorities, labels, and set reminders.",
    placement: "right",
  },
  {
    selector: "#sidebar-setup-team",
    title: "Shared Workspaces 🤝",
    description:
      "Organize projects, assign checklist tasks to team members, and track targets together.",
    placement: "right",
  },
];

export function ProductTour() {
  const [activeStep, setActiveStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  // Trigger tour if user hasn't completed it
  useEffect(() => {
    const tourDone = localStorage.getItem("todo_tour_completed");
    if (!tourDone) {
      // Delay slightly to allow DOM layout to render fully
      const t = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    const findTarget = () => {
      const step = TOUR_STEPS[activeStep];
      let el: HTMLElement | null = null;

      // Selectors search
      if (step.selector.includes("contains")) {
        const text = step.selector.match(/"([^"]+)"/)?.[1] || "";
        const buttons = Array.from(document.querySelectorAll("button, a"));
        el =
          (buttons.find((b) => b.textContent?.includes(text)) as HTMLElement) ||
          null;
      } else {
        el = document.querySelector(step.selector) as HTMLElement;
      }

      if (el) {
        const rect = el.getBoundingClientRect();
        if (step.placement === "right") {
          setCoords({
            top: rect.top + rect.height / 2 - 60 + window.scrollY,
            left: rect.right + 12 + window.scrollX,
          });
        } else if (step.placement === "bottom") {
          setCoords({
            top: rect.bottom + 12 + window.scrollY,
            left: rect.left + rect.width / 2 - 130 + window.scrollX,
          });
        } else {
          setCoords({
            top: rect.top - 140 + window.scrollY,
            left: rect.left + rect.width / 2 - 130 + window.scrollX,
          });
        }
      } else {
        // Fallback to center panel positioning if elements are hidden
        setCoords({
          top: window.innerHeight / 2 - 70,
          left: window.innerWidth / 2 - 140,
        });
      }
    };

    findTarget();
    window.addEventListener("resize", findTarget);
    return () => window.removeEventListener("resize", findTarget);
  }, [activeStep, visible]);

  if (!visible || !coords) return null;

  const current = TOUR_STEPS[activeStep];

  const handleNext = () => {
    if (activeStep < TOUR_STEPS.length - 1) {
      setActiveStep((s) => s + 1);
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
    setVisible(false);
    localStorage.setItem("todo_tour_completed", "true");
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[100]">
      {/* Light spotlight background filter */}
      <div
        className="fixed inset-0 bg-black/10 pointer-events-auto"
        onClick={handleSkip}
      />

      {/* Floating Tooltip Card */}
      <div
        role="dialog"
        className="absolute w-[280px] bg-white rounded-xl border border-neutral-200 p-4.5 shadow-2xl animate-pop-in pointer-events-auto border-t-brand border-t-4"
        style={{
          top: coords.top,
          left: coords.left,
        }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-brand uppercase tracking-wider">
            Quick Tour · {activeStep + 1} of {TOUR_STEPS.length}
          </span>
          <button
            onClick={handleSkip}
            className="text-neutral-400 hover:text-neutral-600 font-bold text-xs"
            aria-label="Skip tour"
          >
            Skip
          </button>
        </div>
        <h4 className="text-sm font-bold text-[#202020]">{current.title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
          {current.description}
        </p>

        <div className="mt-4 flex justify-between items-center border-t border-neutral-100 pt-3">
          <button
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            disabled={activeStep === 0}
            className={cn(
              "text-xs font-semibold text-neutral-400 transition hover:text-neutral-600",
              activeStep === 0 && "opacity-0 cursor-default",
            )}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="rounded bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark transition"
          >
            {activeStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
