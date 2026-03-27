import * as yup from "yup";
import { nameSchema } from "./base/name.schema";
import { phoneSchema } from "./base/phone.schema";
import { avatarSchema } from "./base/avatar.schema";
import i18next from "i18next";

export const profileSchema = yup.object({
  full_name: nameSchema,
  phone: phoneSchema,
});

export const profileAvatarSchema = yup.object({
  avatar: avatarSchema.required(
    i18next.t("validations:required", {
      attribute: "avatar",
    }),
  ),
});

export type ProfileInput = yup.InferType<typeof profileSchema>;
export type AvatarInput = yup.InferType<typeof profileAvatarSchema>;

export const defaultUserProfileValues = {
  full_name: "",
  phone: "",
};
