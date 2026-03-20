import i18next from 'i18next';
import * as yup from 'yup';

/**
 * Import validation schema
 * This is a flexible schema that can be adapted for different import types
 * For now, we'll create a basic schema that validates the file upload
 */
export const importFileSchema = yup.object({
  file: yup.mixed<File>()
    .required(i18next.t('validations.required', { attribute: 'file' }))
    .test('fileSize', 'Máximo 10MB', (value) => {
      return value && value.size <= 10 * 1024 * 1024;
    })
    .test('fileType', 'Tipo de archivo no soportado', (value) => {
      if (!value) return false;
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ];
      return allowedTypes.includes(value.type);
    })
});

export const importDataSchema = yup.object({
  headers: yup.array().of(yup.string()).required(),
  rows: yup.array().of(yup.array().of(yup.string())).required(),
});

export const confirmImportSchema = yup.object({
  headers: yup.array().of(yup.string()).required(),
  rows: yup.array().of(yup.array().of(yup.string())).required(),
});

export type ImportFileInput = yup.InferType<typeof importFileSchema>;
export type ImportDataInput = yup.InferType<typeof importDataSchema>;
export type ConfirmImportInput = yup.InferType<typeof confirmImportSchema>;

export const defaultImportFileValues: ImportFileInput = {
  file: null as unknown as File
};