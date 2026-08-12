"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apartmentKeys } from "@/features/apartments/hooks/apartment-keys";
import { patchApartment } from "@/features/apartments/services/apartments-service";
import type { ApartmentPatchPayload } from "@/features/apartments/types/apartment";

type UpdateApartmentVariables = {
  aptoNumber: string;
  payload: ApartmentPatchPayload;
};

export function useUpdateApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ aptoNumber, payload }: UpdateApartmentVariables) =>
      patchApartment(aptoNumber, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: apartmentKeys.all });
    },
  });
}
