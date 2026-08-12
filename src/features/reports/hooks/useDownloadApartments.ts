"use client";

import { useMutation } from "@tanstack/react-query";

import { downloadApartmentsExcel } from "@/features/reports/services/files-service";

export function useDownloadApartments() {
  return useMutation({
    mutationFn: downloadApartmentsExcel,
  });
}
