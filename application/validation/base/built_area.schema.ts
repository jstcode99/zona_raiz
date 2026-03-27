import i18next from "i18next";
import * as yup from "yup";

export const builtAreaSchema = yup
  .number()
  .min(
    0,
    i18next.t("validations:min.numeric", {
      attribute: "built_area",
      min: "0",
    }),
  )
  .max(
    9999999.9,
    i18next.t("validations:max.numeric", {
      attribute: "built_area",
      max: "9999999.9",
    }),
  );
