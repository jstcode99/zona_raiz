// ============================================
// SCHEMA DE BÚSQUEDA COMPLETA PARA LISTINGS
// (usado en listing-search-filters.tsx)
// ============================================
import * as yup from "yup"
import { searchSchema } from "./base/search.schema"
import { addressSchema } from "./base/address.schema"
import { priceSchema } from "./base/price.schema"
import { bedroomsSchema } from "./base/bedrooms.schema"
import { bathroomsSchema } from "./base/bathrooms.schema"
import { propertyTypeSchema } from "./base/property_type.schema"
import { listingTypeSchema } from "./base/listing_type.schema"

export const listingSearchFiltersSchema = yup.object({
  q: searchSchema.nullable(),
  listing_type: listingTypeSchema.nullable(),
  type: propertyTypeSchema.nullable(),
  ...addressSchema.fields,
  neighborhood: yup.string().nullable(),
  street: yup.string().nullable(),
  min_price: priceSchema.nullable(),
  max_price: priceSchema.nullable(),
  min_bedrooms: bedroomsSchema.nullable(),
  min_bathrooms: bathroomsSchema.nullable(),
  amenities: yup.array().of(yup.string()).nullable(),
  sort_by: yup.string().nullable(),
  page: yup.number().min(1).nullable(),
  limit: yup.number().min(1).max(100).nullable(),
})

export type ListingSearchFiltersInput = yup.InferType<typeof listingSearchFiltersSchema>

export const defaultListingSearchFiltersValues: ListingSearchFiltersInput = {
  q: null,
  listing_type: null,
  type: null,
  country: null,
  state: null,
  city: null,
  neighborhood: null,
  street: null,
  min_price: 0,
  max_price: 100000000,
  min_bedrooms: null,
  min_bathrooms: null,
  amenities: [],
  sort_by: "created_at_desc",
  page: 1,
  limit: 12,
}

// Alias para compatibilidad con consumidores externos
export const defaultFilters = defaultListingSearchFiltersValues
