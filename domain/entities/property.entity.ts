import { PropertyType } from "./property.enums";

type AmenitiesType = {
  label: string,
  value: string
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
  amenities: AmenitiesType[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}


export interface PropertyFilters {
  real_estate_id?: string;
  property_type?: string;
  city?: string;
  state?: string;
  neighborhood?: string;
  min_bedrooms?: number;
  min_bathrooms?: number;
  search_query?: string;
}

export const propertyTypeOptions = [
  { label: "Casa", value: PropertyType.House },
  { label: "Apartamento", value: PropertyType.Apartment },
  { label: "Condominio", value: PropertyType.Condo },
  { label: "Casa adosada", value: PropertyType.TownHouse },
  { label: "Terreno", value: PropertyType.Land },
  { label: "Comercial", value: PropertyType.Commercial },
  { label: "Oficina", value: PropertyType.Office },
  { label: "Bodega", value: PropertyType.Warehouse },
  { label: "Otro", value: PropertyType.Other },
]

export const propertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.House]: "Casa",
  [PropertyType.Apartment]: "Apartamento",
  [PropertyType.Condo]: "Condominio",
  [PropertyType.TownHouse]: "Townhouse",
  [PropertyType.Land]: "Terreno",
  [PropertyType.Commercial]: "Comercial",
  [PropertyType.Office]: "Oficina",
  [PropertyType.Warehouse]: "Bodega",
  [PropertyType.Other]: "Otro",
}