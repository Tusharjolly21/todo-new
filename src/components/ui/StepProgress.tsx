import { cn } from "@/lib/utils/cn";

interface StepProgressProps {
  current: number;
  total: number;
}

export function StepProgress({ current, total }: StepProgressProps) {
  return (
    <div
      className="flex w-full gap-1.5"
      role="progressbar"
      aria-label={`Step ${current + 1} of ${total}`}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors",
            i <= current ? "bg-brand" : "bg-neutral-200",
          )}
        />
      ))}
    </div>
  );
}
