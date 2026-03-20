import * as yup from "yup"

export const landingSearchSchema = yup.object({
  city: yup.string().optional(),
  property_type: yup.string().optional(),
  type: yup.string().optional(),
  min_bedrooms: yup.number().min(0).optional().transform((v) => (v === "" ? undefined : v)),
  min_bathrooms: yup.number().min(0).optional().transform((v) => (v === "" ? undefined : v)),
  max_price: yup.number().min(0).optional().transform((v) => (v === "" ? undefined : v)),
  q: yup.string().optional(),
  listing_type: yup.string().optional(),
  country: yup.string().optional(),
  state: yup.string().optional(),
  neighborhood: yup.string().optional(),
  min_price: yup.number().min(0).optional(),
  sort_by: yup.string().optional(),
})

export type LandingSearchFormInput = yup.InferType<typeof landingSearchSchema>

export const defaultLandingSearchValues: LandingSearchFormInput = {
  city: "",
  property_type: "",
  min_bedrooms: undefined,
  min_bathrooms: undefined,
  max_price: undefined,
}
