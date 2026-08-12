"use client";

import { useQuery } from "@tanstack/react-query";

import { apartmentKeys } from "@/features/apartments/hooks/apartment-keys";
import { mapApiApartments } from "@/features/apartments/mappers/apartment-mapper";
import { fetchApartments } from "@/features/apartments/services/apartments-service";

export function useApartments() {
  return useQuery({
    queryKey: apartmentKeys.list(),
    queryFn: fetchApartments,
    select: mapApiApartments,
  });
}
