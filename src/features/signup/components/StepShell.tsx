import type { ReactNode } from "react";

interface StepShellProps {
  title: string;
  subtitle?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
}

/** Consistent header + back-affordance wrapper shared by every step. */
export function StepShell({
  title,
  subtitle,
  onBack,
  children,
}: StepShellProps) {
  return (
    <div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 rounded text-sm font-medium text-neutral-400 transition hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          ← Back
        </button>
      )}
      <h1 className="text-2xl font-extrabold tracking-tight text-[#202020]">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
