// application/validation/import/property-import.schema.ts

import * as yup from "yup";
import i18next from "i18next";
import { PropertyType } from "@/domain/entities/property.enums";

const validPropertyTypes = Object.values(PropertyType);

const t = (key: string, options?: Record<string, unknown>) =>
  i18next.t(key, { ns: "validations", ...options });

/**
 * Schema de validación para importación de properties
 */
export const propertyImportSchema = yup.object({
  // Campos requeridos
  title: yup
    .string()
    .required(t("required", { attribute: "title" }))
    .min(3, t("min.string", { attribute: "title", min: 3 }))
    .max(200, t("max.string", { attribute: "title", max: 200 })),

  property_type: yup
    .string()
    .required(t("required", { attribute: "property_type" }))
    .test(
      "valid-type",
      t("import.validations.invalid_property_type"),
      (value) => {
        if (!value) return false;
        return validPropertyTypes.includes(value as PropertyType);
      },
    ),

  city: yup
    .string()
    .required(t("required", { attribute: "city" }))
    .max(100, t("max.string", { attribute: "city", max: 100 })),

  state: yup
    .string()
    .required(t("required", { attribute: "state" }))
    .max(100, t("max.string", { attribute: "state", max: 100 })),

  // Campos opcionales
  slug: yup
    .string()
    .optional()
    .max(200, t("max.string", { attribute: "slug", max: 200 })),

  description: yup
    .string()
    .optional()
    .max(5000, t("max.string", { attribute: "description", max: 5000 })),

  country: yup
    .string()
    .optional()
    .default("Colombia")
    .max(100, t("max.string", { attribute: "country", max: 100 })),

  postal_code: yup
    .string()
    .optional()
    .max(20, t("max.string", { attribute: "postal_code", max: 20 })),

  street: yup
    .string()
    .optional()
    .max(200, t("max.string", { attribute: "street", max: 200 })),

  neighborhood: yup
    .string()
    .optional()
    .max(100, t("max.string", { attribute: "neighborhood", max: 100 })),

  latitude: yup
    .number()
    .optional()
    .min(-90, t("import.validations.latitude_range"))
    .max(90, t("import.validations.latitude_range")),

  longitude: yup
    .number()
    .optional()
    .min(-180, t("import.validations.longitude_range"))
    .max(180, t("import.validations.longitude_range")),

  bedrooms: yup
    .number()
    .optional()
    .integer(t("integer", { attribute: "bedrooms" }))
    .min(0, t("min.numeric", { attribute: "bedrooms", min: 0 }))
    .max(100, t("import.validations.max_rooms")),

  bathrooms: yup
    .number()
    .optional()
    .integer(t("integer", { attribute: "bathrooms" }))
    .min(0, t("min.numeric", { attribute: "bathrooms", min: 0 }))
    .max(100, t("import.validations.max_rooms")),

  total_area: yup
    .number()
    .optional()
    .min(0, t("min.numeric", { attribute: "total_area", min: 0 })),

  built_area: yup
    .number()
    .optional()
    .min(0, t("min.numeric", { attribute: "built_area", min: 0 })),

  lot_area: yup
    .number()
    .optional()
    .min(0, t("min.numeric", { attribute: "lot_area", min: 0 })),

  floors: yup
    .number()
    .optional()
    .integer(t("integer", { attribute: "floors" }))
    .min(0, t("min.numeric", { attribute: "floors", min: 0 }))
    .max(200, t("import.validations.max_floors")),

  year_built: yup
    .number()
    .optional()
    .integer(t("integer", { attribute: "year_built" }))
    .min(1800, t("import.validations.year_min"))
    .max(new Date().getFullYear() + 5, t("import.validations.year_future")),

  parking_spots: yup
    .number()
    .optional()
    .integer(t("import.validations.integer_parking"))
    .min(0, t("min.numeric", { attribute: "parking_spots", min: 0 }))
    .max(100, t("import.validations.max_parking")),

  amenities: yup
    .string()
    .optional()
    .test(
      "valid-amenities",
      t("import.validations.invalid_amenities_format"),
      (value) => {
        if (!value) return true;
        // Acepta coma-separated o pipe-separated
        const items = value.split(/[,|]/).map((s) => s.trim());
        return items.every((item) => item.length > 0 && item.length <= 50);
      },
    ),
});

export type PropertyImportInput = yup.InferType<typeof propertyImportSchema>;

export const propertyImportHeaders = [
  "title",
  "property_type",
  "city",
  "state",
  "country",
  "postal_code",
  "street",
  "neighborhood",
  "latitude",
  "longitude",
  "bedrooms",
  "bathrooms",
  "total_area",
  "built_area",
  "lot_area",
  "floors",
  "year_built",
  "parking_spots",
  "amenities",
  "description",
] as const;

export type PropertyImportHeader = (typeof propertyImportHeaders)[number];
