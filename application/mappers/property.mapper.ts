import { PropertyEntity } from "@/domain/entities/property.entity";
import { PropertyType } from "@/domain/entities/property.enums";

export function mapPropertyRowToEntity(row: any): PropertyEntity {
  return {
    ...row,
    id: row.id,
    property_type: row.property_type as PropertyType,
  }
}

/**
 * DTO de presentación para PropertyDetail
 * Contiene datos ya transformados para UI
 */
export interface PropertyDetailDTO {
  property: PropertyEntity;
  imageUrls: string[];
  formattedLocation: string;
  formattedState: string;
}

/**
 * Transforma PropertyEntity a DTO de presentación
 * Extrae URLs de imágenes y formatea datos para UI
 */
export function mapPropertyToDetailDTO(property: PropertyEntity): PropertyDetailDTO {
  // Extraer URLs públicas de imágenes, filtrando nulos
  const imageUrls = (property.property_images
    ?.map((img) => img.public_url)
    .filter((url): url is string => Boolean(url)) || []);

  // Formatear ubicación completa
  const locationParts = [
    property.neighborhood,
    property.city,
    property.state,
    property.country,
  ].filter(Boolean);

  const formattedLocation = locationParts.join(", ");

  // Formatear estado (reemplazar underscores con espacios y uppercase)
  const formattedState = property.state.replaceAll("_", " ").toUpperCase();

  return {
    property,
    imageUrls,
    formattedLocation,
    formattedState,
  };
}