import i18next from "i18next";
import * as yup from "yup";

export const otpSchema = yup
  .string()
  .min(
    3,
    i18next.t("validations:min.string", {
      attribute: "otp",
      min: "6",
    }),
  )
  .max(
    6,
    i18next.t("validations:max.string", {
      attribute: "otp",
      max: "6",
    }),
  )
  .required(
    i18next.t("validations:required", {
      attribute: "otp",
    }),
  );
