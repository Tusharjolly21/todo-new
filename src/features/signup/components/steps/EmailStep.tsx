"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Button,
  Divider,
  SocialAuthButtons,
  TextField,
  Wordmark,
} from "@/components/ui";
import { siteConfig } from "@/config/site";
import {
  emailSchema,
  passwordSchema,
  validateField,
} from "@/lib/validations/auth.schema";
import { useSignup } from "../../state/signup.context";
import { SocialProofPanel } from "../SocialProofPanel";
import { StepShell } from "../StepShell";

export function EmailStep() {
  const { state, dispatch } = useSignup();
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const emailMessage = validateField(emailSchema, state.data.email);
    const passwordMessage = validateField(passwordSchema, state.data.password);
    setError(emailMessage);
    setPasswordError(passwordMessage);
    if (emailMessage || passwordMessage) return;
    dispatch({ type: "NEXT" });
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <header className="px-6 py-6 sm:px-12">
        <Wordmark />
      </header>
      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-16 lg:grid-cols-2">
        {/* Left: form */}
        <div className="mx-auto w-full max-w-md">
          <StepShell title="Sign up">
            <SocialAuthButtons />

            <div className="my-5">
              <Divider />
            </div>

            <form className="space-y-3" onSubmit={handleSubmit} noValidate>
              <TextField
                label="Email"
                type="email"
                autoFocus
                autoComplete="email"
                placeholder="Enter your email…"
                value={state.data.email}
                error={error}
                onChange={(e) => {
                  dispatch({ type: "SET_EMAIL", email: e.target.value });
                  if (error) setError(null);
                }}
              />
              <div className="relative">
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password…"
                  value={state.data.password}
                  error={passwordError}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_PASSWORD",
                      password: e.target.value,
                    });
                    if (passwordError) setPasswordError(null);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-[30px] rounded p-1 text-neutral-400 transition hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <Button type="submit" fullWidth>
                Sign up with Email
              </Button>
            </form>

            <p className="mt-4 text-xs leading-relaxed text-neutral-500">
              By continuing with Google, Apple, or Email, you agree to
              Todo&apos;s <span className="underline">Terms of Service</span>{" "}
              and <span className="underline">Privacy Policy</span>.
            </p>

            <div className="mt-5 border-t border-neutral-200 pt-5 text-center text-sm">
              Already signed up?{" "}
              <Link
                href={siteConfig.routes.login}
                className="font-semibold text-brand hover:underline"
              >
                Go to login
              </Link>
            </div>
          </StepShell>
        </div>

        {/* Right: social proof (desktop only) */}
        <div className="hidden lg:block">
          <SocialProofPanel />
        </div>
      </div>
    </main>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 004.2 4.2M9.9 5.2A9.5 9.5 0 0112 5c6.5 0 10 7 10 7a13.2 13.2 0 01-2.4 3.1M6.1 6.1A13.3 13.3 0 002 12s3.5 7 10 7a9.3 9.3 0 004-.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
