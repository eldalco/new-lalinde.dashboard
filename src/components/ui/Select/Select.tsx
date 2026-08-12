import { forwardRef, type SelectHTMLAttributes } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: SelectOption[];
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { id, label, options, error, className = "", ...props },
    ref,
  ) {
    const selectId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`h-11 w-full rounded-lg border bg-surface px-3 text-sm text-foreground shadow-[var(--shadow-sm)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? "border-danger" : "border-border"
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
