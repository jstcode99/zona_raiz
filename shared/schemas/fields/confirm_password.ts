import i18next from 'i18next'
import * as yup from 'yup'

export const password_confirmationSchema = yup
    .string()
    .required(i18next.t('validations.required', {
        attribute: 'password_confirmation'
    }))
    .oneOf(
        [yup.ref('password')],
        i18next.t('validations.same', {
            attribute: 'password_confirmation',
            other: 'password'
        })
    )