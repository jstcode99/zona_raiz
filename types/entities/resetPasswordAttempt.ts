import i18next from 'i18next'
import * as yup from 'yup'

export const schemaResetPasswordAttempt = yup.object().shape({
  email: yup
    .string()
    .email(`${i18next.t('commons.email')} ${i18next.t('invalid')}`)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: i18next.t('forms.sign-in.fields.email.message'),
    }),
})