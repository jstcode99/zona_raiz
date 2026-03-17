import i18next from 'i18next'
import * as yup from 'yup'

export const dateRangeSchema = yup
  .string()
  .matches(/^\d{4}-\d{2}-\d{2}$/, () => i18next.t('validations:date_format'))
