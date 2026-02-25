import i18next from 'i18next';
import * as yup from 'yup';
import { addressSchema } from './base/address.schema';
import { PropertyType } from '../property.entity';
import { slugSchema } from './base/slug.schema';

// ============================================
// SCHEMAS DE PROPIEDADES
// ============================================

export const propertySchema = yup.object({
  title: yup
    .string()
    .required(i18next.t('validations.required', {
      attribute: 'title'
    }))
    .min(10, i18next.t('validations.min.string', {
      attribute: 'title',
      min: '10'
    }))
    .max(200, i18next.t('validations.max.string', {
      attribute: 'title',
      max: '200'
    })),
  slug: slugSchema,
  description: yup
    .string()
    .required(i18next.t('validations.required', {
      attribute: 'description'
    }))
    .max(5000, i18next.t('validations.max.string', {
      attribute: 'description',
      max: '5000'
    })),
  property_type: yup
    .string<string>()
    .oneOf(['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial', 'office', 'warehouse', 'other'])
    .required(i18next.t('validations.required', {
      attribute: 'property_type'
    })),
  latitude: yup
    .number()
    .required(i18next.t('validations.required', {
      attribute: 'latitude'
    }))
    .min(-90, i18next.t('validations.min.numeric', {
      attribute: 'latitude',
      min: '-90'
    }))
    .max(90, i18next.t('validations.max.numeric', {
      attribute: 'latitude',
      max: '90'
    }))
    .nullable(),
  longitude: yup
    .number()
    .required(i18next.t('validations.required', {
      attribute: 'longitude'
    }))
    .min(-180, i18next.t('validations.min.numeric', {
      attribute: 'longitude',
      min: '-180'
    }))
    .max(180, i18next.t('validations.max.numeric', {
      attribute: 'longitude',
      max: '180'
    })),
  neighborhood: yup
    .string()
    .max(100, i18next.t('validations.max.numeric', {
      attribute: 'neighborhood',
      max: '100'
    }))
    .nullable(),
  bedrooms: yup
    .number()
    .integer()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'bedrooms',
      min: '0'
    }))
    .max(50, i18next.t('validations.max.numeric', {
      attribute: 'bedrooms',
      max: '50'
    }))
    .nullable(),
  bathrooms: yup
    .number()
    .integer()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'bathrooms',
      min: '0'
    }))
    .max(50, i18next.t('validations.max.numeric', {
      attribute: 'bathrooms',
      max: '50'
    }))
    .nullable(),
  total_area: yup
    .number()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'total_area',
      min: '0'
    }))
    .max(9999999.9, i18next.t('validations.max.numeric', {
      attribute: 'total_area',
      max: '9999999.9'
    }))
    .nullable(),
  built_area: yup
    .number()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'built_area',
      min: '0'
    }))
    .max(9999999.9, i18next.t('validations.max.numeric', {
      attribute: 'built_area',
      max: '9999999.9'
    }))
    .nullable(),
  lot_area: yup
    .number()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'lot_area',
      min: '0'
    }))
    .max(9999999.9, i18next.t('validations.max.numeric', {
      attribute: 'lot_area',
      max: '9999999.9'
    }))
    .nullable(),
  floors: yup
    .number()
    .integer()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'floors',
      min: '0'
    }))
    .max(200, i18next.t('validations.max.numeric', {
      attribute: 'floors',
      max: '200'
    }))
    .nullable(),
  year_built: yup
    .number()
    .integer()
    .min(1800, i18next.t('validations.min.numeric', {
      attribute: 'year_built',
      min: '1800'
    }))
    .max(new Date().getFullYear() + 5)
    .nullable(),
  parking_spots: yup
    .number()
    .integer()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'parking_spots',
      min: '0'
    }))
    .max(100, i18next.t('validations.max.numeric', {
      attribute: 'parking_spots',
      max: '100'
    }))
    .nullable(),
  amenities: yup
    .array()
    .of(
      yup.object({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    )
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        try {
          return JSON.parse(originalValue);
        } catch {
          return [];
        }
      }
      return value;
    })
    .default([])
    .default([]),
  address: yup
    .string()
    .required(i18next.t('validations.required', {
      attribute: 'address'
    }))
    .min(5, i18next.t('validations.min.string', {
      attribute: 'address',
      min: '5'
    }))
    .max(100, i18next.t('validations.max.string', {
      attribute: 'address',
      max: '100'
    })),
}).concat(addressSchema);

export type PropertyFormValues = yup.InferType<typeof propertySchema>

export const defaultPropertyValues: PropertyFormValues = {
  title: '',
  slug: '',
  description: '',
  property_type: PropertyType.Other,
  street: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  latitude: 0,
  longitude: 0,
  neighborhood: '',
  bedrooms: 0,
  bathrooms: 0,
  total_area: 0,
  built_area: 0,
  lot_area: 0,
  floors: 0,
  year_built: 2000,
  parking_spots: 0,
  amenities: [],
}

export const PropertyImageSchema = yup.object({
  file: yup.mixed<File>()
    .required('Archivo requerido')
    .test('fileSize', 'Máximo 10MB', (value) => {
      return value && value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Solo imágenes', (value) => {
      return value && value.type.startsWith('image/');
    }),
  is_primary: yup.boolean().default(false),
  alt_text: yup.string().max(200).nullable(),
});

export const PropertyImageFormValues = PropertyImageSchema.partial();
