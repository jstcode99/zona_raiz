import * as yup from "yup";
import { realEstateSchema } from "../real-estate.validation";

/**
 * Schema de validación para importación de real estates (inmobiliarias)
 */
export const realEstateImportSchema = realEstateSchema;

export type RealEstateImportInput = yup.InferType<
  typeof realEstateImportSchema
>;

export const realEstateImportHeaders = [
  "name",
  "description",
  "whatsapp",
  "street",
  "city",
  "state",
  "country",
  "postal_code",
] as const;

export type RealEstateImportHeader = (typeof realEstateImportHeaders)[number];

/**
 * Headers en español para plantillas de importación de real estates
 */
export const realEstateImportHeadersES = [
  "nombre",
  "descripción",
  "whatsapp",
  "calle",
  "ciudad",
  "estado",
  "país",
  "código_postal",
] as const;

export type RealEstateImportHeaderES =
  (typeof realEstateImportHeadersES)[number];
