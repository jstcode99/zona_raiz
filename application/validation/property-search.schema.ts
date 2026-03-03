// ============================================
// SCHEMAS DE BÚSQUEDA/FILTROS
// ============================================
import * as yup from 'yup';
import { addressSchema } from './base/address.schema';
import { bedroomsSchema } from './base/bedrooms.schema';
import { bathroomsSchema } from './base/bathrooms.schema';
import { propertyTypeSchema } from './base/property_type.schema';
import { searchSchema } from './base/search.schema';
import { PropertyType } from '@/domain/entities/property.enums';
import { neighborhoodSchema } from './base/neighborhood.schema';
import { streetSchema } from './base/street.schema';

export const propertySearchSchema = yup.object({
  search: searchSchema.nullable(),
  type: propertyTypeSchema.nullable(),
  bedrooms: bedroomsSchema.nullable(),
  bathrooms: bathroomsSchema.nullable(),
  neighborhood:neighborhoodSchema.nullable(),
  street: streetSchema.nullable(),
}).concat(addressSchema);

export type PropertySearchFormInput = yup.InferType<typeof propertySearchSchema>

export const defaultPropertySearchValues: PropertySearchFormInput = {
  search: '',
  type: PropertyType.Other,
  bedrooms: 0,
  bathrooms: 0,
  city: '',
  state: '',
  country: '',
  neighborhood: '',
  street: '',
};
