import { ListingPort } from "../ports/listing.port";
import { ListingEntity } from "../entities/listing.entity";

export class ListingUseCases {
  constructor(private readonly listing: ListingPort) { }
  all(filter?: any) {
    return this.listing.all(filter);
  }

  create(data: Partial<ListingEntity>) {
    return this.listing.create(data);
  }

  update(id: string, data: Partial<ListingEntity>) {
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
}