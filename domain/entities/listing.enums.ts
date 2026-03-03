export enum ListingType {
  SALE = "sale",
  RENT = "rent",
}

export enum ListingStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PAUSED = "paused",
  ARCHIVED = "archived",
}

export enum Keywords {
  POOL = "pool",
  GYM = "gym",
  PARKING = "parking",
  ELEVATOR = "elevator",
  SECURITY = "security",
  GARDEN = "garden",
  BALCONY = "balcony",
  AIR_CONDITIONING = "air_conditioning",
  HEATING = "heating",
  APARTAMENT= "apartment",
  HOUSE = "house",
  CONDO = "condo",
  TOWNHOUSE = "townhouse",
  LAND = "land",
  COMMERCIAL = "commercial",
  OFFICE = "office",
  WAREHOUSE = "warehouse",
  OTHER = "other",
}

export const listingTypeValues: string[] = Object.values(ListingType);
export const listingStatusValues: string[] = Object.values(ListingStatus);
export const keywordsValues: string[] = Object.values(Keywords);
