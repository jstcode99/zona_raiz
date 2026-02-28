import { PropertyImageEntity } from "@/domain/entities/property-image.entity";

export function mapPropertyImageRowToEntity(row: any): PropertyImageEntity {
  return {
    ...row,
    id: row.id,
  }
}