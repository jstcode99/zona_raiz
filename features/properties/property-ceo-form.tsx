import { Form } from "@/components/ui/form";
import { propertyTypeOptions } from "@/domain/entities/property.entity";
import { useTranslation } from "react-i18next";

export function PropertyCeoForm() {
    const { t } = useTranslation();
    return (
        <Form.Set legend={t("forms.property.basic-info")}>
            <Form.Input
                name="title"
                label={t("forms.property.fields.title.label")}
                placeholder={t("forms.property.fields.title.placeholder")}
            />
            <Form.Input
                name="slug"
                label={t("forms.property.fields.slug.label")}
                placeholder={t("forms.property.fields.slug.placeholder")}
            />
            <Form.Select
                name="property_type"
                label={t("forms.property.fields.property_type.label")}
                options={propertyTypeOptions}
            />
            <Form.Textarea
                name="description"
                label={t("forms.property.fields.description.label")}
                placeholder={t("forms.property.fields.description.placeholder")}
                rows={4}
            />
        </Form.Set>
    );
}