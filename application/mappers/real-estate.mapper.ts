import { RealEstateEntity } from "@/domain/entities/real-estate.entity"
import { RealEstateInput } from "../validation/real-estate.validation"

export function mapRealEstateRowToEntity(row: any): RealEstateEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    whatsapp: row.whatsapp,
    street: row.street,
    city: row.city,
    state: row.state,
    postal_code: row.postal_code,
    country: row.country,
    logo_url: row.logo_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function mapRealEstateRowToDomain(row: RealEstateInput): Partial<RealEstateEntity> {
  return {
    name: row.name,
    description: row.description,
    whatsapp: row.whatsapp,
    street: row.address.street,
    city: row.address.city,
    state: row.address.state,
    postal_code: row.address.postal_code,
    country: row.address.country,
  }
}

