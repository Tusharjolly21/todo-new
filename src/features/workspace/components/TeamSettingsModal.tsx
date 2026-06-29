"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { TeamRef } from "../types";

interface TeamSettingsModalProps {
  open: boolean;
  onClose: () => void;
  team: TeamRef;
  onDelete: (id: string) => void;
  onLeave?: (id: string) => void;
}

const CONSEQUENCES = [
  "All team projects, tasks, comments, and their files will be deleted",
  "All members will lose access to the team workspace and everything in it",
  "Any team subscription will be canceled and credits left lost",
];

export function TeamSettingsModal({
  open,
  onClose,
  team,
  onDelete,
  onLeave,
}: TeamSettingsModalProps) {
  const [stage, setStage] = useState<"settings" | "delete">("settings");
  const [name, setName] = useState(team.name);
  const [discovery, setDiscovery] = useState(false);
  const [prohibitGuests, setProhibitGuests] = useState(true);
  const [sure, setSure] = useState(false);

  useEffect(() => {
    if (open) {
      setStage("settings");
      setName(team.name);
      setSure(false);
    }
  }, [open, team.name]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const domain = `${team.name.toLowerCase().replace(/\s+/g, "")}.club`;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-black/40 p-6 pt-[10vh]"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 pb-3 pt-5">
          <div className="flex items-center gap-2">
            {stage === "delete" && (
              <button
                onClick={() => setStage("settings")}
                aria-label="Back"
                className="text-neutral-500 hover:text-[#202020]"
              >
                ←
              </button>
            )}
            <h2 className="text-lg font-bold text-[#202020]">
              {stage === "delete" ? "Delete team" : "Team settings"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-neutral-400 hover:text-neutral-600"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {stage === "settings" ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm text-[#202020] outline-none focus:border-brand"
              />
              <p className="mt-1.5 text-sm text-neutral-500">
                Keep it something simple your teammates will recognize
              </p>

              {/* Security */}
              <h3 className="mt-6 text-base font-bold text-[#202020]">
                Security
              </h3>
              <label className="mt-3 block text-sm font-bold text-[#202020]">
                Team domain
              </label>
              <input
                readOnly
                placeholder={domain}
                className="mt-2 w-full rounded-md border border-neutral-300 px-3 py-2.5 text-sm text-neutral-500 outline-none"
              />
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                Your team domain is the suffix of your company email address.{" "}
                <span className="text-brand">Learn more</span>.
              </p>

              <p className="mt-4 text-sm font-bold text-[#202020]">
                Team Discovery
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <Toggle
                  checked={discovery}
                  onChange={() => setDiscovery((v) => !v)}
                />
                <span className="text-sm text-neutral-500">
                  {discovery ? "On" : "Off"}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Anyone with the same email domain will be able to find and
                automatically join the team.
              </p>

              <p className="mt-4 text-sm font-bold text-[#202020]">
                Prohibit external guests
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <Toggle
                  checked={prohibitGuests}
                  onChange={() => setProhibitGuests((v) => !v)}
                />
                <span className="text-sm text-neutral-500">
                  {prohibitGuests ? "On" : "Off"}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Disable inviting people outside of your team to projects as
                guests.
              </p>

              {/* Danger zone */}
              <div className="mt-6 border-t border-neutral-100 pt-5">
                <h3 className="text-base font-bold text-[#202020]">
                  Danger zone
                </h3>

                <p className="mt-4 text-sm font-bold text-[#202020]">
                  Leave team
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  By leaving, you&apos;ll immediately lose access to all{" "}
                  <span className="font-bold text-[#202020]">{team.name}</span>{" "}
                  team projects. You&apos;ll need to be re-invited to join
                  again.
                </p>
                <button
                  onClick={() => {
                    onLeave?.(team.id);
                    onClose();
                  }}
                  className="mt-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Leave team
                </button>

                <p className="mt-5 text-sm font-bold text-[#202020]">
                  Delete team
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  This will immediately and permanently delete the{" "}
                  <span className="font-bold text-[#202020]">{team.name}</span>{" "}
                  team and its data for everyone – including all projects and
                  tasks. This cannot be undone.{" "}
                  <span className="text-brand">Learn more</span>.
                </p>
                <button
                  onClick={() => {
                    setSure(false);
                    setStage("delete");
                  }}
                  className="mt-2 rounded-md border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Delete team
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-[#202020]">
                Are you sure you want to delete the “{team.name}” team
                permanently?
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                This cannot be undone.{" "}
                <span className="text-brand">Learn more</span>.
              </p>

              <ul className="mt-4 space-y-3">
                {CONSEQUENCES.map((c) => (
                  <li
                    key={c}
                    className="flex items-start gap-2.5 text-sm text-[#404040]"
                  >
                    <CircleX /> <span>{c}</span>
                  </li>
                ))}
              </ul>

              <label className="mt-5 flex cursor-pointer items-center gap-2.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={sure}
                  onClick={() => setSure((v) => !v)}
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border",
                    sure
                      ? "border-brand bg-brand text-white"
                      : "border-neutral-300",
                  )}
                >
                  {sure && <CheckMini />}
                </button>
                <span className="text-sm text-[#202020]">
                  Yes, I&apos;m absolutely sure.
                </span>
              </label>

              <button
                disabled={!sure}
                onClick={() => {
                  onDelete(team.id);
                  onClose();
                }}
                className={cn(
                  "mt-5 rounded-md px-4 py-2 text-sm font-semibold text-white transition",
                  sure
                    ? "bg-brand hover:bg-brand-dark"
                    : "cursor-not-allowed bg-brand/50",
                )}
              >
                Delete team
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition",
        checked ? "bg-green-600" : "bg-neutral-300",
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
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
function CircleX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="mt-0.5 shrink-0 text-red-500"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 9l6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckMini() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l5 5L20 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
