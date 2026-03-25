import { Keywords, ListingStatus, ListingType } from "./listing.enums";
import { PropertyEntity } from "./property.entity";
import { ProfileEntity } from "./profile.entity";

export type KeywordsType = {
  label: string;
  value: string;
};

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
  keywords?: KeywordsType[] | null;
  virtual_tourUrl?: string | null;
  video_url?: string | null;

  available_from?: string | null;
  minimum_contract_duration?: number | null;

  views_count: number;
  enquiries_count: number;
  whatsapp_clicks: number;
  published_at?: string | null;
  property: PropertyEntity;
  created_at: string;
  updated_at: string;
  agent?: ProfileEntity | null;
}

export const listingTypeOptions = [
  { label: "Renta", value: ListingType.RENT },
  { label: "Venta", value: ListingType.SALE },
];

export const listingTypeLabels: Record<ListingType, string> = {
  [ListingType.RENT]: "Renta",
  [ListingType.SALE]: "Venta",
};

export const listingStatusOptions = [
  { label: "Activa", value: ListingStatus.ACTIVE },
  { label: "Borrador", value: ListingStatus.DRAFT },
  { label: "Pausada", value: ListingStatus.PAUSED },
  { label: "Archivada", value: ListingStatus.ARCHIVED },
];

export const listingStatusLabels: Record<ListingStatus, string> = {
  [ListingStatus.ACTIVE]: "Activa",
  [ListingStatus.DRAFT]: "Borrador",
  [ListingStatus.ARCHIVED]: "Archivada",
};

export const keywordsOptions = [
  { label: "Piscina", value: Keywords.POOL },
  { label: "Gimnasio", value: Keywords.GYM },
  { label: "Estacionamiento", value: Keywords.PARKING },
  { label: "Ascensor", value: Keywords.ELEVATOR },
  { label: "Seguridad", value: Keywords.SECURITY },
  { label: "Jardín", value: Keywords.GARDEN },
  { label: "Balcón", value: Keywords.BALCONY },
  { label: "Aire acondicionado", value: Keywords.AIR_CONDITIONING },
  { label: "Calefacción", value: Keywords.HEATING },
  { label: "Apartamento", value: Keywords.APARTAMENT },
  { label: "Casa", value: Keywords.HOUSE },
  { label: "Condominio", value: Keywords.CONDO },
  { label: "Townhouse", value: Keywords.TOWNHOUSE },
  { label: "Terreno", value: Keywords.LAND },
  { label: "Comercial", value: Keywords.COMMERCIAL },
  { label: "Oficina", value: Keywords.OFFICE },
  { label: "Bodega", value: Keywords.WAREHOUSE },
  { label: "Otro", value: Keywords.OTHER },
];
