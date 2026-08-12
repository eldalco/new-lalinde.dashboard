import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  BACKEND_URL: z
    .string()
    .url("BACKEND_URL must be a valid URL")
    .refine((value) => !value.endsWith("/"), {
      message: "BACKEND_URL must not end with a trailing slash",
    }),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

function readServerEnv(): ServerEnv {
  const parsed = serverEnvSchema.safeParse({
    BACKEND_URL: process.env.BACKEND_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid server environment: ${details}`);
  }

  return parsed.data;
}

let cachedEnv: ServerEnv | null = null;

/** Server-only env. Do not import from Client Components. */
export function getServerEnv(): ServerEnv {
  if (!cachedEnv) {
    cachedEnv = readServerEnv();
  }

  return cachedEnv;
}

export function getBackendUrl(): string {
  return getServerEnv().BACKEND_URL;
}

export function isProduction(): boolean {
  return getServerEnv().NODE_ENV === "production";
}
