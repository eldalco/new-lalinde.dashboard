import { SETTINGS_KEYS } from "@/features/settings/constants";

export const settingsKeys = {
  all: ["settings"] as const,
  detail: (key: string) => [...settingsKeys.all, key] as const,
  pricesVisible: () =>
    [...settingsKeys.detail(SETTINGS_KEYS.PRICES_VISIBLE)] as const,
};
