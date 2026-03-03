// ============================================
// SCHEMAS DE BÚSQUEDA/FILTROS
// ============================================
import * as yup from 'yup';
import { searchSchema } from './base/search.schema';
import { idSchema } from './base/id.schema';
import { listingTypeSchema } from './base/listing_type.schema';
import { statusSchema } from './base/status.schema';
import { priceSchema } from './base/price.schema';
import { defaultPropertySearchValues, propertySearchSchema } from './property-search.schema';

export const listingSearchSchema = yup.object({
  search: searchSchema.nullable(),
  real_estate_id: idSchema.nullable(),
  property_id: idSchema.nullable(),
  listing_type: listingTypeSchema.nullable(),
  status: statusSchema.nullable(),
  price: priceSchema.nullable(),
}).concat(propertySearchSchema);

export type ListingSearchFormInput = yup.InferType<typeof listingSearchSchema>


export const defaultListingValues: ListingSearchFormInput = {
  ...defaultPropertySearchValues,
  search: null,
  real_estate_id: null,
  property_id: null,
  listing_type: null,
  status: null,
  price: null,
};
