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


export interface PropertyListingEntity {
    id: string;
    meta_title?: string | null | undefined;
    meta_description?: string | null | undefined;
    title: string;
    description: string;
    status: PropertyStatus;
    currency: Currency;
    slug: string;
    business_type: BusinessType;
    whatsapp_contact: string;
}