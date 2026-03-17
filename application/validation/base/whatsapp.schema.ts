import i18next from 'i18next'
import * as yup from 'yup'

export const whatsappSchema = yup
    .string()
    .required(i18next.t('validations:required', {
        attribute: 'WhatsApp'
    }))
    .matches(
        /^\+?[0-9\s\-\(\)]+$/,
        'Formato de WhatsApp inválido. Ej: +1234567890'
    )
    .min(10, i18next.t('validations:min.string', {
        attribute: 'WhatsApp',
        min: '10'
    }))
    .max(20, i18next.t('validations:max.string', {
        attribute: 'WhatsApp',
        max: '10'
    }))