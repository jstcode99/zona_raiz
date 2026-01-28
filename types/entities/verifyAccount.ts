import i18next from 'i18next'
import * as yup from 'yup'

export const verifyAccount = yup.object().shape({
  code: yup
    .number()
    .min(6)
    .required(i18next.t('forms.verify-account.fields.code.message')),
})
