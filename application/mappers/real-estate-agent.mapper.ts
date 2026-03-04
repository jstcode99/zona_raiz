import { ProfileEntity } from "@/domain/entities/profile.entity"

export function mapRealEstateAgentRowToEntity(row: any): ProfileEntity {
  return {
    id: row.id,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    phone: row.phone,
    role: row.role,
    created_at: row.created_at
  }
}


