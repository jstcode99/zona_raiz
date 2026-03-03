import { listingTypeValues } from '@/domain/entities/listing.enums'
import i18next from 'i18next'
import * as yup from 'yup'

export const listingTypeSchema = yup
    .string<string>()
    .oneOf(listingTypeValues, i18next.t('validations.required', { attribute: 'listing_type' }))