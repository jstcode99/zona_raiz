import i18next from 'i18next'
import * as yup from 'yup'

export const idSchema = yup
    .string()
    .uuid(() => i18next.t('validations:uuid', { attribute: 'ID' }))
    .required(() => i18next.t('validations:required', { attribute: 'ID' }))