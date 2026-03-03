import i18next from 'i18next'
import * as yup from 'yup'

export const streetSchema = yup
    .string()
    .max(100, i18next.t('validations.max.numeric', {
      attribute: 'street',
      max: '100'
    }))