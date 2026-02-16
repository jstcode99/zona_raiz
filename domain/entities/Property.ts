export interface Property  {
    id: string;
    address?: string | null | undefined;
    neighborhood?: string | null | undefined;
    latitude?: number | null | undefined;
    longitude?: number | null | undefined;
    google_maps_url?: string | null | undefined;
    bedrooms?: number | null | undefined;
    bathrooms?: number | null | undefined;
    area_m2?: number | null | undefined;
    country: string;
    state: string;
    city: string;
}