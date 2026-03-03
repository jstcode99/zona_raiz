import { PropertyType } from "./property.enums";

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

export const listingTypeValues: string[] = Object.values(ListingType);
export const listingStatusValues: string[] = Object.values(ListingStatus);
