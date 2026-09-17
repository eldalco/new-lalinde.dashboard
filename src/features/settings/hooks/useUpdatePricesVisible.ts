"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { settingsKeys } from "@/features/settings/hooks/settings-keys";
import { updatePricesVisibleSetting } from "@/features/settings/services/settings-service";
import type { ApiSetting } from "@/features/settings/types/setting";

export function useUpdatePricesVisible() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: boolean) => updatePricesVisibleSetting(value),
    onSuccess: (setting: ApiSetting) => {
      queryClient.setQueryData(settingsKeys.pricesVisible(), setting);
    },
  });
}
