// path = domain/entities/real-estate.entity.ts
import { EAgentRole } from "./real-estate-agent.entity"

export interface RealEstateEntity {
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

export interface RealEstateFilters {
  id?: string
  whatsapp?: string
  searchQuery?: string;
}

export interface RealEstateWithRoleEntity {
  real_estate: RealEstateEntity,
  role: EAgentRole
}