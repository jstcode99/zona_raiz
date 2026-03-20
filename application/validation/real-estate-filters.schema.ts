// ============================================
// SCHEMA DE FILTROS PARA REAL ESTATES
// (usado en real-estate-form-filters.tsx)
// ============================================
import * as yup from "yup"
import { searchSchema } from "./base/search.schema"
import { whatsappSchema } from "./base/whatsapp.schema"

export const realEstateFiltersSchema = yup.object({
  searchQuery: searchSchema.nullable(),
  whatsapp: whatsappSchema.nullable(),
})

export type RealEstateFiltersFormInput = yup.InferType<typeof realEstateFiltersSchema>

export const defaultRealEstateFiltersValues: RealEstateFiltersFormInput = {
  searchQuery: null,
  whatsapp: null,
}
