// application/validation/import/real-estate-import.schema.ts

import * as yup from "yup";
import i18next from "i18next";

const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, { ns: "validations", ...options });

/**
 * Schema de validación para importación de real estates (inmobiliarias)
 */
export const realEstateImportSchema = yup.object({
  // Campos requeridos
  name: yup
    .string()
    .required(t("required", { attribute: "name" }))
    .min(2, t("min.string", { attribute: "name", min: 2 }))
    .max(200, t("max.string", { attribute: "name", max: 200 })),

  whatsapp: yup
    .string()
    .required(t("required", { attribute: "whatsapp" }))
    .min(8, t("import.validations.whatsapp_min"))
    .max(20, t("max.string", { attribute: "whatsapp", max: 20 })),

  city: yup
    .string()
    .required(t("required", { attribute: "city" }))
    .max(100, t("max.string", { attribute: "city", max: 100 })),

  state: yup
    .string()
    .required(t("required", { attribute: "state" }))
    .max(100, t("max.string", { attribute: "state", max: 100 })),

  // Campos opcionales
  description: yup
    .string()
    .optional()
    .max(5000, t("max.string", { attribute: "description", max: 5000 })),

  email: yup
    .string()
    .optional()
    .email(t("email", { attribute: "email" })),

  phone: yup
    .string()
    .optional()
    .max(20, t("max.string", { attribute: "phone", max: 20 })),

  country: yup
    .string()
    .optional()
    .default("Colombia")
    .max(100, t("max.string", { attribute: "country", max: 100 })),

  street: yup
    .string()
    .optional()
    .max(200, t("max.string", { attribute: "street", max: 200 })),

  postal_code: yup
    .string()
    .optional()
    .max(20, t("max.string", { attribute: "postal_code", max: 20 })),
});

export type RealEstateImportInput = yup.InferType<typeof realEstateImportSchema>;

export const realEstateImportHeaders = [
  "name",
  "whatsapp",
  "city",
  "state",
  "country",
  "postal_code",
  "street",
  "email",
  "phone",
  "description",
] as const;

export type RealEstateImportHeader = (typeof realEstateImportHeaders)[number];
