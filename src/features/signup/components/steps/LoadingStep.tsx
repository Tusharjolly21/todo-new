"use client";

import { useEffect } from "react";
import { Spinner } from "@/components/ui";
import { LOADING_DURATION_MS } from "../../constants";
import { useSignup } from "../../state/signup.context";

/**
 * Transient step simulating account creation. Advances itself via a timer;
 * replaced by a real async mutation once the backend lands.
 */
export function LoadingStep() {
  const { dispatch } = useSignup();

  useEffect(() => {
    const timer = setTimeout(
      () => dispatch({ type: "NEXT" }),
      LOADING_DURATION_MS,
    );
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center text-center">
      <Spinner />
      <p className="mt-6 text-sm font-medium text-neutral-500">
        Creating your account…
      </p>
    </main>
  );
}
