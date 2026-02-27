import i18next from 'i18next'
import * as yup from 'yup'

export const slugSchema = yup
  .string()
  .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, i18next.t('validations.slugFormat'))
  .required(i18next.t('validations.required', { attribute: 'slug' }))