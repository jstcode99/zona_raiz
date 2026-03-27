import i18next from "i18next";
import * as yup from "yup";

export const neighborhoodSchema = yup.string().max(
  100,
  i18next.t("validations:max.numeric", {
    attribute: "neighborhood",
    max: "100",
  }),
);
