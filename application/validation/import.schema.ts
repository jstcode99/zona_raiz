import * as yup from "yup";

export const confirmImportSchema = yup.object({
  headers: yup.array().of(yup.string()).required(),
  rows: yup.array().of(yup.array().of(yup.string())).required(),
});

export type ConfirmImportInput = yup.InferType<typeof confirmImportSchema>;
