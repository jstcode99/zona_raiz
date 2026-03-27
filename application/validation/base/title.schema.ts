import i18next from "i18next";
import * as yup from "yup";

export const titleSchema = yup
  .string()
  .required(
    i18next.t("validations:required", {
      attribute: "title",
    }),
  )
  .min(
    10,
    i18next.t("validations:min.string", {
      attribute: "title",
      min: "10",
    }),
  )
  .max(
    200,
    i18next.t("validations:max.string", {
      attribute: "title",
      max: "200",
    }),
  );
