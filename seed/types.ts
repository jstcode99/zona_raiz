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
import { RawSQL } from "./lib/sql-generator/sql-builder";

export type SeedUser = Omit<
  UserEntity & {
    instance_id: string;
    encrypted_password: RawSQL;
    email_confirmed_at: RawSQL;
    recovery_sent_at: RawSQL;
    last_sign_in_at: RawSQL;
    raw_app_meta_data: {
      provider: string;
      providers: string[];
    };
    raw_user_meta_data: Record<string, unknown>;
    created_at: RawSQL;
    updated_at: RawSQL;
    confirmation_token: string;
    email_change: string;
    email_change_token_new: string;
    recovery_token: string;
  },
  "created_at" | "updated_at" | "full_name" | "phone"
>;

export type SeedIdentity = {
  id: string; // uuid de la identity
  provider_id: string; // uuid generado
  user_id: string; // referencia al auth.users.id
  identity_data: {
    sub: string;
    email: string;
  };
  provider: string; // "email"
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
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
  realEstateCount?: number; // Cantidad de inmobiliarias (default: 2)
  agentsPerRealEstate?: number; // Agentes por inmobiliaria (default: 3) 1 coordinator / 2 agentes
  clientsCount?: number; // Clientes (default: 3)
  propertiesPerRealEstate?: number; // Propiedades por inmobiliaria (default: 5)
  listingsPerProperty?: number; // Listados por propiedad (default: 1)
  favoritesCount?: number; // Favoritos (default: 5)
  inquiriesCount?: number; // Consultas (default: 8)
}

export const DEFAULT_SEED_OPTIONS: SeedOptions = {
  truncate: true,
  realEstateCount: 2,
  agentsPerRealEstate: 3,
  clientsCount: 3,
  propertiesPerRealEstate: 5,
  listingsPerProperty: 1,
  favoritesCount: 5,
  inquiriesCount: 8,
};
