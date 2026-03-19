import * as yup from "yup"

export const landingSearchSchema = yup.object({
  city: yup.string().optional(),
  property_type: yup.string().optional(),
  min_bedrooms: yup.number().min(0).optional(),
  min_bathrooms: yup.number().min(0).optional(),
  max_price: yup.number().min(0).optional(),
})

export type LandingSearchFormInput = yup.InferType<typeof landingSearchSchema>

export const defaultLandingSearchValues: LandingSearchFormInput = {
  city: "",
  property_type: "",
  min_bedrooms: undefined,
  min_bathrooms: undefined,
  max_price: undefined,
}
