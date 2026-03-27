import * as yup from "yup";
import i18next from "i18next";
import { EUserRole } from "@/domain/entities/profile.entity";
import { emailSchema } from "./base/email.schema";

export const userSchema = yup.object({
  email: emailSchema.required(
    i18next.t("validations:required", {
      attribute: "email",
    }),
  ),
  full_name: yup
    .string()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .max(
      255,
      i18next.t("validations:max", {
        attribute: "full_name",
        max: 255,
      }),
    )
    .nullable()
    .defined(),
  role: yup
    .mixed<EUserRole>()
    .oneOf(
      Object.values(EUserRole),
      i18next.t("validations:invalid", {
        attribute: "role",
      }),
    )
    .required(
      i18next.t("validations:required", {
        attribute: "role",
      }),
    ),
});

export interface UserInput extends yup.InferType<typeof userSchema> {}

export const defaultUserValues: UserInput = {
  email: "",
  full_name: null,
  role: EUserRole.Client,
};
