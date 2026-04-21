import { PropertyImageEntity } from "../entities/property-image.entity";

export interface PropertyImageUpdatePayload {
  id: string;
  display_order?: number;
  is_primary?: boolean;
  alt_text?: string;
  caption?: string;
}

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

  // Batch mutations
  updateDisplayOrder(updates: Array<{ id: string; display_order: number }>): Promise<void>;
  setPrimary(propertyId: string, imageId: string): Promise<void>;

  // Cascade delete for property (deletes files from storage + DB records)
  deleteByPropertyId(propertyId: string): Promise<void>;
}