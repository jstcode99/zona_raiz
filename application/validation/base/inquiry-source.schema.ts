import { inquirySourceValues } from '@/domain/entities/inquiry.enums'
import i18next from 'i18next'
import * as yup from 'yup'

export const inquirySourceSchema = yup
  .string<string>()
  .oneOf(inquirySourceValues, i18next.t('validations.required', { attribute: 'source' }))
