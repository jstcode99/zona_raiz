import * as yup from "yup";
import YupPassword from "yup-password";
YupPassword(yup);
import i18next from "i18next";

export const passwordSchema = yup
  .string()

  .min(
    8,
    i18next.t("validations:min.string", {
      attribute: "password",
      min: "8",
    }),
  )
  .max(
    25,
    i18next.t("validations:max.string", {
      attribute: "password",
      max: "25",
    }),
  )
  .minLowercase(
    1,
    i18next.t("validations:password.mixed", {
      attribute: "password",
    }),
  )
  .minUppercase(
    1,
    i18next.t("validations:password.mixed", {
      attribute: "password",
    }),
  )
  .minNumbers(
    1,
    i18next.t("validations:password.numbers", {
      attribute: "password",
    }),
  )
  .minSymbols(
    1,
    i18next.t("validations:password.symbols", {
      attribute: "password",
    }),
  )
  .required(
    i18next.t("validations:validations:required", {
      attribute: "password",
    }),
  );
