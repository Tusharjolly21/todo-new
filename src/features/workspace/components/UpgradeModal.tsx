"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Optional contextual heading (e.g. when triggered from a locked feature). */
  title?: string;
  subtitle?: string;
}

type Cycle = "yearly" | "monthly";

const PRICES: Record<
  Cycle,
  { perMonth: number; perYear: number; save?: number }
> = {
  yearly: { perMonth: 6, perYear: 72, save: 24 },
  monthly: { perMonth: 8, perYear: 96 },
};

const BUSINESS_PERKS = [
  "Up to 500 team projects",
  "Calendar layout",
  "Admin & member roles",
  "Security controls & permissions",
  "Every member gets Pro features like reminders and durations",
];

export function UpgradeModal({
  open,
  onClose,
  title = "Upgrade your team",
  subtitle = "Unlock reminders, calendar layout and more for you and your team.",
}: UpgradeModalProps) {
  const [cycle, setCycle] = useState<Cycle>("yearly");
  const [stage, setStage] = useState<"pricing" | "checkout" | "success">(
    "pricing",
  );
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [country, setCountry] = useState("DE");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset stage when modal closes or opens
  useEffect(() => {
    if (!open) {
      setStage("pricing");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setCardName("");
    }
  }, [open]);

  if (!open) return null;

  const itemCost =
    cycle === "yearly" ? PRICES.yearly.perYear : PRICES.monthly.perMonth;
  const cycleLabel = cycle === "yearly" ? "year" : "month";
  const tax = Number((itemCost * 0.19).toFixed(2));
  const total = Number((itemCost + tax).toFixed(2));

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-3xl animate-pop-in overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: plan + checkout */}
        <div className="flex-1 p-7 overflow-y-auto max-h-[550px]">
          {stage === "pricing" && (
            <div className="animate-fade-up">
              <h2 className="text-xl font-bold text-[#202020]">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                {subtitle}
              </p>

              <p className="mt-6 text-sm font-bold text-[#202020]">
                Billing cycle
              </p>
              <button
                onClick={() => setCycle("yearly")}
                className={cn(
                  "mt-2 flex w-full items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition",
                  cycle === "yearly" ? "border-brand" : "border-neutral-200",
                )}
              >
                <span>
                  <span className="block text-sm font-semibold text-[#202020]">
                    Yearly
                  </span>
                  <span className="text-sm text-neutral-500">
                    {PRICES.yearly.perMonth} € / member / month
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                      SAVE {PRICES.yearly.save} €
                    </span>
                  </span>
                </span>
                {cycle === "yearly" && <CheckIcon />}
              </button>

              <button
                onClick={() =>
                  setCycle(cycle === "yearly" ? "monthly" : "yearly")
                }
                className="mt-2 text-sm font-medium text-[#202020] underline hover:text-brand transition"
              >
                More options
              </button>

              <div className="mt-3">
                <div className="flex items-center justify-between rounded-md border border-neutral-300 px-3 py-2.5 text-sm text-[#202020]">
                  Euro (EUR)
                  <Chevron />
                </div>
                <p className="mt-1.5 text-xs text-neutral-400">
                  You cannot change your currency after upgrading.
                </p>
              </div>

              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="text-sm text-[#202020]">
                  You&apos;ll be charged{" "}
                  <span className="font-bold">{itemCost} €</span> per member per{" "}
                  {cycleLabel} for <span className="font-bold">1 member</span> (
                  {itemCost} €).
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  Applicable taxes will be calculated at checkout.
                </p>
                <button
                  onClick={() => setStage("checkout")}
                  className="mt-4 w-full rounded-md bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark transition"
                >
                  Continue to checkout
                </button>
              </div>
            </div>
          )}

          {stage === "checkout" && (
            <div className="animate-fade-up">
              <h2 className="text-xl font-bold text-[#202020]">
                Billing Checkout
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                Complete payment for Business Plan ({cycleLabel} billing).
              </p>

              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStage("success");
                }}
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">
                    Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 1234 5678"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(
                        e.target.value
                          .replace(/\s?/g, "")
                          .replace(/(\d{4})/g, "$1 ")
                          .trim(),
                      )
                    }
                    maxLength={19}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      Expiration
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      maxLength={5}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-600">
                      CVV
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-600">
                    Country / Region
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                  >
                    <option value="US">United States</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>

                <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-600 space-y-1 border border-neutral-100">
                  <div className="flex justify-between">
                    <span>
                      Business Plan subscription ({cycleLabel} billing)
                    </span>
                    <span>{itemCost.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (19%)</span>
                    <span>{tax.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-neutral-200 pt-1.5 text-neutral-800 text-sm">
                    <span>Total Charged</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setStage("pricing")}
                    className="flex-1 rounded-md bg-neutral-100 py-2.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-200 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-md bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition"
                  >
                    Pay {total.toFixed(2)} €
                  </button>
                </div>
              </form>
            </div>
          )}

          {stage === "success" && (
            <div className="text-center py-6 animate-fade-up">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 12.5l4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#202020]">
                Upgrade Complete!
              </h2>
              <p className="mt-3 text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">
                Thank you for upgrading. Your workspace is now activated on the{" "}
                <span className="font-bold">Business plan</span>.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-md bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition"
              >
                Start planning
              </button>
            </div>
          )}
        </div>

        {/* Right: perks */}
        <div className="relative hidden w-[44%] shrink-0 bg-[#fbf3ee] p-7 sm:block">
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-600"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <PerksIllustration className="mx-auto mt-2 w-44" />

          <h3 className="mt-6 text-lg font-bold text-[#202020]">
            What you get on the Business plan
          </h3>
          <ul className="mt-4 space-y-3">
            {BUSINESS_PERKS.map((perk) => (
              <li
                key={perk}
                className="flex items-start gap-2.5 text-sm text-neutral-700"
              >
                <span className="mt-0.5 text-green-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 12.5l4.5 4.5L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {perk}
              </li>
            ))}
          </ul>
          <button className="mt-5 text-sm font-medium text-[#202020] underline hover:text-brand">
            Learn more
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5l4.5 4.5L19 7"
        stroke="#171717"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-neutral-500"
    >
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Original flat "building blocks" illustration for the upgrade pane. */
function PerksIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 130"
      fill="none"
      role="img"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="112" rx="84" ry="12" fill="#e4ebe0" />
      <path d="M40 112l50-26 70 14-50 26z" fill="#cdd8c6" />
      <rect x="58" y="48" width="34" height="40" rx="3" fill="#f5f5f5" />
      <rect x="58" y="40" width="34" height="10" rx="2" fill="#171717" />
      <rect x="96" y="58" width="40" height="34" rx="3" fill="#f3c14b" />
      <path d="M96 58l20-12 40 8-20 12z" fill="#fadf9b" />
      <rect x="140" y="64" width="26" height="30" rx="3" fill="#cdd8c6" />
      <circle cx="120" cy="100" r="7" fill="#171717" />
      <circle cx="74" cy="34" r="4" fill="#f3c14b" />
      <path
        d="M150 50c4-6 10-6 12 0"
        stroke="#9bb38f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
