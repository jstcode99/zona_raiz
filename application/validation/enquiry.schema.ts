// ============================================
// SCHEMAS DE CONSULTAS (ENQUIRIES)
// ============================================
//
// NOTA: El schema incluye `real_estate_id` para el formulario público porque
// viene de property.real_estate_id y se necesita para consultar el WhatsApp.
// PERO no se guarda en la tabla `enquiries` — se obtiene via listing → property.
//
// Schema público (formulario de contacto):
//   - listing_id (requerido)
//   - real_estate_id (requerido, UUID)
//   - name, email?, phone?, message?, source?
//
// Schema de gestión (dashboard):
//   - Todos los campos arriba + status, notes, assigned_to, utm_*, etc.
// ============================================
import i18next from "i18next";
import * as yup from "yup";

export const enquirySchema = yup.object({
  // real_estate_id del formulario público (NO se guarda en BD, se usa para WhatsApp)
  real_estate_id: yup
    .string()
    .uuid(i18next.t("validations:uuid", { attribute: "real_estate_id" }))
    .required(
      i18next.t("validations:required", { attribute: "real_estate_id" }),
    ),
  listing_id: yup
    .string()
    .uuid(i18next.t("validations:uuid", { attribute: "listing_id" }))
    .required(i18next.t("validations:required", { attribute: "listing_id" })),
  name: yup
    .string()
    .min(
      2,
      i18next.t("validations:min.string", { attribute: "name", min: "2" }),
    )
    .max(
      100,
      i18next.t("validations:max.string", { attribute: "name", max: "100" }),
    ),
  email: yup
    .string()
    .email(i18next.t("validations:email", { attribute: "email" }))
    .max(
      100,
      i18next.t("validations:max.string", { attribute: "email", max: "100" }),
    )
    .nullable(),
  phone: yup
    .string()
    .matches(
      /^[\d\s\-\+\(\)]+$/,
      i18next.t("validations:phone", { attribute: "phone" }),
    )
    .max(
      30,
      i18next.t("validations:max.string", { attribute: "phone", max: "30" }),
    )
    .nullable(),
  message: yup
    .string()
    .max(
      2000,
      i18next.t("validations:max.string", {
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
      i18next.t("validations:max.string", {
        attribute: "utm_source",
        max: "100",
      }),
    )
    .nullable(),
  utm_medium: yup
    .string()
    .max(
      100,
      i18next.t("validations:max.string", {
        attribute: "utm_medium",
        max: "100",
      }),
    )
    .nullable(),
  utm_campaign: yup
    .string()
    .max(
      100,
      i18next.t("validations:max.string", {
        attribute: "utm_campaign",
        max: "100",
      }),
    )
    .nullable(),
  referrer: yup
    .string()
    .max(
      500,
      i18next.t("validations:max.string", {
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
      i18next.t("validations:max.string", { attribute: "notes", max: "2000" }),
    )
    .nullable(),
  assigned_to: yup
    .string()
    .uuid(i18next.t("validations:uuid", { attribute: "assigned_to" }))
    .nullable(),
});

export type EnquiryFormValues = yup.InferType<typeof enquirySchema>;

export const defaultEnquiryValues: Partial<EnquiryFormValues> = {
  real_estate_id: undefined, // Requerido en formulario público
  source: "web",
  status: "new",
  email: "",
  phone: "",
  message: "",
  utm_source: undefined,
  utm_medium: undefined,
  utm_campaign: undefined,
  referrer: undefined,
  notes: undefined,
  assigned_to: undefined,
};
