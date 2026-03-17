import i18next from 'i18next'
import * as yup from 'yup'

export const descriptionSchema = yup
    .string()
    .required(i18next.t('validations:required', {
        attribute: 'description'
    }))
    .min(10, i18next.t('validations:min.string', {
        attribute: 'description',
        min: '10'
    }))
    .max(100, i18next.t('validations:max.string', {
        attribute: 'description',
        max: '100'
    }))