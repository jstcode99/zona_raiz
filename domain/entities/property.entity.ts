// path = domain/entities/property.entity.ts
export enum BusinessType {
  Sale = "sale",
  Rent = "rent",
}

export enum PropertyType {
    House = 'house',
    Apartment = 'apartment',
    Condo = 'condo',
    TownHouse = 'townhouse',
    Land = 'land',
    Commercial = 'commercial',
    Office = 'office',
    Warehouse = 'warehouse',
    Other = 'other',
}

export interface PropertyEntity {
  id: string;
  real_estate_id: string;
  title: string;
  slug: string;
  description: string | null;
  property_type: PropertyType;
  address: string;
  street: string,
  city: string,
  state: string,
  postal_code: string,
  country: string,
  latitude: number | null;
  longitude: number | null;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  total_area: number | null;
  built_area: number | null;
  lot_area: number | null;
  floors: number | null;
  year_built: number | null;
  parking_spots: number | null;
  amenities: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}


export interface PropertyFilters {
  realEstateId?: string;
  propertyType?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

export const propertyTypeOptions = [
  { label: "Casa", value: PropertyType.House },
  { label: "Apartamento", value: PropertyType.Apartment },
  { label: "Condominio", value: PropertyType.Condo },
  { label: "Townhouse", value: PropertyType.TownHouse },
  { label: "Terreno", value: PropertyType.Land },
  { label: "Comercial", value: PropertyType.Commercial },
  { label: "Oficina", value: PropertyType.Office },
  { label: "Bodega", value: PropertyType.Warehouse },
  { label: "Otro", value: PropertyType.Other },
]
