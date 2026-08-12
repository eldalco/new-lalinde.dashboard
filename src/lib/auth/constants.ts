export const AUTH_COOKIE = {
  TOKEN: "ll_session",
  USERNAME: "ll_username",
} as const;

/** Backend JWT lifetime is ~2 hours; keep the frontend session aligned. */
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 2;

export const AUTH_PATHS = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
} as const;
