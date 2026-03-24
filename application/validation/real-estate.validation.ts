import * as yup from "yup";

import { nameSchema } from "./base/name.schema";
import { descriptionSchema } from "./base/description.schema";
import { whatsappSchema } from "./base/whatsapp.schema";
import { requiredAddressSchema } from "./base/address.schema";
import { avatarSchema } from "./base/avatar.schema";

import i18next from "i18next";
import { idSchema } from "./base/id.schema";

export const realEstateSchema = yup
  .object({
    name: nameSchema,
    description: descriptionSchema,
    whatsapp: whatsappSchema,
  })
  .concat(requiredAddressSchema);

export const logoRealEstateSchema = yup.object({
  logo: avatarSchema.required(
    i18next.t("validations.required", {
      attribute: "logo",
    }),
  ),
  id: idSchema,
});

export type RealEstateInput = yup.InferType<typeof realEstateSchema>;

export type LogoInput = yup.InferType<typeof logoRealEstateSchema>;

export const defaultRealEstateValues = {
  name: "Zona raiz",
  description: "zona raiz colombia",
  whatsapp: "+57 3168314191",
  street: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
};
