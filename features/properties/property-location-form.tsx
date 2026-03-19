"use client";

import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import countries from '@/lib/countries.json'
import { useFormContext } from "react-hook-form";

export function PropertyLocationForm() {
  const { t } = useTranslation('properties');
  const { control } = useFormContext()

  return (
    <Form.Set legend={t("sections.location")}>
      <div className="w-full gap-4">
        <Form.CountryStateCity
          countryName="country"
          stateName="state"
          cityName="city"
          countries={countries}
          control={control}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Input
          name="postal_code"
          label={t("labels.postal_code")}
          placeholder={t("placeholders.postal_code")}
        />
        <Form.Input
          name="street"
          label={t("labels.street")}
          placeholder={t("placeholders.street")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Input
          name="latitude"
          type="number"
          step="any"
          label={t("labels.latitude")}
          placeholder={t("placeholders.latitude")}
        />
        <Form.Input
          name="longitude"
          type="number"
          step="any"
          label={t("labels.longitude")}
          placeholder={t("placeholders.longitude")}
        />
      </div>
    </Form.Set>
  );
}