"use client";

import { useQuery } from "@tanstack/react-query";

import { settingsKeys } from "@/features/settings/hooks/settings-keys";
import { fetchPricesVisibleSetting } from "@/features/settings/services/settings-service";

/**
 * Strict boolean: prices are visible only when value === true.
 * While loading/error, default to visible to avoid flashing hidden columns.
 */
export function usePricesVisible() {
  const query = useQuery({
    queryKey: settingsKeys.pricesVisible(),
    queryFn: fetchPricesVisibleSetting,
    staleTime: 30_000,
  });

  const pricesVisible =
    query.data != null ? query.data.value === true : true;

  return {
    ...query,
    pricesVisible,
  };
}
