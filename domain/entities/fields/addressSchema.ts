import i18next from 'i18next'
import * as yup from 'yup'

export const addressSchema = yup.object().shape({
    street: yup
        .string()
        .required(i18next.t('validations.required', {
            attribute: 'street'
        }))
        .min(5, i18next.t('validations.min.string', {
            attribute: 'street',
            min: '5'
        }))
        .max(100, i18next.t('validations.max.string', {
            attribute: 'street',
            max: '100'
        })),
    city: yup
        .string()
        .required(i18next.t('validations.required', {
            attribute: 'city'
        }))
        .min(3, i18next.t('validations.min.string', {
            attribute: 'city',
            min: '3'
        }))
        .max(100, i18next.t('validations.max.string', {
            attribute: 'city',
            max: '100'
        })),
    state: yup
        .string()
        .required(i18next.t('validations.required', {
            attribute: 'state'
        }))
        .min(3, i18next.t('validations.min.string', {
            attribute: 'state',
            min: '3'
        }))
        .max(100, i18next.t('validations.max.string', {
            attribute: 'state',
            max: '100'
        })),

    postal_code: yup
        .string()
        .required(i18next.t('validations.required', {
            attribute: 'postal_code'
        }))
        .matches(/^\d{5}(-\d{4})?$/, 'El código postal debe tener formato válido (ej: 12345 o 12345-6789)'),

    country: yup
        .string()
        .required(i18next.t('validations.required', {
            attribute: 'country'
        }))
        .min(3, i18next.t('validations.min.string', {
            attribute: 'country',
            min: '5'
        }))
        .max(100, i18next.t('validations.max.string', {
            attribute: 'country',
            max: '100'
        })),
});