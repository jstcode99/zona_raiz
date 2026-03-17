import i18next from 'i18next'
import * as yup from 'yup'

export const typeSchema = yup
    .string()
    .required(i18next.t('validations:required', {
        attribute: 'type'
    }))