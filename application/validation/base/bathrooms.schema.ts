import i18next from "i18next";
import * as yup from "yup";

export const bathroomsSchema = yup
  .number()
  .integer()
  .min(
    0,
    i18next.t("validations:min.numeric", {
      attribute: "bathrooms",
      min: "0",
    }),
  )
  .max(
    50,
    i18next.t("validations:max.numeric", {
      attribute: "bathrooms",
      max: "50",
    }),
  )
  .optional();
