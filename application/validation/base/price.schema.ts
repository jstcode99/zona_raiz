import i18next from 'i18next'
import * as yup from 'yup'

export const priceSchema = yup
    .number()
    .min(0, i18next.t('validations.min.numeric', {
      attribute: 'price',
      min: '0'
    }))
    .max(9999999999.9, i18next.t('validations.max.numeric', {
      attribute: 'price',
      max: '9999999999.9'
    }))