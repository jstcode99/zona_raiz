import * as yup from "yup";
import { idSchema } from "./base/id.schema";
import i18next from "i18next";

export const agentToggleSchema = yup.object({
  real_estate_id: idSchema.required(
    i18next.t("validations:required", {
      attribute: "real_estate_id",
    }),
  ),
  profile_id: idSchema.required(
    i18next.t("validations:required", {
      attribute: "profile_id",
    }),
  ),
});

export type agentToggleFormInput = yup.InferType<typeof agentToggleSchema>;
