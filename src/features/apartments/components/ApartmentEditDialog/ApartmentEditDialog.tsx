"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { ApartmentStatusSelect } from "@/features/apartments/components/ApartmentStatusSelect/ApartmentStatusSelect";
import { CurrencyField } from "@/features/apartments/components/CurrencyField/CurrencyField";
import { useUpdateApartment } from "@/features/apartments/hooks/useUpdateApartment";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import {
  buildApartmentPatchPayload,
  updateApartmentFormSchema,
  type UpdateApartmentFormValues,
} from "@/features/apartments/schemas/update-apartment-schema";
import { getUserFacingErrorMessage } from "@/lib/api/api-error";
import { formatDecimal, toNumber } from "@/lib/utils/numbers";

type ApartmentEditDialogProps = {
  apartment: ApartmentListItem | null;
  open: boolean;
  onClose: () => void;
  subtypeOptions: Array<{ id: string; name: string }>;
};

function toFormValues(apartment: ApartmentListItem): UpdateApartmentFormValues {
  return {
    total_price: toNumber(apartment.total_price) ?? 0,
    built_area: toNumber(apartment.built_area) ?? 0,
    terrace_area: toNumber(apartment.terrace_area) ?? 0,
    acue_area: toNumber(apartment.acue_area) ?? 0,
    stair_area: toNumber(apartment.stair_area) ?? 0,
    total_area: toNumber(apartment.total_area) ?? 0,
    square_meter_price: toNumber(apartment.square_meter_price) ?? 0,
    bathrooms: toNumber(apartment.bathrooms) ?? 0,
    rooms: toNumber(apartment.rooms) ?? 0,
    garage_spaces: apartment.garage_spaces,
    orientation: apartment.orientation,
    floor: apartment.floor,
    id_subtype: apartment.id_subtype,
    id_status: apartment.id_status as UpdateApartmentFormValues["id_status"],
  };
}

export function ApartmentEditDialog({
  apartment,
  open,
  onClose,
  subtypeOptions,
}: ApartmentEditDialogProps) {
  const updateApartment = useUpdateApartment();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateApartmentFormValues>({
    resolver: zodResolver(updateApartmentFormSchema),
  });

  useEffect(() => {
    if (apartment && open) {
      reset(toFormValues(apartment));
    }
  }, [apartment, open, reset]);

  async function onSubmit(values: UpdateApartmentFormValues) {
    if (!apartment) {
      return;
    }

    const payload = buildApartmentPatchPayload(apartment, values);

    if (Object.keys(payload).length === 0) {
      toast.message("No hay cambios para guardar");
      onClose();
      return;
    }

    try {
      await updateApartment.mutateAsync({
        aptoNumber: apartment.apto_number,
        payload,
      });
      toast.success(`Apartamento ${apartment.apto_number} actualizado`);
      onClose();
    } catch (error) {
      toast.error(getUserFacingErrorMessage(error));
    }
  }

  const isPending = isSubmitting || updateApartment.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        apartment
          ? `Editar apartamento ${apartment.apto_number}`
          : "Editar apartamento"
      }
      description="Solo se enviarán al servidor los campos que modifiques."
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="apartment-edit-form"
            loading={isPending}
          >
            Guardar cambios
          </Button>
        </div>
      }
    >
      {apartment ? (
        <form
          id="apartment-edit-form"
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="sm:col-span-2 rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-muted">
            <p>
              Solo lectura (m²) — deck:{" "}
              {apartment.deck_area
                ? formatDecimal(apartment.deck_area)
                : "—"}
              ; privada:{" "}
              {apartment.private_area
                ? formatDecimal(apartment.private_area)
                : "—"}
              ; global:{" "}
              {apartment.global_total_area
                ? formatDecimal(apartment.global_total_area)
                : "—"}
            </p>
          </div>

          <CurrencyField
            label="Precio total"
            error={errors.total_price?.message}
            {...register("total_price", { valueAsNumber: true })}
          />
          <CurrencyField
            label="Precio m²"
            error={errors.square_meter_price?.message}
            {...register("square_meter_price", { valueAsNumber: true })}
          />
          <Input
            label="Área construida"
            type="number"
            step="any"
            min={0}
            error={errors.built_area?.message}
            {...register("built_area", { valueAsNumber: true })}
          />
          <Input
            label="Área pública/terraza"
            type="number"
            step="any"
            min={0}
            error={errors.terrace_area?.message}
            {...register("terrace_area", { valueAsNumber: true })}
          />
          <Input
            label="Área ACUE"
            type="number"
            step="any"
            min={0}
            error={errors.acue_area?.message}
            {...register("acue_area", { valueAsNumber: true })}
          />
          <Input
            label="Área escalera"
            type="number"
            step="any"
            min={0}
            error={errors.stair_area?.message}
            {...register("stair_area", { valueAsNumber: true })}
          />
          <Input
            label="Área total"
            type="number"
            step="any"
            min={0}
            error={errors.total_area?.message}
            {...register("total_area", { valueAsNumber: true })}
          />
          <Input
            label="Baños"
            type="number"
            step="any"
            min={0}
            error={errors.bathrooms?.message}
            {...register("bathrooms", { valueAsNumber: true })}
          />
          <Input
            label="Habitaciones"
            type="number"
            step="any"
            min={0}
            error={errors.rooms?.message}
            {...register("rooms", { valueAsNumber: true })}
          />
          <Input
            label="Garajes"
            type="number"
            step={1}
            min={0}
            error={errors.garage_spaces?.message}
            {...register("garage_spaces", { valueAsNumber: true })}
          />
          <Input
            label="Orientación"
            error={errors.orientation?.message}
            {...register("orientation")}
          />
          <Input
            label="Piso"
            error={errors.floor?.message}
            {...register("floor")}
          />
          <Controller
            control={control}
            name="id_subtype"
            render={({ field }) => (
              <Select
                label="Subtipo"
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.id_subtype?.message}
                options={subtypeOptions.map((option) => ({
                  value: option.id,
                  label: option.name,
                }))}
              />
            )}
          />
          <Controller
            control={control}
            name="id_status"
            render={({ field }) => (
              <ApartmentStatusSelect
                value={field.value}
                onChange={field.onChange}
                error={errors.id_status?.message}
              />
            )}
          />
        </form>
      ) : null}
    </Modal>
  );
}
