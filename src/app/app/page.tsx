import type { Metadata } from "next";
import { AppShell } from "@/features/workspace";

export const metadata: Metadata = {
  title: "Inbox",
};

export default function AppPage() {
  return <AppShell />;
}
