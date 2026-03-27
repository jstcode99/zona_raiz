import * as yup from "yup";
import i18next from "i18next";
import { enquiryStatusValues } from "@/domain/entities/enquiry.enums";
import { enquirySourceValues } from "@/domain/entities/enquiry.enums";

export const enquirySearchSchema = yup.object({
  search: yup
    .string()
    .max(
      100,
      i18next.t("validations:max.string", { attribute: "query", max: "100" }),
    )
    .optional(),
  status: yup.string().oneOf(enquiryStatusValues).optional(),
  source: yup.string().oneOf(enquirySourceValues).optional(),
  start_date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, i18next.t("validations:date.format"))
    .optional(),
  end_date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, i18next.t("validations:date.format"))
    .optional(),
});

export type EnquirySearchFormInput = yup.InferType<typeof enquirySearchSchema>;

export const defaultEnquirySearchValues: EnquirySearchFormInput = {
  search: undefined,
  status: undefined,
  source: undefined,
  start_date: undefined,
  end_date: undefined,
};
