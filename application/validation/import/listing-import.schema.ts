// application/validation/import/listing-import.schema.ts

import * as yup from "yup";
import i18next from "i18next";
import { ListingType, ListingStatus } from "@/domain/entities/listing.enums";

const validListingTypes = Object.values(ListingType);
const validListingStatuses = Object.values(ListingStatus);

const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, { ns: "validations", ...options });

/**
 * Schema de validación para importación de listings
 */
export const listingImportSchema = yup.object({
  // Campos requeridos
  listing_type: yup
    .string()
    .required(t("required", { attribute: "listing_type" }))
    .test("valid-type", t("import.validations.invalid_listing_type"), (value) => {
      if (!value) return false;
      return validListingTypes.includes(value as ListingType);
    }),

  price: yup
    .number()
    .required(t("required", { attribute: "price" }))
    .min(0, t("min.numeric", { attribute: "price", min: 0 })),

  whatsapp_contact: yup
    .string()
    .required(t("required", { attribute: "whatsapp_contact" }))
    .min(8, t("import.validations.whatsapp_min"))
    .max(20, t("max.string", { attribute: "whatsapp_contact", max: 20 })),

  // Campos opcionales de property (si se crea automáticamente)
  property_id: yup.string().optional(),

  property_title: yup.string().optional(),
  property_city: yup.string().optional(),
  property_state: yup.string().optional(),
  property_type: yup.string().optional(),

  // Campos opcionales
  currency: yup
    .string()
    .optional()
    .default("COP")
    .oneOf(["COP", "USD", "EUR"], t("import.validations.invalid_currency")),

  price_negotiable: yup
    .boolean()
    .optional()
    .default(false),

  status: yup
    .string()
    .optional()
    .default("draft")
    .test("valid-status", t("import.validations.invalid_status"), (value) => {
      if (!value) return true;
      return validListingStatuses.includes(value as ListingStatus);
    }),

  meta_title: yup
    .string()
    .optional()
    .max(100, t("max.string", { attribute: "meta_title", max: 100 })),

  meta_description: yup
    .string()
    .optional()
    .max(500, t("max.string", { attribute: "meta_description", max: 500 })),

  keywords: yup
    .string()
    .optional()
    .test("valid-keywords", t("import.validations.invalid_keywords_format"), (value) => {
      if (!value) return true;
      const items = value.split(/[,|]/).map((s) => s.trim());
      return items.every((item) => item.length > 0 && item.length <= 50);
    }),

  expenses_amount: yup
    .number()
    .optional()
    .min(0, t("min.numeric", { attribute: "expenses_amount", min: 0 })),

  expenses_included: yup
    .boolean()
    .optional()
    .default(false),

  virtual_tour_url: yup
    .string()
    .optional()
    .url(t("url", { attribute: "virtual_tour_url" })),

  video_url: yup
    .string()
    .optional()
    .url(t("url", { attribute: "video_url" })),

  available_from: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, t("import.validations.invalid_date_format")),

  minimum_contract_duration: yup
    .number()
    .optional()
    .integer(t("integer", { attribute: "minimum_contract_duration" }))
    .min(1, t("import.validations.min_contract_duration"))
    .max(120, t("import.validations.max_contract_duration")),
});

export type ListingImportInput = yup.InferType<typeof listingImportSchema>;

export const listingImportHeaders = [
  "listing_type",
  "price",
  "currency",
  "price_negotiable",
  "status",
  "whatsapp_contact",
  "property_id",
  "property_title",
  "property_city",
  "property_state",
  "property_type",
  "meta_title",
  "meta_description",
  "keywords",
  "expenses_amount",
  "expenses_included",
  "virtual_tour_url",
  "video_url",
  "available_from",
  "minimum_contract_duration",
] as const;

export type ListingImportHeader = (typeof listingImportHeaders)[number];

/**
 * Headers en español para plantillas de importación de listings
 */
export const listingImportHeadersES = [
  "tipo_listado",
  "precio",
  "moneda",
  "precio_negociable",
  "estado",
  "whatsapp_contacto",
  "id_propiedad",
  "título_propiedad",
  "ciudad_propiedad",
  "estado_propiedad",
  "tipo_propiedad",
  "meta_título",
  "meta_descripción",
  "palabras_clave",
  "monto_gastos",
  "gastos_incluidos",
  "tour_virtual",
  "video_url",
  "disponible_desde",
  "duración_mínima_contrato",
] as const;

export type ListingImportHeaderES = (typeof listingImportHeadersES)[number];
