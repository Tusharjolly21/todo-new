"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { initialSignupState, signupReducer } from "./signup.reducer";
import type { SignupAction, SignupState } from "./signup.types";

interface SignupContextValue {
  state: SignupState;
  dispatch: Dispatch<SignupAction>;
}

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(signupReducer, initialSignupState);

  return (
    <SignupContext.Provider value={{ state, dispatch }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup(): SignupContextValue {
  const ctx = useContext(SignupContext);
  if (!ctx) {
    throw new Error("useSignup must be used within a <SignupProvider>");
  }
  return ctx;
}
