import { cn } from "@/lib/utils/cn";

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return initials || "?";
}

interface AvatarProps {
  name: string;
  /** Optional photo data/URL; falls back to initials when absent. */
  src?: string | null;
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = 56, className }: AvatarProps) {
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full bg-brand font-bold text-white",
        className,
      )}
      aria-hidden
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
