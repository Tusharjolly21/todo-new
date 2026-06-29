import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "h-10 w-10 animate-spin rounded-full border-[3px] border-neutral-200 border-t-brand",
        className,
      )}
    />
  );
}
