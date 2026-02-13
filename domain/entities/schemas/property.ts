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


export const propertySchema =
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

    address: yup.string().nullable(),

    neighborhood: yup
      .string()
      .max(150, i18next.t("forms.property.fields.neighborhood.message"))
      .nullable(),

    city: yup
      .string()
      .required(i18next.t("forms.property.fields.city.message"))
      .max(150, i18next.t("forms.property.fields.city.message1")),

    state: yup
      .string()
      .required(i18next.t("forms.property.fields.state.message"))
      .max(150, i18next.t("forms.property.fields.state.message1")),

    country: yup
      .string()
      .required(i18next.t("forms.property.fields.country.message"))
      .max(150, i18next.t("forms.property.fields.country.message1")),

    latitude: yup
      .number()
      .typeError(i18next.t("forms.property.fields.latitude.message"))
      .min(-90, i18next.t("forms.property.fields.latitude.message1"))
      .max(90, i18next.t("forms.property.fields.latitude.message2"))
      .nullable()
      .transform((value, original) =>
        original === "" ? null : value
      ),

    longitude: yup
      .number()
      .typeError(i18next.t("forms.property.fields.longitude.message"))
      .min(-180, i18next.t("forms.property.fields.longitude.message1"))
      .max(180, i18next.t("forms.property.fields.longitude.message2"))
      .nullable()
      .transform((value, original) =>
        original === "" ? null : value
      ),

    google_maps_url: yup
      .string()
      .url(i18next.t("forms.property.fields.google_maps_url.message"))
      .nullable()
      .transform((value, original) =>
        original === "" ? null : value
      ),

    bedrooms: yup
      .number()
      .typeError(i18next.t("forms.property.fields.bedrooms.message"))
      .integer(i18next.t("forms.property.fields.bedrooms.message1"))
      .min(0, i18next.t("forms.property.fields.bedrooms.message2"))
      .nullable()
      .transform((value, original) =>
        original === "" ? null : value
      ),

    bathrooms: yup
      .number()
      .typeError(i18next.t("forms.property.fields.bathrooms.message"))
      .integer(i18next.t("forms.property.fields.bathrooms.message1"))
      .min(0, i18next.t("forms.property.fields.bathrooms.message2"))
      .nullable()
      .transform((value, original) =>
        original === "" ? null : value
      ),

    area_m2: yup
      .number()
      .typeError(i18next.t("forms.property.fields.area_m2.message"))
      .integer(i18next.t("forms.property.fields.area_m2.message1"))
      .min(1, i18next.t("forms.property.fields.area_m2.message2"))
      .nullable()
      .transform((value, original) =>
        original === "" ? null : value
      ),

    whatsapp_contact: yup
      .string()
      .required(i18next.t("forms.property.fields.whatsapp_contact.message"))
      .max(20, i18next.t("forms.property.fields.whatsapp_contact.message1"))
      .matches(
        /^\+?[0-9\s-]+$/,
        i18next.t("forms.property.fields.whatsapp_contact.message2")
      ),
  });

export const propertySchemaUpdate = yup.object({
  id: yup.string().uuid().required()
}).concat(propertySchema)

export type PropertyFormData = yup.InferType<typeof propertySchema>;

export const defaultPropertyValues: PropertyFormData = {
  title: "",
  slug: "",
  meta_title: "",
  meta_description: "",
  description: "",
  business_type: "sale",
  status: "draft",
  price: 0,
  currency: "USD",
  address: "",
  neighborhood: "",
  city: "",
  state: "",
  country: "",
  latitude: null,
  longitude: null,
  google_maps_url: "",
  bedrooms: null,
  bathrooms: null,
  area_m2: null,
  whatsapp_contact: "",
};
