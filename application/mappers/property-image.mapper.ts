import { PropertyImageEntity } from "@/domain/entities/property-image.entity";

export function mapPropertyImageRowToEntity(
  row: PropertyImageEntity,
): PropertyImageEntity {
  return {
    ...row,
    id: row.id,
  };
}

/**
 * Tipo para imágenes usadas en el grid sortable - id es requerido
 */
export type SortableImage = Omit<PropertyImageEntity, "id"> & { id: string };

/**
 * Filtra y typea imágenes para el grid sortable
 * Requiere que las imágenes tengan id definido
 */
export function toSortableImages(
  images: PropertyImageEntity[],
): SortableImage[] {
  return images.filter((img): img is SortableImage => img.id !== undefined);
}
