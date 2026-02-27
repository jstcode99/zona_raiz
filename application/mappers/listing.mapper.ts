import { ListingEntity } from "@/domain/entities/listing.entity";
import { ListingStatus, ListingType } from "@/domain/entities/listing.enums";

export function mapListingRowToEntity(row: any): ListingEntity {
    return {
        ...row,
        id: row.id,
        listing_type: row.listing_type as ListingType,
        status: row.status as ListingStatus,
    }
}