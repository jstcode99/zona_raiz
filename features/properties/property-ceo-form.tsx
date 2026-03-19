import { Form } from "@/components/ui/form";
import { propertyTypeOptions } from "@/domain/entities/property.entity";
import { useTranslation } from "react-i18next";

export function PropertyCeoForm() {
    const { t } = useTranslation('properties');
    return (
        <Form.Set legend={t("sections.basic_info")}>
            <Form.Input
                name="title"
                label={t("labels.title")}
                placeholder={t("placeholders.title")}
            />
            <Form.Input
                name="slug"
                label={t("labels.slug")}
                placeholder={t("placeholders.slug")}
            />
            <Form.Select
                name="property_type"
                label={t("labels.property_type")}
                options={propertyTypeOptions}
            />
            <Form.Textarea
                name="description"
                label={t("labels.description")}
                placeholder={t("placeholders.description")}
                rows={4}
            />
        </Form.Set>
    );
}