import { PropertyEntity, PropertyFilters } from "../entities/property.entity";
import { PropertyFormValues } from "../entities/schemas/property.schema";


export interface PropertyPort {
  // Queries
  all(filters?: PropertyFilters): Promise<PropertyEntity[]>;
  getById(id: string): Promise<PropertyEntity | null>;
  getBySlug(slug: string): Promise<PropertyEntity | null>;
  getByRealEstate(realEstateId: string): Promise<PropertyEntity[]>;

  // Mutations
  create(realEstateId: string, data: PropertyFormValues): Promise<PropertyEntity>;
  update(id: string, data: PropertyFormValues): Promise<PropertyEntity>;
  delete(id: string): Promise<void>;
  
  // Slug utilities
  generateSlug(title: string): Promise<string>;
  isSlugAvailable(slug: string, excludeId?: string): Promise<boolean>;
}