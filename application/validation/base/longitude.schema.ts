import i18next from 'i18next'
import * as yup from 'yup'

export const longitudeSchema = yup
    .number()
    .required(i18next.t('validations:required', {
      attribute: 'longitude'
    }))
    .min(-180, i18next.t('validations:min.numeric', {
      attribute: 'longitude',
      min: '-180'
    }))
    .max(180, i18next.t('validations:max.numeric', {
      attribute: 'longitude',
      max: '180'
    }))