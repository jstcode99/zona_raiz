import i18next from "i18next";
import * as yup from "yup";

export const floorsSchema = yup
  .number()
  .integer()
  .min(
    0,
    i18next.t("validations:min.numeric", {
      attribute: "floors",
      min: "0",
    }),
  )
  .max(
    200,
    i18next.t("validations:max.numeric", {
      attribute: "floors",
      max: "200",
    }),
  );
