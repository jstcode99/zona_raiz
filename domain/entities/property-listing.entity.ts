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
    title: string;
    description: string;
    status: PropertyStatus;
    currency: Currency;
    slug: string;
    business_type: BusinessType;
    whatsapp_contact: string;
}
