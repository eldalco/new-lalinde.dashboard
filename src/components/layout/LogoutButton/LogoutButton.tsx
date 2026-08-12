"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { logoutRequest } from "@/features/auth/services/auth-service";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";
import { AUTH_PATHS } from "@/lib/auth/constants";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      try {
        await logoutRequest();
        toast.success("Sesión cerrada correctamente");
        router.replace(AUTH_PATHS.LOGIN);
        router.refresh();
      } catch (error) {
        toast.error(getUserFacingErrorMessage(error));
      }
    });
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      loading={isPending}
      onClick={handleLogout}
      aria-label="Cerrar sesión"
    >
      Cerrar sesión
    </Button>
  );
}
