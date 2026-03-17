import i18next from 'i18next'
import * as yup from 'yup'

export const phoneSchema = yup
    .string()
    .min(6, i18next.t('validations:min.string', {
        attribute: 'phone',
        min: '6'
    }))
    .max(16, i18next.t('validations:max.string', {
        attribute: 'phone',
        max: '16'
    }))
    .required(i18next.t('validations:required', {
        attribute: 'phone'
    }))