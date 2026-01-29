import i18next from 'i18next'
import * as yup from 'yup'

export const verifyOTP = yup.object().shape({
  code: yup
    .string()
    .min(6)
    .max(6)
    .required(i18next.t('forms.verify-account.fields.code.message')),
  type: yup.string().required(),
  email: yup
    .string()
    .email(`${i18next.t('commons.email')} ${i18next.t('invalid')}`)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: i18next.t('forms.sign-in.fields.email.message'),
    }),
})
