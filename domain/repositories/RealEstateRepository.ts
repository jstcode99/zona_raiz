import { RealEstate } from "../entities/RealEstate";

export interface RealEstateRepository {
  findAll(): Promise<RealEstate[]>;
  findById(id: string): Promise<RealEstate | null>;
  findBySlug(slug: string): Promise<RealEstate | null>;
  create(data: Omit<RealEstate, "id" | "created_at">): Promise<RealEstate>;
  update(id: string, data: Partial<RealEstate>): Promise<void>;
  delete(id: string): Promise<void>;
}
