// ============================================
// SCHEMAS DE CONSULTAS (ENQUIRIES)
// ============================================
import i18next from "i18next";
import * as yup from "yup";

export const enquirySchema = yup.object({
  listing_id: yup
    .string()
    .uuid(i18next.t("validations.uuid", { attribute: "listing_id" }))
    .required(i18next.t("validations.required", { attribute: "listing_id" })),
  name: yup
    .string()
    .required(i18next.t("validations.required", { attribute: "name" }))
    .min(
      2,
      i18next.t("validations.min.string", { attribute: "name", min: "2" }),
    )
    .max(
      100,
      i18next.t("validations.max.string", { attribute: "name", max: "100" }),
    ),
  email: yup
    .string()
    .email(i18next.t("validations.email", { attribute: "email" }))
    .max(
      100,
      i18next.t("validations.max.string", { attribute: "email", max: "100" }),
    )
    .nullable(),
  phone: yup
    .string()
    .matches(
      /^[\d\s\-\+\(\)]+$/,
      i18next.t("validations.phone", { attribute: "phone" }),
    )
    .max(
      30,
      i18next.t("validations.max.string", { attribute: "phone", max: "30" }),
    )
    .nullable(),
  message: yup
    .string()
    .max(
      2000,
      i18next.t("validations.max.string", {
        attribute: "message",
        max: "2000",
      }),
    )
    .nullable(),
  source: yup
    .string<string>()
    .oneOf(["web", "whatsapp", "phone", "email", "referral"])
    .default("web"),
  utm_source: yup
    .string()
    .max(
      100,
      i18next.t("validations.max.string", {
        attribute: "utm_source",
        max: "100",
      }),
    )
    .nullable(),
  utm_medium: yup
    .string()
    .max(
      100,
      i18next.t("validations.max.string", {
        attribute: "utm_medium",
        max: "100",
      }),
    )
    .nullable(),
  utm_campaign: yup
    .string()
    .max(
      100,
      i18next.t("validations.max.string", {
        attribute: "utm_campaign",
        max: "100",
      }),
    )
    .nullable(),
  referrer: yup
    .string()
    .max(
      500,
      i18next.t("validations.max.string", {
        attribute: "referrer",
        max: "500",
      }),
    )
    .nullable(),
  status: yup
    .string<string>()
    .oneOf(["new", "contacted", "qualified", "converted", "lost"])
    .default("new"),
  notes: yup
    .string()
    .max(
      2000,
      i18next.t("validations.max.string", { attribute: "notes", max: "2000" }),
    )
    .nullable(),
  assigned_to: yup
    .string()
    .uuid(i18next.t("validations.uuid", { attribute: "assigned_to" }))
    .nullable(),
});

export type EnquiryFormValues = yup.InferType<typeof enquirySchema>;

export const defaultEnquiryValues: Partial<EnquiryFormValues> = {
  source: "web",
  status: "new",
  email: null,
  phone: null,
  message: null,
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  referrer: null,
  notes: null,
  assigned_to: null,
};
