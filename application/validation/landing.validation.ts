import * as yup from "yup";
import { searchSchema } from "./base/search.schema";
import { listingTypeSchema } from "./base/listing_type.schema";
import { propertyTypeSchema } from "./base/property_type.schema";
import { addressSchema } from "./base/address.schema";
import { bedroomsSchema } from "./base/bedrooms.schema";
import { bathroomsSchema } from "./base/bathrooms.schema";
import { priceSchema } from "./base/price.schema";

export const searchListingsSchema = yup.object({
  q: searchSchema.nullable(),
  listing_type: listingTypeSchema.nullable(),
  type: propertyTypeSchema.nullable(),
  country: yup.string().nullable(),
  state: yup.string().nullable(),
  city: yup.string().nullable(),
  neighborhood: yup.string().nullable(),
  min_bedrooms: bedroomsSchema.nullable(),
  min_bathrooms: bathroomsSchema.nullable(),
  min_price: priceSchema.nullable(),
  max_price: priceSchema.nullable(),
  sort_by: yup.string().nullable(),
});

export type SearchListingsInput = yup.InferType<typeof searchListingsSchema>;
