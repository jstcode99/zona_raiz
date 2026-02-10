import i18next from 'i18next'
import * as yup from 'yup'

export const emailSchema = yup
    .string()
    .required(i18next.t('validations.required', {
        attribute: 'email'
    }))
    .email(i18next.t('validations.email', {
        attribute: 'email'
    }))
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
        message: i18next.t('validations.email', {
            attribute: 'email'
        })
    })