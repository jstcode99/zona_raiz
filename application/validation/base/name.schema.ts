import i18next from 'i18next'
import * as yup from 'yup'

export const nameSchema = yup
    .string()
    .min(3, i18next.t('validations:min.string', {
        attribute: 'name',
        min: '3'
    }))
    .max(25, i18next.t('validations:max.string', {
        attribute: 'name',
        max: '25'
    }))
    .required(i18next.t('validations:required', {
        attribute: 'name'
    }))