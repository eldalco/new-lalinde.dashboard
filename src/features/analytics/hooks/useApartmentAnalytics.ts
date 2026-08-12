"use client";

import { useMemo } from "react";

import { computeApartmentAnalytics } from "@/features/analytics/utils/compute-analytics";
import { useApartments } from "@/features/apartments/hooks/useApartments";

export function useApartmentAnalytics() {
  const query = useApartments();

  const analytics = useMemo(
    () => computeApartmentAnalytics(query.data ?? []),
    [query.data],
  );

  return {
    ...query,
    analytics,
  };
}
