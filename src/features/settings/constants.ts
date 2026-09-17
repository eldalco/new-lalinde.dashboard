export const SETTINGS_KEYS = {
  PRICES_VISIBLE: "prices_visible",
} as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[keyof typeof SETTINGS_KEYS];
