import { RealEstate, RealEstateCreateFormData, RealEstateUpdateFormData } from "../entities/RealEstate";

export interface RealEstateRepository {
  // Queries
  findAll(): Promise<RealEstate[]>;
  findById(id: string): Promise<RealEstate | null>;
  findAllFresh(): Promise<RealEstate[]>;
  findByIdFresh(id: string): Promise<RealEstate | null>;
  
  // CRUD
  create(data: RealEstateCreateFormData): Promise<RealEstate>;
  update(id: string, data: RealEstateUpdateFormData): Promise<RealEstate>;
  delete(id: string): Promise<void>;
  
  // Agent management
  addAgent(realEstateId: string, profileId: string, role?: 'admin' | 'agent'): Promise<void>;
  removeAgent(realEstateId: string, profileId: string): Promise<void>;
  
  // Cache control
  invalidateAllCache(): void;
}
