import { EUserRole, ProfileEntity } from "@/domain/entities/profile.entity";

export function mapRealEstateAgentRowToEntity(
  row: ProfileEntity,
): ProfileEntity {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    avatar_url: row.avatar_url,
    phone: row.phone,
    role: row.role as EUserRole,
    created_at: row.created_at,
  };
}
