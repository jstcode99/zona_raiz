import i18next from 'i18next'
import * as yup from 'yup'

export const fileSchema = yup
     yup.mixed<File>()
    .required(i18next.t('validations.required', {
        attribute: 'ID'
    }))