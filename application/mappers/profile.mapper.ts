import { ProfileEntity, EUserRole } from "@/domain/entities/profile.entity";

export function mapProfileRowToEntity(row: ProfileEntity): ProfileEntity {
  return {
    ...row,
    id: row.id,
    role: row.role as EUserRole,
  };
}
