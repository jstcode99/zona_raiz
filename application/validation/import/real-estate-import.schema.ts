// application/validation/import/real-estate-import.schema.ts

import * as yup from "yup";

/**
 * Schema de validación para importación de real estates (inmobiliarias)
 */
export const realEstateImportSchema = yup.object({
  // Campos requeridos
  name: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),

  whatsapp: yup
    .string()
    .required("El WhatsApp es requerido")
    .min(8, "El WhatsApp debe tener al menos 8 dígitos")
    .max(20, "El WhatsApp no puede exceder 20 caracteres"),

  city: yup
    .string()
    .required("La ciudad es requerida")
    .max(100, "La ciudad no puede exceder 100 caracteres"),

  state: yup
    .string()
    .required("El estado/departamento es requerido")
    .max(100, "El estado no puede exceder 100 caracteres"),

  // Campos opcionales
  description: yup
    .string()
    .optional()
    .max(5000, "La descripción no puede exceder 5000 caracteres"),

  email: yup
    .string()
    .optional()
    .email("Email inválido"),

  phone: yup
    .string()
    .optional()
    .max(20, "El teléfono no puede exceder 20 caracteres"),

  country: yup
    .string()
    .optional()
    .default("Colombia")
    .max(100, "El país no puede exceder 100 caracteres"),

  street: yup
    .string()
    .optional()
    .max(200, "La calle no puede exceder 200 caracteres"),

  postal_code: yup
    .string()
    .optional()
    .max(20, "El código postal no puede exceder 20 caracteres"),
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
