"use client";

import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { amenitiesOptions } from "@/domain/entities/property.entity";

export function PropertyFeaturesForm() {
  const { t } = useTranslation("properties");

  return (
    <>
      <Form.Set legend={t("sections.features")}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Form.Input
            name="bedrooms"
            type="number"
            label={t("labels.bedrooms")}
            placeholder="3"
          />
          <Form.Input
            name="bathrooms"
            type="number"
            label={t("labels.bathrooms")}
            placeholder="2"
          />
          <Form.Input
            name="floors"
            type="number"
            label={t("labels.floors")}
            placeholder="1"
          />
          <Form.Input
            name="year_built"
            type="number"
            label={t("labels.year_built")}
            placeholder="2020"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Form.Input
            name="total_area"
            type="number"
            step="0.01"
            label={t("labels.total_area")}
            placeholder="120.50"
          />
          <Form.Input
            name="built_area"
            type="number"
            step="0.01"
            label={t("labels.built_area")}
            placeholder="100.00"
          />
          <Form.Input
            name="lot_area"
            type="number"
            step="0.01"
            label={t("labels.lot_area")}
            placeholder="200.00"
          />
          <Form.Input
            name="parking_spots"
            type="number"
            label={t("labels.parking_spots")}
            placeholder="1"
          />
        </div>
      </Form.Set>

      <Form.Set legend={t("labels.amenities")}>
        <Form.Combobox
          name="amenities"
          label={t("labels.amenities")}
          placeholder={t("placeholders.amenities")}
          multiple={true}
          options={amenitiesOptions}
        />
      </Form.Set>
    </>
  );
}
