import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectProps extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "id"
> {
  label?: string;
  options: readonly string[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, options, placeholder, className, ...props }, ref) {
    const id = useId();
    return (
      <div className="rounded-md border border-neutral-300 px-3.5 py-2 text-left focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-[#202020]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              "w-full appearance-none bg-transparent pr-6 text-sm text-[#202020] outline-none",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    );
  },
);
