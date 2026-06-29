import type { Metadata } from "next";
import { LoginView } from "@/features/login";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return <LoginView />;
}
