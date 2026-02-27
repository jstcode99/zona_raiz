import * as yup from "yup";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";

export const createListingSchema = yup.object({
  property_id: yup.string().uuid().required(),
  agent_id: yup.string().uuid().required(),
  listing_type: yup
    .mixed<ListingType>()
    .oneOf(Object.values(ListingType))
    .required(),
  price: yup.number().required().min(0),
  currency: yup
    .string()
    .length(3)
    .default("ARS"),
  price_negotiable: yup.boolean().default(false),
  status: yup
    .mixed<ListingStatus>()
    .oneOf(Object.values(ListingStatus))
    .default(ListingStatus.DRAFT),
});

export type CreateListingInput = yup.InferType<typeof createListingSchema>;