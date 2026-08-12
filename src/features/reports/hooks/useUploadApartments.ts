"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apartmentKeys } from "@/features/apartments/hooks/apartment-keys";
import { uploadApartmentsExcel } from "@/features/reports/services/files-service";

export function useUploadApartments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadApartmentsExcel,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: apartmentKeys.all });
    },
  });
}
