import i18next from "i18next";
import * as yup from "yup";

export const bedroomsSchema = yup
  .number()
  .integer()
  .min(
    0,
    i18next.t("validations:min.numeric", {
      attribute: "bedrooms",
      min: "0",
    }),
  )
  .max(
    50,
    i18next.t("validations:max.numeric", {
      attribute: "bedrooms",
      max: "50",
    }),
  )
  .optional();
