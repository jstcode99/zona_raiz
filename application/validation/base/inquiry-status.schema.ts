import { enquiryStatusValues } from "@/domain/entities/enquiry.enums";
import i18next from "i18next";
import * as yup from "yup";

export const inquiryStatusSchema = yup
  .string<string>()
  .oneOf(
    enquiryStatusValues,
    i18next.t("validations.required", { attribute: "status" }),
  );
