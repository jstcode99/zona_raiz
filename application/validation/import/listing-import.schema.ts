import * as yup from "yup";
import { createListingSchema } from "../listing.validation";

export const listingImportSchema = createListingSchema;

export type ListingImportInput = yup.InferType<typeof listingImportSchema>;

export const listingImportHeaders = [
  "listing_type",
  "price",
  "currency",
  "price_negotiable",
  "status",
  "meta_title",
  "meta_description",
  "keywords",
  "virtual_tour_url",
  "video_url",
  "available_from",
  "minimum_contract_duration",
  "whatsapp_contact",
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
  "meta_descripción",
  "palabras_clave",
  "tour_virtual",
  "video_url",
  "disponible_desde",
  "id_propiedad",
  "duración_mínima_contrato",
] as const;

export type ListingImportHeaderES = (typeof listingImportHeadersES)[number];
