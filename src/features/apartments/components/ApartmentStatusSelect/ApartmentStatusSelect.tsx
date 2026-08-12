"use client";

import { Select } from "@/components/ui/Select";
import {
  APARTMENT_STATUS,
  APARTMENT_STATUS_LABEL,
} from "@/features/apartments/constants/status";

type ApartmentStatusSelectProps = {
  value: string;
  onChange: (statusId: string) => void;
  disabled?: boolean;
  label?: string;
  error?: string;
  name?: string;
};

export function ApartmentStatusSelect({
  value,
  onChange,
  disabled,
  label = "Estado",
  error,
  name = "id_status",
}: ApartmentStatusSelectProps) {
  return (
    <Select
      label={label}
      name={name}
      value={value}
      disabled={disabled}
      error={error}
      onChange={(event) => onChange(event.target.value)}
      options={[
        {
          value: APARTMENT_STATUS.AVAILABLE,
          label: APARTMENT_STATUS_LABEL[APARTMENT_STATUS.AVAILABLE],
        },
        {
          value: APARTMENT_STATUS.SOLD,
          label: APARTMENT_STATUS_LABEL[APARTMENT_STATUS.SOLD],
        },
      ]}
    />
  );
}
