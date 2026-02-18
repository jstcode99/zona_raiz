import i18next from 'i18next'
import * as yup from 'yup'

export const addressSchema = yup
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
    }))
    .trim()