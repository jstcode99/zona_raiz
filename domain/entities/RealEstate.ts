import { UserRole } from "./Profile";

export interface RealEstate {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  description?: string | null;
  created_at?: string;
}

export type RealEstateFormData = Omit<RealEstate, 'id' | 'created_at'>;

export interface RealEstateWithRole {
  real_state:RealEstate,
  role: UserRole
}