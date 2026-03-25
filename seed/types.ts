// ==========================================
// Seed Types - zona_raiz
// ==========================================

import { EnquiryEntity } from "@/domain/entities/enquiry.entity";
import { FavoriteEntity } from "@/domain/entities/favorite.entity";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { ProfileEntity } from "@/domain/entities/profile.entity";
import { PropertyImageEntity } from "@/domain/entities/property-image.entity";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { RealEstateAgentEntity } from "@/domain/entities/real-estate-agent.entity";
import { RealEstateEntity } from "@/domain/entities/real-estate.entity";
import { UserEntity } from "@/domain/entities/user.entity";

export type SeedUser = Omit<UserEntity, "created_at" | "updated_at"> & {
  password: string;
};

export type SeedProfile = Omit<ProfileEntity, "created_at" | "profile">;

export type SeedRealEstate = Omit<
  RealEstateEntity,
  "created_at" | "updated_at"
>;

export type SeedAgent = Omit<RealEstateAgentEntity, "created_at" | "profile">;

export type SeedProperty = Omit<
  PropertyEntity,
  "created_by" | "created_at" | "updated_at" | "real_estate" | "property_images"
>;

export type SeedListing = Omit<
  ListingEntity,
  "property" | "agent" | "updated_at" | "created_at"
>;

export type SeedPropertyImage = Omit<PropertyImageEntity, "created_at">;

export type SeedFavorite = Omit<FavoriteEntity, "created_at">;

export type SeedInquiry = Omit<
  EnquiryEntity,
  | "assigned_to_profile"
  | "listing"
  | "created_at"
  | "contacted_at"
  | "converted_at"
>;

export interface SeedContext {
  realEstates: SeedRealEstate[];
  profiles: SeedProfile[];
  agents: SeedAgent[];
  properties: SeedProperty[];
  listings: SeedListing[];
  propertyImages: SeedPropertyImage[];
  favorites: SeedFavorite[];
  inquiries: SeedInquiry[];
}

export interface SeedOptions {
  truncate?: boolean; // Truncar tablas antes de seed (default: true)
  skipAuth?: boolean; // Saltar creación de usuarios auth (default: false)
  realEstateCount?: number; // Cantidad de inmobiliarias (default: 2)
  agentsPerRealEstate?: number; // Agentes por inmobiliaria (default: 3)
  clientsCount?: number; // Clientes (default: 3)
  propertiesPerRealEstate?: number; // Propiedades por inmobiliaria (default: 5)
  listingsPerProperty?: number; // Listados por propiedad (default: 1)
  favoritesCount?: number; // Favoritos (default: 5)
  inquiriesCount?: number; // Consultas (default: 8)
}

export const DEFAULT_SEED_OPTIONS: SeedOptions = {
  truncate: true,
  skipAuth: false,
  realEstateCount: 2,
  agentsPerRealEstate: 3,
  clientsCount: 3,
  propertiesPerRealEstate: 5,
  listingsPerProperty: 1,
  favoritesCount: 5,
  inquiriesCount: 8,
};
