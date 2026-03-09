import { ListingEntity } from "../entities/listing.entity";

export interface ListingPort {
    all(filter?: any): Promise<ListingEntity[]>;
    create(data: Partial<ListingEntity>): Promise<ListingEntity>;
    update(id: string, data: Partial<ListingEntity>): Promise<ListingEntity>;
    findById(id: string): Promise<ListingEntity | null>;
    findActive(): Promise<ListingEntity[]>;
    delete(id: string): Promise<void>;
    count(filters?: any): Promise<number>;
    countWithViews(filters?: any): Promise<number>;
}