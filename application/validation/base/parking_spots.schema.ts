import i18next from "i18next";
import * as yup from "yup";

export const parkingSpotsSchema = yup
  .number()
  .integer()
  .min(
    0,
    i18next.t("validations:min.numeric", {
      attribute: "parking_spots",
      min: "0",
    }),
  )
  .max(
    100,
    i18next.t("validations:max.numeric", {
      attribute: "parking_spots",
      max: "100",
    }),
  );
