import i18next from 'i18next'
import * as yup from 'yup'

export const latitudeSchema = yup
    .number()
    .required(i18next.t('validations.required', {
      attribute: 'latitude'
    }))
    .min(-90, i18next.t('validations.min.numeric', {
      attribute: 'latitude',
      min: '-90'
    }))
    .max(90, i18next.t('validations.max.numeric', {
      attribute: 'latitude',
      max: '90'
    }))