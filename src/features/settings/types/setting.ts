import type { SettingsKey } from "@/features/settings/constants";

/**
 * Setting row from GET/PATCH /api/v1/settings/:key
 * `value` is a real JSON boolean (jsonb) — never treat string "false" as truthy.
 */
export type ApiSetting = {
  key: SettingsKey | string;
  value: boolean;
  updated_at: string;
};
