// ==========================================
// Seed Types - zona_raiz
// ==========================================

// Usamos strings directamente ya que la BD almacena valores de enums como strings

export interface SeedUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  phone: string;
  role: "admin" | "client" | "real-estate";
  avatarUrl?: string;
}

export interface SeedProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: "admin" | "client" | "real-estate";
  avatarUrl?: string;
}

export interface SeedRealEstate {
  id: string;
  name: string;
  description: string;
  whatsapp: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  logoUrl?: string;
}

export interface SeedAgent {
  profileId: string;
  realEstateId: string;
  role: "agent" | "coordinator";
}

export interface SeedProperty {
  id: string;
  realEstateId: string;
  createdBy?: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  neighborhood?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  totalArea?: number;
  builtArea?: number;
  lotArea?: number;
  floors?: number;
  yearBuilt?: number;
  parkingSpots?: number;
  amenities?: string[];
}

export interface SeedListing {
  id: string;
  propertyId: string;
  agentId: string;
  listingType: string;
  price: number;
  currency: string;
  priceNegotiable: boolean;
  whatsappContact: string;
  expensesAmount?: number;
  expensesIncluded: boolean;
  status: string;
  featured: boolean;
  featuredUntil?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
  availableFrom?: string;
  minimumContractDuration?: number;
  viewsCount: number;
  inquiriesCount: number;
  whatsappClicks: number;
  publishedAt?: string;
}

export interface SeedPropertyImage {
  id: string;
  propertyId: string;
  publicUrl: string;
  filename: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  displayOrder: number;
  isPrimary: boolean;
  altText?: string;
  caption?: string;
}

export interface SeedFavorite {
  id: string;
  profileId: string;
  listingId: string;
}

export interface SeedInquiry {
  id: string;
  listingId: string;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  source: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  status: string;
  notes?: string;
  assignedTo?: string;
  contactedAt?: string;
  convertedAt?: string;
  createdAt?: string;
}

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
