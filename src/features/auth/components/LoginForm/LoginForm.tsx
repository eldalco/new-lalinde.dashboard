"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/login-schema";
import { loginRequest } from "@/features/auth/services/auth-service";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";
import { AUTH_PATHS } from "@/lib/auth/constants";

export function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    try {
      await loginRequest(values);
      toast.success("Sesión iniciada correctamente");
      router.replace(AUTH_PATHS.DASHBOARD);
      router.refresh();
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5"
      noValidate
    >
      <Input
        label="Usuario"
        autoComplete="username"
        placeholder="Tu usuario"
        error={errors.username?.message}
        {...register("username")}
      />
      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="Tu contraseña"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
        Iniciar sesión
      </Button>
    </form>
  );
}
