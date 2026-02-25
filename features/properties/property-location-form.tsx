"use client";

import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";

export function PropertyLocationForm() {
  const { t } = useTranslation();

  return (
      <Form.Set legend={t("forms.property.location")}>
        <Form.Input
          name="address"
          label={t("forms.property.fields.address.label")}
          placeholder={t("forms.property.fields.address.placeholder")}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Form.Input
            name="street"
            label={t("forms.property.fields.street.label")}
            placeholder={t("forms.property.fields.street.placeholder")}
          />
          <Form.Input
            name="neighborhood"
            label={t("forms.property.fields.neighborhood.label")}
            placeholder={t("forms.property.fields.neighborhood.placeholder")}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Form.Input
            name="city"
            label={t("forms.property.fields.city.label")}
            placeholder={t("forms.property.fields.city.placeholder")}
            required
          />
          <Form.Input
            name="state"
            label={t("forms.property.fields.state.label")}
            placeholder={t("forms.property.fields.state.placeholder")}
            required
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <Form.Input
            name="postal_code"
            label={t("forms.property.fields.postal_code.label")}
            placeholder={t("forms.property.fields.postal_code.placeholder")}
          />
          <Form.Input
            name="country"
            label={t("forms.property.fields.country.label")}
            placeholder={t("forms.property.fields.country.placeholder")}
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