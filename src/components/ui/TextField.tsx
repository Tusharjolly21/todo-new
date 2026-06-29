import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> {
  label?: string;
  error?: string | null;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, error, hint, className, ...props }, ref) {
    const id = useId();
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
      <div className="text-left">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-semibold text-[#202020]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition",
            "focus:ring-2 focus:ring-brand/20",
            error
              ? "border-brand focus:border-brand"
              : "border-neutral-300 focus:border-brand",
            className,
          )}
          {...props}
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-brand">
            {error}
          </p>
        ) : hint ? (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-neutral-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
