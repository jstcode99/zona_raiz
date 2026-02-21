import { EAgentRole } from "./RealEstateAgent";

export interface RealEstate {
  id: string
  name: string
  description: string
  whatsapp: string
  street: string,
  city: string,
  state: string,
  postal_code: string,
  country: string,
  logo_url: string
  created_at: string
  updated_at: string
}

export interface RealEstateWithRole {
  real_estate:RealEstate,
  role: EAgentRole
}