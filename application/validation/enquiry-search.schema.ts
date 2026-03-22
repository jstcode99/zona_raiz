import * as yup from "yup";
import i18next from "i18next";
import { enquiryStatusValues } from "@/domain/entities/enquiry.enums";
import { enquirySourceValues } from "@/domain/entities/enquiry.enums";

export const enquirySearchSchema = yup.object({
  search: yup
    .string()
    .max(
      100,
      i18next.t("validations.max.string", { attribute: "query", max: "100" }),
    )
    .nullable(),
  status: yup.string().oneOf(enquiryStatusValues).nullable(),
  source: yup.string().oneOf(enquirySourceValues).nullable(),
  start_date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, i18next.t("validations.date.format"))
    .nullable(),
  end_date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, i18next.t("validations.date.format"))
    .nullable(),
});

export type EnquirySearchFormInput = yup.InferType<typeof enquirySearchSchema>;

export const defaultEnquirySearchValues: EnquirySearchFormInput = {
  search: "",
  status: null,
  source: null,
  start_date: null,
  end_date: null,
};
