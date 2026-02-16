import i18next from "i18next";
import * as yup from "yup";

export const propertySchema =
  yup.object({
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
  });

export const propertySchemaUpdate = yup.object({
  id: yup.string().uuid().required()
}).concat(propertySchema)

export type PropertyFormData = yup.InferType<typeof propertySchema>;

export const defaultPropertyValues: PropertyFormData = {
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
};
