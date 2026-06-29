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
import { DevicesIllustration } from "./DevicesIllustration";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const emailMessage = validateField(emailSchema, email);
    const passwordMessage = validateField(passwordSchema, password);
    setEmailError(emailMessage);
    setPasswordError(passwordMessage);
    // Backend auth lands later.
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <header className="px-6 py-6 sm:px-12">
        <Wordmark />
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-12 px-6 pb-16 lg:grid-cols-2">
        {/* Left: form */}
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#202020]">
            Log in
          </h1>

          <div className="mt-6">
            <SocialAuthButtons />
          </div>

          <div className="my-5">
            <Divider />
          </div>

          <form className="space-y-3" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email…"
              value={email}
              error={emailError}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
            />
            <div className="relative">
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password…"
                value={password}
                error={passwordError}
                onChange={(e) => {
                  setPassword(e.target.value);
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
            <Button type="submit" fullWidth className="py-3.5">
              Log in
            </Button>
          </form>

          <Link
            href={siteConfig.routes.forgotPassword}
            className="mt-4 inline-block text-sm text-[#202020] underline hover:text-brand"
          >
            Forgot your password?
          </Link>

          <p className="mt-4 text-xs leading-relaxed text-neutral-500">
            By continuing with Google, Apple, or Email, you agree to Todo&apos;s{" "}
            <span className="underline">Terms of Service</span> and{" "}
            <span className="underline">Privacy Policy</span>.
          </p>

          <div className="mt-5 border-t border-neutral-200 pt-5 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={siteConfig.routes.signup}
              className="font-semibold text-brand hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* Right: illustration (desktop only) */}
        <div className="hidden lg:block">
          <DevicesIllustration className="mx-auto w-full max-w-[440px]" />
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
