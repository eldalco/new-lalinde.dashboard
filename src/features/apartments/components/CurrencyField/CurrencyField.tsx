"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

import { Input } from "@/components/ui/Input";

type CurrencyFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
  error?: string;
};

export const CurrencyField = forwardRef<HTMLInputElement, CurrencyFieldProps>(
  function CurrencyField({ label, error, ...props }, ref) {
    return (
      <Input
        ref={ref}
        label={label}
        type="number"
        inputMode="decimal"
        step="any"
        min={0}
        error={error}
        {...props}
      />
    );
  },
);
