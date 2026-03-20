// application/validation/import/listing-import.schema.ts

import * as yup from "yup";
import { ListingType, ListingStatus } from "@/domain/entities/listing.enums";

const validListingTypes = Object.values(ListingType);
const validListingStatuses = Object.values(ListingStatus);

/**
 * Schema de validación para importación de listings
 */
export const listingImportSchema = yup.object({
  // Campos requeridos
  listing_type: yup
    .string()
    .required("El tipo de listing es requerido")
    .test("valid-type", "Tipo de listing inválido (use 'sale' o 'rent')", (value) => {
      if (!value) return false;
      return validListingTypes.includes(value as ListingType);
    }),

  price: yup
    .number()
    .required("El precio es requerido")
    .min(0, "El precio no puede ser negativo"),

  whatsapp_contact: yup
    .string()
    .required("El WhatsApp es requerido")
    .min(8, "El WhatsApp debe tener al menos 8 dígitos")
    .max(20, "El WhatsApp no puede exceder 20 caracteres"),

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
    .oneOf(["COP", "USD", "EUR"], "Moneda inválida"),

  price_negotiable: yup
    .boolean()
    .optional()
    .default(false),

  status: yup
    .string()
    .optional()
    .default("draft")
    .test("valid-status", "Estado inválido", (value) => {
      if (!value) return true;
      return validListingStatuses.includes(value as ListingStatus);
    }),

  meta_title: yup
    .string()
    .optional()
    .max(100, "El meta título no puede exceder 100 caracteres"),

  meta_description: yup
    .string()
    .optional()
    .max(500, "La meta descripción no puede exceder 500 caracteres"),

  keywords: yup
    .string()
    .optional()
    .test("valid-keywords", "Formato inválido de keywords", (value) => {
      if (!value) return true;
      const items = value.split(/[,|]/).map((s) => s.trim());
      return items.every((item) => item.length > 0 && item.length <= 50);
    }),

  expenses_amount: yup
    .number()
    .optional()
    .min(0, "Las expensas no pueden ser negativas"),

  expenses_included: yup
    .boolean()
    .optional()
    .default(false),

  virtual_tour_url: yup
    .string()
    .optional()
    .url("URL del tour virtual inválida"),

  video_url: yup
    .string()
    .optional()
    .url("URL del video inválida"),

  available_from: yup
    .string()
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (use YYYY-MM-DD)"),

  minimum_contract_duration: yup
    .number()
    .optional()
    .integer("La duración debe ser un entero")
    .min(1, "La duración mínima es 1 mes")
    .max(120, "La duración máxima es 120 meses"),
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
