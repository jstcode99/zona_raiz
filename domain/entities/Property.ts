export enum PropertyStatus {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
};   

export enum BusinessType {
  Sale = "sale",
  Rent = "rent",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  MXN = "MXN",
  COP = "COP",
  ARS = "ARS",
}


export interface Property  {
    id: string;
    address?: string | null | undefined;
    meta_title?: string | null | undefined;
    meta_description?: string | null | undefined;
    neighborhood?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    google_maps_url?: string | null | undefined;
    bedrooms?: number | null | undefined;
    bathrooms?: number | null | undefined;
    area_m2?: number | null | undefined;
    title: string;
    description: string;
    status: PropertyStatus;
    country: string;
    state: string;
    city: string;
    price: number;
    currency: Currency;
    slug: string;
    business_type: BusinessType;
    whatsapp_contact: string;
}