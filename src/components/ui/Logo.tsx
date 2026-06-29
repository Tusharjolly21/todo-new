import Link from "next/link";
import { siteConfig } from "@/config/site";

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#dc4c3e" />
      <path
        d="M6 12.2l3.4 3.4L18 7"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark() {
  return (
    <Link
      href={siteConfig.routes.home}
      className="flex items-center gap-2 text-brand"
      aria-label={siteConfig.name}
    >
      <LogoMark />
      <span className="text-xl font-bold tracking-tight">
        {siteConfig.name}
      </span>
    </Link>
  );
}
