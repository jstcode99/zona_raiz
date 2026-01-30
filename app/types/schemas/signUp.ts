import i18next from 'i18next'
import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup)

export const schemaSignUp = yup.object().shape({
  name: yup
    .string()
    .required(i18next.t('forms.sign-up.fields.name.message'))
    .min(3, i18next.t('forms.sign-up.fields.name.message'))
    .max(80, i18next.t('forms.sign-up.fields.name.message1')),
  last_name: yup
    .string()
    .min(3, i18next.t('forms.sign-up.fields.last_name.message'))
    .max(80, i18next.t('forms.sign-up.fields.last_name.message1')),
  email: yup
    .string()
    .required(i18next.t('forms.sign-up.fields.email.message'))
    .email(`${i18next.t('commons.email')} ${i18next.t('invalid')}`)
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: i18next.t('forms.sign-in.fields.email.message'),
    }),
  phone: yup
    .string()
    .required(i18next.t('forms.sign-up.fields.phone.message'))
    .min(10, i18next.t('forms.sign-up.fields.phone.message'))
    .max(16, i18next.t('forms.sign-up.fields.phone.message1')),
  password: yup
    .string()
    .password()
    .required(i18next.t('forms.sign-up.fields.password.message')),
  password_confirmation: yup.string()
    .required(i18next.t('forms.sign-up.fields.password-confirmation.message'))
    .oneOf([yup.ref('password')],  i18next.t('forms.sign-up.fields.password-confirmation.message')),
})