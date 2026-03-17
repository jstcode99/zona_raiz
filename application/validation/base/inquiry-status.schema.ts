import { inquiryStatusValues } from '@/domain/entities/inquiry.enums'
import i18next from 'i18next'
import * as yup from 'yup'

export const inquiryStatusSchema = yup
  .string<string>()
  .oneOf(inquiryStatusValues, () => i18next.t('validations:required', { attribute: 'status' }))
