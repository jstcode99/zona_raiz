import i18next from 'i18next'
import * as yup from 'yup'

export const streetField = yup
  .string()
  .min(5, i18next.t('validations:min.string', { attribute: 'street', min: '5' }))
  .max(100, i18next.t('validations:max.string', { attribute: 'street', max: '100' }))

export const cityField = yup
  .string()
  .min(3, i18next.t('validations:min.string', { attribute: 'city', min: '3' }))
  .max(100, i18next.t('validations:max.string', { attribute: 'city', max: '100' }))

export const stateField = yup
  .string()
  .min(3, i18next.t('validations:min.string', { attribute: 'state', min: '3' }))
  .max(100, i18next.t('validations:max.string', { attribute: 'state', max: '100' }))

export const postalCodeField = yup
  .string()
  .matches(/^\d{5}(-\d{4})?$/, 'El código postal debe tener formato válido (ej: 12345 o 12345-6789)')

export const countryField = yup
  .string()
  .min(3, i18next.t('validations:min.string', { attribute: 'country', min: '5' }))
  .max(100, i18next.t('validations:max.string', { attribute: 'country', max: '100' }))


export const addressSchema = yup.object({
  street: streetField,
  city: cityField,
  state: stateField,
  postal_code: postalCodeField,
  country: countryField,
})


export const requiredAddressSchema = yup.object({
  street: streetField.required(i18next.t('validations:required', { attribute: 'street' })),
  city: cityField.required(i18next.t('validations:required', { attribute: 'city' })),
  state: stateField.required(i18next.t('validations:required', { attribute: 'state' })),
  postal_code: postalCodeField.required(i18next.t('validations:required', { attribute: 'postal_code' })),
  country: countryField.required(i18next.t('validations:required', { attribute: 'country' })),
})