import { PropertyEntity } from "../entities/property.entity";

export interface PropertyPort {
  // Queries
  all(filters?: any): Promise<PropertyEntity[]>;
  getById(id: string): Promise<PropertyEntity | null>;
  getBySlug(slug: string): Promise<PropertyEntity | null>;
  getByRealEstate(realEstateId: string): Promise<PropertyEntity[]>;
  count(filters?: any): Promise<number>;

  // Mutations
  create(realEstateId: string, data: Partial<PropertyEntity>): Promise<PropertyEntity>;
  update(id: string, data: Partial<PropertyEntity>): Promise<PropertyEntity>;
  delete(id: string): Promise<void>;
  
  // Slug utilities
  generateSlug(title: string): Promise<string>;
  isSlugAvailable(slug: string, excludeId?: string): Promise<boolean>;
}