import { enquirySourceValues } from "@/domain/entities/enquiry.enums";
import i18next from "i18next";
import * as yup from "yup";

export const enquirySourceSchema = yup
  .string<string>()
  .oneOf(
    enquirySourceValues,
    i18next.t("validations:required", { attribute: "source" }),
  );
