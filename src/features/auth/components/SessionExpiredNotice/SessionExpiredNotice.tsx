"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { AUTH_PATHS } from "@/lib/auth/constants";

export function SessionExpiredNotice() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("expired") !== "1") {
      return;
    }

    toast.error("Tu sesión ha expirado. Inicia sesión nuevamente.");
    router.replace(AUTH_PATHS.LOGIN);
  }, [router, searchParams]);

  return null;
}
