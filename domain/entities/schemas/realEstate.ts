import i18next from "i18next";
import * as yup from "yup";

export const realEstateSchema = yup.object({
  name: yup
    .string()
    .required(i18next.t("forms.real_estate.fields.name.message"))
    .min(3, i18next.t("forms.real_estate.fields.name.message1"))
    .max(150, i18next.t("forms.real_estate.fields.name.message2")),

  slug: yup
    .string()
    .required(i18next.t("forms.real_estate.fields.slug.message"))
    .max(150, i18next.t("forms.real_estate.fields.slug.message1"))
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      i18next.t("forms.real_estate.fields.slug.message2")
    ),

  logo_url: yup
    .string()
    .url(i18next.t("forms.real_estate.fields.logo_url.message"))
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  phone: yup
    .string()
    .max(20, i18next.t("forms.real_estate.fields.phone.message"))
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  whatsapp: yup
    .string()
    .max(20, i18next.t("forms.real_estate.fields.whatsapp.message"))
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  address: yup
    .string()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  city: yup
    .string()
    .max(100, i18next.t("forms.real_estate.fields.city.message"))
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  state: yup
    .string()
    .max(100, i18next.t("forms.real_estate.fields.state.message"))
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  country: yup
    .string()
    .max(100, i18next.t("forms.real_estate.fields.country.message"))
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),

  description: yup
    .string()
    .nullable()
    .transform((value, original) => (original === "" ? null : value)),
});

export const realEstateUpdateSchema = yup
  .object({
    id: yup.string().uuid().required(),
  })
  .concat(realEstateSchema);

export type RealEstateFormData = yup.InferType<typeof realEstateSchema>;

export const defaultRealEstateValues: RealEstateFormData = {
  name: "",
  slug: "",
  logo_url: null,
  phone: null,
  whatsapp: null,
  address: null,
  city: null,
  state: null,
  country: null,
  description: null,
};
