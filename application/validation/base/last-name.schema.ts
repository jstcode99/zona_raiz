import i18next from 'i18next'
import * as yup from 'yup'

export const lastNameSchema = yup
    .string()
    .min(3, i18next.t('validations:min.string', {
        attribute: 'name',
        min: '3'
    }))
    .max(25, i18next.t('validations:max.string', {
        attribute: 'name',
        max: '25'
    }))