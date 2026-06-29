export function Divider({ label }: { label?: string }) {
  if (!label) {
    return <div className="h-px w-full bg-neutral-200" />;
  }
  return (
    <div className="flex items-center gap-3 text-xs text-neutral-400">
      <div className="h-px flex-1 bg-neutral-200" />
      {label}
      <div className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}
