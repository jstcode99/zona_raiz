import * as yup from "yup";
import { ListingType } from "@/domain/entities/listing.enums";

export const searchListingsSchema = yup.object({
  q: yup.string().default(""),
  listing_type: yup
    .mixed<ListingType>()
    .oneOf([...Object.values(ListingType), undefined])
    .default(undefined),
  type: yup.string().default(""),
  country: yup.string().default(""),
  state: yup.string().default(""),
  city: yup.string().default(""),
  neighborhood: yup.string().default(""),
  min_price: yup.number().min(0).default(0),
  max_price: yup.number().max(9999999999).default(100000000),
  min_bedrooms: yup.number().min(0).max(20).default(undefined as number | undefined),
  min_bathrooms: yup.number().min(0).max(20).default(undefined as number | undefined),
  sort_by: yup.string().default("created_at_desc"),
});

export type SearchListingsInput = yup.InferType<typeof searchListingsSchema>;
