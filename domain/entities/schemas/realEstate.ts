import i18next from "i18next";
import * as yup from "yup";

export const realEstateSchema = yup.object({
  name: yup
    .string()
    .required(i18next.t("forms.real_estate.fields.name.message"))
    .min(3, i18next.t("forms.real_estate.fields.name.message1"))
    .max(150, i18next.t("forms.real_estate.fields.name.message2")),

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
  description: null,
};
