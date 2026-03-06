import { PropertyImageEntity } from "../entities/property-image.entity";

export interface PropertyImagePort {
  // Queries
  getById(id: string): Promise<PropertyImageEntity>;
  getByPropertyId(propertyId: string): Promise<PropertyImageEntity[]>;
  existPath(path: string): Promise<boolean>;

  // Mutations
  create(propertyId: string, data: Partial<PropertyImageEntity>): Promise<PropertyImageEntity>;
  update(propertyImageId: string, data: Partial<PropertyImageEntity>): Promise<PropertyImageEntity>;

  uploadFile(propertyId: string, name: string, image: File): Promise<string>;
  updatePath(propertyImageId: string, path: string): Promise<PropertyImageEntity>;

  update(id: string, data: Partial<PropertyImageEntity>): Promise<PropertyImageEntity>;
  deleteFile(public_url: string): Promise<void>;

  delete(id: string): Promise<void>;
}