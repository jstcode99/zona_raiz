import { ListingStatus, ListingType } from "./listing.enums";
import { PropertyFilters } from "./property.entity";

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
}

export interface ListingFilters extends PropertyFilters {
  real_estate_id?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  min_bed_rooms?: number;
  min_bath_rooms?: number;
  search_query?: string;

  property_id?: string;
  property_type?: string;
  listing_type: ListingType;
  status: ListingStatus;
  price: number;
  currency: string;
}