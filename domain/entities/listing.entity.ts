import { ListingStatus, ListingType } from "./listing.enums";
import { PropertyEntity } from "./property.entity";

export interface ListingEntity {
  id: string;
  property_id: string;
  agent_id: string;

  listing_type: ListingType;
  price: number;
  currency: string;
  price_negotiable: boolean;

  expenses_amount?: number | null;
  expenses_included: boolean;

  status: ListingStatus;
  featured: boolean;
  featured_until?: string | null;

  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string[] | null;
  virtual_tourUrl?: string | null;
  video_url?: string | null;

  available_from?: string | null;
  minimum_contract_duration?: number | null;

  views_count: number;
  inquiries_count: number;
  whatsapp_clicks: number;

  created_at: string;
  updated_at: string;
  published_at?: string | null;

  property: PropertyEntity
}


export const listingTypeOptions = [
  { label: "Renta", value: ListingType.RENT },
  { label: "Venta", value: ListingType.SALE },
]

export const listingTypeLabels: Record<ListingType, string> = {
  [ListingType.RENT]: "Renta",
  [ListingType.SALE]: "Venta",
}

export const listingStatusOptions = [
  { label: "Activa", value: ListingStatus.ACTIVE },
  { label: "Borrador", value: ListingStatus.DRAFT },
  { label: "Pausada", value: ListingStatus.PAUSED },
  { label: "Archivada", value: ListingStatus.ARCHIVED },

]

export const listingStatusLabels: Record<ListingStatus, string> = {
  [ListingStatus.ACTIVE]: "Activa",
  [ListingStatus.DRAFT]: "Borrador",
  [ListingStatus.PAUSED]: "Pausada",
  [ListingStatus.ARCHIVED]: "Archivada",
}