"use client";

import { useTranslation } from "react-i18next";
import { Form } from "@/components/ui/form";
import { amenitiesOptions, propertyTypeOptions } from "@/domain/entities/property.entity";

export function PropertyFeaturesForm() {
    const { t } = useTranslation();

    return (
        <>
            <Form.Set legend={t("forms.property.features")}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Form.Input
                        name="bedrooms"
                        type="number"
                        label={t("forms.property.fields.bedrooms.label")}
                        placeholder="3"
                    />
                    <Form.Input
                        name="bathrooms"
                        type="number"
                        label={t("forms.property.fields.bathrooms.label")}
                        placeholder="2"
                    />
                    <Form.Input
                        name="floors"
                        type="number"
                        label={t("forms.property.fields.floors.label")}
                        placeholder="1"
                    />
                    <Form.Input
                        name="year_built"
                        type="number"
                        label={t("forms.property.fields.year_built.label")}
                        placeholder="2020"
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Form.Input
                        name="total_area"
                        type="number"
                        step="0.01"
                        label={t("forms.property.fields.total_area.label")}
                        placeholder="120.50"
                    />
                    <Form.Input
                        name="built_area"
                        type="number"
                        step="0.01"
                        label={t("forms.property.fields.built_area.label")}
                        placeholder="100.00"
                    />
                    <Form.Input
                        name="lot_area"
                        type="number"
                        step="0.01"
                        label={t("forms.property.fields.lot_area.label")}
                        placeholder="200.00"
                    />
                    <Form.Input
                        name="parking_spots"
                        type="number"
                        label={t("forms.property.fields.parking_spots.label")}
                        placeholder="1"
                    />
                </div>
            </Form.Set>

            <Form.Set legend={t("forms.property.amenities")}>
                <Form.Combobox
                    name="amenities"
                    label={t("forms.property.fields.amenities.label")}
                    placeholder={t("forms.property.fields.amenities.placeholder")}
                    multiple={true}
                    options={amenitiesOptions}
                />
            </Form.Set>
        </>
    );
}