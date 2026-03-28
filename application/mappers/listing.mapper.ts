import { ListingEntity } from "@/domain/entities/listing.entity";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";
import { PropertyDetailDTO, mapPropertyToDetailDTO } from "./property.mapper";

export function mapListingRowToEntity(row: ListingEntity): ListingEntity {
  return {
    ...row,
    id: row.id,
    listing_type: row.listing_type as ListingType,
    status: row.status as ListingStatus,
  };
}

/**
 * DTO de presentación para ListingDetail
 * Contiene datos ya transformados para UI
 */
export interface ListingDetailDTO {
  listing: ListingEntity;
  propertyDetail: PropertyDetailDTO;
  formattedLocation: string;
  formattedPrice: string;
  formattedExpenses?: string;
}

/**
 * Transforma ListingEntity a DTO de presentación para ListingDetail
 * Incluye datos del property ya procesados
 */
export function mapListingToDetailDTO(
  listing: ListingEntity,
): ListingDetailDTO {
  const propertyDetail = mapPropertyToDetailDTO(listing.property);

  // Formatear ubicación completa del property
  const locationParts = [
    listing.property.neighborhood,
    listing.property.city,
    listing.property.state,
    listing.property.country,
  ].filter(Boolean);
  const formattedLocation = locationParts.join(", ");

  // Formatear precio
  const formattedPrice = `${listing.currency} ${listing.price.toLocaleString()}`;

  // Formatear gastos si existen
  let formattedExpenses: string | undefined;
  if (listing.expenses_amount) {
    formattedExpenses = `${listing.currency} ${listing.expenses_amount.toLocaleString()}`;
  }

  return {
    listing,
    propertyDetail,
    formattedLocation,
    formattedPrice,
    formattedExpenses,
  };
}
