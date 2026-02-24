// ============================================
// SCHEMAS DE BÚSQUEDA/FILTROS
// ============================================
import i18next from 'i18next';
import * as yup from 'yup';

export const listingSearchSchema = yup.object({
  query: yup
    .string()
    .max(100, i18next.t('validations.max.string', { attribute: 'query', max: '100' }))
    .nullable(),
  city: yup
    .string()
    .max(100, i18next.t('validations.max.string', { attribute: 'city', max: '100' }))
    .nullable(),
  listing_type: yup
    .string<string>()
    .oneOf(['sale', 'rent', 'swap', 'other'])
    .nullable(),
  property_type: yup
    .string<string>()
    .oneOf(['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial', 'office', 'warehouse', 'other'])
    .nullable(),
  min_price: yup
    .number()
    .min(0, i18next.t('validations.min.numeric', { attribute: 'min_price', min: '0' }))
    .nullable(),
  max_price: yup
    .number()
    .min(0, i18next.t('validations.min.numeric', { attribute: 'max_price', min: '0' }))
    .nullable(),
  bedrooms: yup
    .number()
    .integer()
    .min(0, i18next.t('validations.min.numeric', { attribute: 'bedrooms', min: '0' }))
    .nullable(),
  bathrooms: yup
    .number()
    .integer()
    .min(0, i18next.t('validations.min.numeric', { attribute: 'bathrooms', min: '0' }))
    .nullable(),
  amenities: yup.array().of(yup.string()).nullable(),
  featured_only: yup.boolean().default(false),
  page: yup
    .number()
    .integer()
    .min(1, i18next.t('validations.min.numeric', { attribute: 'page', min: '1' }))
    .default(1),
  limit: yup
    .number()
    .integer()
    .min(1, i18next.t('validations.min.numeric', { attribute: 'limit', min: '1' }))
    .max(100, i18next.t('validations.max.numeric', { attribute: 'limit', max: '100' }))
    .default(20),
});

export type ListingSearchFormValues = yup.InferType<typeof listingSearchSchema>