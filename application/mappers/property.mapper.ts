import { PropertyEntity } from "@/domain/entities/property.entity";
import { PropertyType } from "@/domain/entities/property.enums";

export function mapPropertyRowToEntity(row: any): PropertyEntity {
  return {
    ...row,
    id: row.id,
    property_type: row.property_type as PropertyType,
  }
}