"use client";

import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import countries from '@/lib/countries.json'
import { useFormContext } from "react-hook-form";

export function PropertyLocationForm() {
  const { t } = useTranslation('common');
  const { control } = useFormContext()

  return (
    <Form.Set legend={t("forms.property.location")}>
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
          label={t("forms.property.fields.postal_code.label")}
          placeholder={t("forms.property.fields.postal_code.placeholder")}
        />
        <Form.Input
          name="street"
          label={t("forms.property.fields.street.label")}
          placeholder={t("forms.property.fields.street.placeholder")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Form.Input
          name="latitude"
          type="number"
          step="any"
          label={t("forms.property.fields.latitude.label")}
          placeholder={t("forms.property.fields.latitude.placeholder")}
        />
        <Form.Input
          name="longitude"
          type="number"
          step="any"
          label={t("forms.property.fields.longitude.label")}
          placeholder={t("forms.property.fields.longitude.placeholder")}
        />
      </div>
    </Form.Set>
  );
}