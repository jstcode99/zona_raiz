import { ListingPort } from "../ports/listing.port";
import { ListingEntity } from "../entities/listing.entity";


export type CreateListingInput = Omit<ListingEntity, "id" | "property_id" | "views_count" | "inquiries_count" | "whatsapp_clicks" | "published_at" | "property">

export class ListingUseCases {
  constructor(private readonly listing: ListingPort) { }
  all(filter?: any) {
    return this.listing.all(filter);
  }

  create(data: CreateListingInput) {
    return this.listing.create(data);
  }

  update(id: string, data: CreateListingInput) {
    return this.listing.update(id, data);
  }

  findById(id: string) {
    return this.listing.findById(id);
  }

  findActive() {
    return this.listing.findActive();
  }

  delete(id: string) {
    return this.listing.delete(id);
  }

  findFeatured(limit?: number, realEstateId?: string) {
    return this.listing.findFeatured(limit, realEstateId);
  }
}