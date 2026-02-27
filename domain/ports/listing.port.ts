import { ListingEntity, ListingFilters } from "../entities/listing.entity";

export interface ListingPort {
    all(filter?: ListingFilters): Promise<ListingEntity[]>;
    create(data: Partial<ListingEntity>): Promise<ListingEntity>;
    update(id: string, data: Partial<ListingEntity>): Promise<ListingEntity>;
    findById(id: string): Promise<ListingEntity | null>;
    findActive(): Promise<ListingEntity[]>;
    delete(id: string): Promise<void>;
}