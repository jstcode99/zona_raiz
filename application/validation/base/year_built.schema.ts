import i18next from 'i18next'
import * as yup from 'yup'

export const yearBuiltSchema = yup
    .number()
    .integer()
    .min(1800, i18next.t('validations:min.numeric', {
      attribute: 'year_built',
      min: '1800'
    }))
    .max(new Date().getFullYear() + 5)