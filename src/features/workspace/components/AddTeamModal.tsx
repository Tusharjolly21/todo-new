"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface AddTeamModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  /** Email domain used in the Team Discovery hint. */
  domain?: string;
}

const PERKS = [
  "Get a shared workspace for team projects",
  "Easily share work via links",
  "Filter personal from team tasks",
  "Control access to team data",
  "Centralize member management",
];

export function AddTeamModal({
  open,
  onClose,
  onCreate,
  domain = "@nicelydone.club",
}: AddTeamModalProps) {
  const [name, setName] = useState("");
  const [discovery, setDiscovery] = useState(false);
  const [invites, setInvites] = useState("");
  const [verified, setVerified] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (open) {
      setName("");
      setDiscovery(false);
      setInvites("");
      setVerified(false);
      setSent(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const canSubmit = name.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl animate-pop-in overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: form */}
        <div className="flex-1 p-7">
          <h2 className="text-xl font-bold text-[#202020]">Add a team</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            Each team comes with 5 free projects. Upgrade as your needs grow.{" "}
            <span className="font-bold text-[#202020]">
              Each team is billed separately.
            </span>
          </p>

          {/* Team name */}
          <label className="mt-6 block text-sm font-bold text-[#202020]">
            Team name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="The name of your team or company"
            onKeyDown={(e) => {
              if (e.key === "Enter" && canSubmit) {
                onCreate(name.trim());
                onClose();
              }
            }}
            className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm text-[#202020] outline-none focus:border-brand placeholder:text-neutral-400"
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            Keep it something simple your teammates will recognize.
          </p>

          {/* Verify-email alert (gates Team Discovery) */}
          {!verified && (
            <div className="mt-4 flex items-start gap-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                <InfoFilled />
              </span>
              <p className="leading-relaxed">
                {sent
                  ? "Verification email sent. Check your inbox to enable Team Discovery."
                  : "Verify your email address to enable Team Discovery."}{" "}
                {!sent && (
                  <button
                    type="button"
                    onClick={() => {
                      setSent(true);
                      // Simulate the verification completing.
                      setTimeout(() => setVerified(true), 600);
                    }}
                    className="font-medium text-brand hover:underline"
                  >
                    Send verification email
                  </button>
                )}
              </p>
            </div>
          )}

          {/* Team Discovery */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={discovery}
              disabled={!verified}
              onClick={() => setDiscovery((v) => !v)}
              className={cn(
                "flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition",
                discovery ? "bg-brand" : "bg-neutral-300",
                !verified && "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full bg-white shadow transition-transform",
                  discovery && "translate-x-5",
                )}
              />
            </button>
            <span className="text-sm font-bold text-[#202020]">
              Team Discovery
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-neutral-500">
            Anyone with the{" "}
            <span className="font-bold text-[#202020]">{domain}</span> email
            address can automatically join your team.{" "}
            <span className="font-medium text-brand">
              Billing applies upon upgrade.
            </span>
          </p>

          {/* Invite members */}
          <label className="mt-5 block text-sm font-bold text-[#202020]">
            Invite members
          </label>
          <textarea
            value={invites}
            onChange={(e) => setInvites(e.target.value)}
            rows={3}
            placeholder="Type or paste emails separated by commas."
            className="mt-2 w-full resize-none rounded-md border border-neutral-300 px-3 py-2.5 text-sm text-[#202020] outline-none focus:border-brand placeholder:text-neutral-400"
          />

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => {
              onCreate(name.trim());
              onClose();
            }}
            className={cn(
              "mt-4 w-full rounded-md py-2.5 text-sm font-semibold text-white transition",
              canSubmit
                ? "bg-brand hover:bg-brand-dark"
                : "cursor-not-allowed bg-brand/50",
            )}
          >
            Add a team
          </button>

          <p className="mt-3 text-xs leading-relaxed text-neutral-500">
            By adding, you agree to our{" "}
            <span className="underline">Terms of Service</span> regarding team
            workspaces.
          </p>
        </div>

        {/* Right: benefits */}
        <div className="relative hidden w-[44%] shrink-0 bg-[#fdf8f0] p-7 md:block">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
          >
            <CloseIcon />
          </button>

          <TeamIllustration />

          <h3 className="mt-6 text-lg font-bold text-[#202020]">
            A home for your team&apos;s work
          </h3>
          <ul className="mt-4 space-y-3">
            {PERKS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2.5 text-sm text-[#404040]"
              >
                <CheckMini /> <span>{p}</span>
              </li>
            ))}
          </ul>
          <button className="mt-4 flex items-center gap-1.5 text-sm text-neutral-500 hover:text-[#202020]">
            <InfoMini /> <span className="underline">Learn more</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function TeamIllustration() {
  return (
    <svg
      width="100%"
      height="150"
      viewBox="0 0 320 170"
      fill="none"
      aria-hidden
    >
      {/* ground plane */}
      <path d="M160 38l120 64-120 64L40 102z" fill="#e7e6da" />
      <path d="M160 46l104 56-104 56L56 102z" fill="#eeeee4" />
      {/* pink tower */}
      <path d="M120 70l28-16v34l-28 16z" fill="#e8a7a0" />
      <path d="M120 70l28-16 18 10-28 16z" fill="#f0c4bf" />
      <path d="M138 90l28-16v34l-28 16z" fill="#dd9189" />
      {/* yellow building */}
      <path d="M168 56l34-20 22 12-34 20z" fill="#f4d06a" />
      <path d="M168 56l22 12v30l-22-12z" fill="#eab94a" />
      <path d="M190 68l34-20v30l-34 20z" fill="#f7dd8c" />
      {/* white house */}
      <path d="M214 86l24-14 18 10-24 14z" fill="#dfe7e0" />
      <path d="M214 86l18 10v22l-18-10z" fill="#cdd8cf" />
      <path d="M232 96l24-14v22l-24 14z" fill="#eef3ee" />
      {/* little figure */}
      <circle cx="150" cy="120" r="6" fill="#d4564a" />
      <path d="M144 132c0-4 3-7 6-7s6 3 6 7z" fill="#d4564a" />
      {/* dots */}
      <circle cx="100" cy="108" r="3" fill="#e8a7a0" />
      <circle cx="258" cy="74" r="3" fill="#9fc0d6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckMini() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0 text-green-600"
    >
      <path
        d="M5 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function InfoFilled() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function InfoMini() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 11v5M12 8h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
