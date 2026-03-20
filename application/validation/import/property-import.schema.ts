// application/validation/import/property-import.schema.ts

import * as yup from "yup";
import { PropertyType } from "@/domain/entities/property.enums";

const validPropertyTypes = Object.values(PropertyType);

/**
 * Schema de validación para importación de properties
 */
export const propertyImportSchema = yup.object({
  // Campos requeridos
  title: yup
    .string()
    .required("El título es requerido")
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(200, "El título no puede exceder 200 caracteres"),

  property_type: yup
    .string()
    .required("El tipo de propiedad es requerido")
    .test("valid-type", "Tipo de propiedad inválido", (value) => {
      if (!value) return false;
      return validPropertyTypes.includes(value as PropertyType);
    }),

  city: yup
    .string()
    .required("La ciudad es requerida")
    .max(100, "La ciudad no puede exceder 100 caracteres"),

  state: yup
    .string()
    .required("El estado/departamento es requerido")
    .max(100, "El estado no puede exceder 100 caracteres"),

  // Campos opcionales
  slug: yup
    .string()
    .optional()
    .max(200, "El slug no puede exceder 200 caracteres"),

  description: yup
    .string()
    .optional()
    .max(5000, "La descripción no puede exceder 5000 caracteres"),

  country: yup
    .string()
    .optional()
    .default("Colombia")
    .max(100, "El país no puede exceder 100 caracteres"),

  postal_code: yup
    .string()
    .optional()
    .max(20, "El código postal no puede exceder 20 caracteres"),

  street: yup
    .string()
    .optional()
    .max(200, "La calle no puede exceder 200 caracteres"),

  neighborhood: yup
    .string()
    .optional()
    .max(100, "El barrio no puede exceder 100 caracteres"),

  latitude: yup
    .number()
    .optional()
    .min(-90, "La latitud debe estar entre -90 y 90")
    .max(90, "La latitud debe estar entre -90 y 90"),

  longitude: yup
    .number()
    .optional()
    .min(-180, "La longitud debe estar entre -180 y 180")
    .max(180, "La longitud debe estar entre -180 y 180"),

  bedrooms: yup
    .number()
    .optional()
    .integer("El número de habitaciones debe ser un entero")
    .min(0, "Las habitaciones no pueden ser negativas")
    .max(100, "Máximo 100 habitaciones"),

  bathrooms: yup
    .number()
    .optional()
    .integer("El número de baños debe ser un entero")
    .min(0, "Los baños no pueden ser negativos")
    .max(100, "Máximo 100 baños"),

  total_area: yup
    .number()
    .optional()
    .min(0, "El área total no puede ser negativa"),

  built_area: yup
    .number()
    .optional()
    .min(0, "El área construida no puede ser negativa"),

  lot_area: yup
    .number()
    .optional()
    .min(0, "El área del lote no puede ser negativa"),

  floors: yup
    .number()
    .optional()
    .integer("El número de pisos debe ser un entero")
    .min(0, "Los pisos no pueden ser negativos")
    .max(200, "Máximo 200 pisos"),

  year_built: yup
    .number()
    .optional()
    .integer("El año debe ser un entero")
    .min(1800, "El año debe ser mayor a 1800")
    .max(new Date().getFullYear() + 5, "El año no puede ser futuro"),

  parking_spots: yup
    .number()
    .optional()
    .integer("Los espacios de estacionamiento deben ser un entero")
    .min(0, "Los espacios no pueden ser negativos")
    .max(100, "Máximo 100 espacios"),

  amenities: yup
    .string()
    .optional()
    .test("valid-amenities", "Formato inválido de amenities", (value) => {
      if (!value) return true;
      // Acepta coma-separated o pipe-separated
      const items = value.split(/[,|]/).map((s) => s.trim());
      return items.every((item) => item.length > 0 && item.length <= 50);
    }),
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
