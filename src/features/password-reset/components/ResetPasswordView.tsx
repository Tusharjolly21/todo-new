"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, TextField, Wordmark } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { emailSchema, validateField } from "@/lib/validations/auth.schema";
import { SecurityIllustration } from "./SecurityIllustration";

type ResetStage = "form" | "sent";

export function ResetPasswordView() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<ResetStage>("form");
  const [countdown, setCountdown] = useState(60);
  const [resendSent, setResendSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const message = validateField(emailSchema, email);
    if (message) {
      setError(message);
      return;
    }
    setStage("sent");
    setCountdown(60);
  }

  // Handle countdown timer for resend
  useEffect(() => {
    if (stage !== "sent") return;
    const interval = setInterval(() => {
      setCountdown((c) => (c <= 0 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <main className="flex min-h-dvh flex-col">
      <header className="px-6 py-6 sm:px-12">
        <Wordmark />
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-16 lg:grid-cols-2">
        {/* Left: content */}
        <div className="mx-auto w-full max-w-md">
          {stage === "form" ? (
            <>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#202020]">
                Forgot your password?
              </h1>
              <p className="mt-5 text-base text-neutral-500">
                To reset your password, please enter the email address of your
                Todo account.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                <TextField
                  label="Email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  error={error}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />
                <Button type="submit" fullWidth size="lg" className="py-3.5">
                  Reset my password
                </Button>
              </form>
            </>
          ) : (
            <div className="text-left animate-fade-up">
              {/* Envelope illustration inside success state */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 6l-10 7L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#202020]">
                Check your email
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-500">
                An email has been sent to{" "}
                <span className="font-bold text-neutral-800">{email}</span> with
                a link to reset your password. Please click the link to confirm.
              </p>
              <p className="mt-2 text-sm text-neutral-400">
                If you don't see it, check your spam/junk folder.
              </p>

              {/* Mail client quick-links */}
              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-md bg-[#db4437] py-2.5 text-sm font-semibold text-white transition hover:bg-[#c53929]"
                >
                  Open Gmail
                </a>
                <a
                  href="https://outlook.live.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-md bg-[#0078d4] py-2.5 text-sm font-semibold text-white transition hover:bg-[#006cc1]"
                >
                  Open Outlook
                </a>
              </div>

              {/* Resend actions */}
              <div className="mt-6 border-t border-neutral-100 pt-5 text-center">
                {countdown > 0 ? (
                  <p className="text-xs text-neutral-400">
                    You can resend the link in{" "}
                    <span className="font-bold">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      setCountdown(60);
                      setResendSent(true);
                      setTimeout(() => setResendSent(false), 4000);
                    }}
                    className="text-sm font-bold text-brand hover:underline"
                  >
                    Resend reset link
                  </button>
                )}
                {resendSent && (
                  <p className="mt-2 text-xs text-green-600 font-semibold">
                    New reset link sent successfully!
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-neutral-200 pt-5 text-center">
            <Link
              href={siteConfig.routes.login}
              className="text-sm font-medium text-neutral-600 underline transition hover:text-[#202020]"
            >
              Go to login
            </Link>
          </div>
        </div>

        {/* Right: illustration (desktop only) */}
        <div className="hidden lg:block">
          <SecurityIllustration className="mx-auto w-full max-w-[440px]" />
        </div>
      </div>
    </main>
  );
}
