import i18next from "i18next";
import * as yup from "yup";

export const searchSchema = yup
  .string()
  .max(
    100,
    i18next.t("validations:max.string", { attribute: "query", max: "100" }),
  )
  .optional();
