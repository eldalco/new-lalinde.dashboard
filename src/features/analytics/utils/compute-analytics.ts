import {
  isAvailableAvailableStatus,
  isSoldAvailableStatus,
} from "@/features/apartments/constants/status";
import type { ApartmentListItem } from "@/features/apartments/mappers/apartment-mapper";
import { toNumber } from "@/lib/utils/numbers";

export type ApartmentAnalytics = {
  total: number;
  available: number;
  sold: number;
  soldPercent: number;
  inventoryValue: number;
  availableInventoryValue: number;
  soldInventoryValue: number;
  averagePricePerSqm: number | null;
  averageApartmentPrice: number | null;
  bySubtype: Array<{ name: string; count: number }>;
  pricePerSqmByApartment: Array<{
    aptoNumber: string;
    pricePerSqm: number;
  }>;
};

export function computeApartmentAnalytics(
  apartments: ApartmentListItem[],
): ApartmentAnalytics {
  let available = 0;
  let sold = 0;
  let inventoryValue = 0;
  let availableInventoryValue = 0;
  let soldInventoryValue = 0;
  let priceSum = 0;
  let priceCount = 0;
  let sqmSum = 0;
  let sqmCount = 0;

  const subtypeCounts = new Map<string, number>();
  const pricePerSqmByApartment: ApartmentAnalytics["pricePerSqmByApartment"] =
    [];

  for (const apartment of apartments) {
    const availableStatus = apartment.Status?.available_status;
    const totalPrice = toNumber(apartment.total_price) ?? 0;
    const sqmPrice = toNumber(apartment.square_meter_price);

    inventoryValue += totalPrice;
    priceSum += totalPrice;
    priceCount += 1;

    if (sqmPrice !== null) {
      sqmSum += sqmPrice;
      sqmCount += 1;
      pricePerSqmByApartment.push({
        aptoNumber: apartment.apto_number,
        pricePerSqm: sqmPrice,
      });
    }

    if (isSoldAvailableStatus(availableStatus)) {
      sold += 1;
      soldInventoryValue += totalPrice;
    } else if (isAvailableAvailableStatus(availableStatus)) {
      available += 1;
      availableInventoryValue += totalPrice;
    }

    const subtype = apartment.subtypeName || "Sin subtipo";
    subtypeCounts.set(subtype, (subtypeCounts.get(subtype) ?? 0) + 1);
  }

  const total = apartments.length;
  const soldPercent = total === 0 ? 0 : (sold / total) * 100;

  const bySubtype = Array.from(subtypeCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "es"));

  pricePerSqmByApartment.sort((a, b) =>
    a.aptoNumber.localeCompare(b.aptoNumber, "es", { numeric: true }),
  );

  return {
    total,
    available,
    sold,
    soldPercent,
    inventoryValue,
    availableInventoryValue,
    soldInventoryValue,
    averagePricePerSqm: sqmCount > 0 ? sqmSum / sqmCount : null,
    averageApartmentPrice: priceCount > 0 ? priceSum / priceCount : null,
    bySubtype,
    pricePerSqmByApartment,
  };
}
