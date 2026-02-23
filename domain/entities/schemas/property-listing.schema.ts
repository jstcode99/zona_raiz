import i18next from "i18next";
import * as yup from "yup";

export const businessTypeOptions = [
  { value: "sale", label: "Venta" },
  { value: "rent", label: "Alquiler" },
] as const;

export const statusOptions = [
  { value: "draft", label: "Borrador" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Archivado" },
] as const;

export const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "MXN", label: "MXN" },
  { value: "COP", label: "COP" },
  { value: "ARS", label: "ARS" },
] as const;


export const propertyListingSchema =
  yup.object({
    title: yup
      .string()
      .required(i18next.t("forms.property.fields.title.message"))
      .max(200, i18next.t("forms.property.fields.title.message1")),

    slug: yup
      .string()
      .required(i18next.t("forms.property.fields.slug.message"))
      .max(250, i18next.t("forms.property.fields.slug.message1"))
      .matches(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        i18next.t("forms.property.fields.slug.message2")
      ),

    meta_title: yup
      .string()
      .max(255, i18next.t("forms.property.fields.meta_title.message"))
      .nullable(),

    meta_description: yup
      .string()
      .max(300, i18next.t("forms.property.fields.meta_description.message"))
      .nullable(),

    description: yup
      .string()
      .required(i18next.t("forms.property.fields.description.message")),

    business_type: yup
      .string()
      .oneOf(
        businessTypeOptions.map((o) => o.value),
        i18next.t("forms.property.fields.business_type.message")
      )
      .required(i18next.t("forms.property.fields.business_type.message")),

    status: yup
      .string()
      .oneOf(
        statusOptions.map((o) => o.value),
        i18next.t("forms.property.fields.status.message")
      )
      .default("draft"),

    price: yup
      .number()
      .typeError(i18next.t("forms.property.fields.price.message1"))
      .required(i18next.t("forms.property.fields.price.message"))
      .positive(i18next.t("forms.property.fields.price.message2"))
      .max(9999999999.99, i18next.t("forms.property.fields.price.message3")),

    currency: yup
      .string()
      .oneOf(
        currencyOptions.map((o) => o.value),
        i18next.t("forms.property.fields.currency.message")
      )
      .default("USD"),

    whatsapp_contact: yup
      .string()
      .required(i18next.t("forms.property.fields.whatsapp_contact.message"))
      .max(20, i18next.t("forms.property.fields.whatsapp_contact.message1"))
      .matches(
        /^\+?[0-9\s-]+$/,
        i18next.t("forms.property.fields.whatsapp_contact.message2")
      ),
  });

export const propertyListingSchemaUpdate = yup.object({
  id: yup.string().uuid().required()
}).concat(propertyListingSchema)

export type PropertyListingFormData = yup.InferType<typeof propertyListingSchema>;

export const defaultPropertyValues: PropertyListingFormData = {
  title: "",
  slug: "",
  meta_title: "",
  meta_description: "",
  description: "",
  business_type: "sale",
  status: "draft",
  price: 0,
  currency: "USD",
  whatsapp_contact: "",
};
