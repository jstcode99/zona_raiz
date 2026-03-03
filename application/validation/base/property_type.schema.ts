import { propertyTypeValues } from '@/domain/entities/property.enums'
import i18next from 'i18next'
import * as yup from 'yup'

export const propertyTypeSchema = yup
    .string<string>()
    .oneOf(propertyTypeValues, i18next.t('validations.required', { attribute: 'property_type' }))