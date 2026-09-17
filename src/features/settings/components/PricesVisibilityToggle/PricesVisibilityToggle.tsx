"use client";

import { toast } from "sonner";

import { Spinner } from "@/components/ui/Spinner";
import { usePricesVisible } from "@/features/settings/hooks/usePricesVisible";
import { useUpdatePricesVisible } from "@/features/settings/hooks/useUpdatePricesVisible";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";

export function PricesVisibilityToggle() {
  const { pricesVisible, isLoading, isError } = usePricesVisible();
  const updateSetting = useUpdatePricesVisible();

  const disabled = isLoading || updateSetting.isPending || isError;
  const checked = pricesVisible;

  async function handleToggle() {
    const nextValue = !checked;

    try {
      await updateSetting.mutateAsync(nextValue);
      toast.success(
        nextValue
          ? "Precios visibles en el sitio web"
          : "Precios ocultos en el sitio web",
      );
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error));
    }
  }

  return (
    <div className="flex shrink-0 items-center gap-3 rounded-[var(--radius)] border border-border bg-surface px-3 py-2 shadow-[var(--shadow-sm)]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={
          checked
            ? "Ocultar precios en el sitio web"
            : "Mostrar precios en el sitio web"
        }
        disabled={disabled}
        onClick={() => void handleToggle()}
        className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${
          checked ? "bg-primary" : "bg-border-strong"
        }`}
      >
        <span
          aria-hidden
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      <div className="min-w-[8.5rem]">
        {isLoading || updateSetting.isPending ? (
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <Spinner size="sm" label="Actualizando visibilidad" />
            Actualizando…
          </span>
        ) : (
          <span
            className={`text-sm font-medium ${
              checked ? "text-foreground" : "text-muted"
            }`}
          >
            {checked ? "Precios visibles" : "Precios no visibles"}
          </span>
        )}
      </div>
    </div>
  );
}
