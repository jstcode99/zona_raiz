import i18next from 'i18next'
import * as yup from 'yup'

export const idSchema = yup
    .string()
    .uuid('ID inválido')
    .required(i18next.t('validations.required', {
        attribute: 'ID'
    }))