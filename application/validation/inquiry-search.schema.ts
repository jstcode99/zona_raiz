import * as yup from 'yup';
import { inquiryStatusValues } from '@/domain/entities/inquiry.enums';
import { inquirySourceValues } from '@/domain/entities/inquiry.enums';
import i18next from 'i18next';

export const inquirySearchSchema = yup.object({
  search: yup.string().max(100, i18next.t('validations.max.string', { attribute: 'query', max: '100' })).nullable(),
  status: yup.string().oneOf(inquiryStatusValues).nullable(),
  source: yup.string().oneOf(inquirySourceValues).nullable(),
  start_date: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, i18next.t('validations.date.format')).nullable(),
  end_date: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/, i18next.t('validations.date.format')).nullable(),
});

export type InquirySearchFormInput = yup.InferType<typeof inquirySearchSchema>;

export const defaultInquirySearchValues: InquirySearchFormInput = {
  search: '',
  status: null,
  source: null,
  start_date: null,
  end_date: null,
};
