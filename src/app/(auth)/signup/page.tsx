import type { Metadata } from "next";
import { SignupWizard } from "@/features/signup";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignupPage() {
  return <SignupWizard />;
}
