import { RealEstate } from "@/domain/entities/RealEstate";
import { CreateRealEstateFormValues, UpdateRealEstateFormValues } from "../entities/schemas/realEstateSchema";
import { EAgentRole, RealEstateAgent } from "../entities/RealEstateAgent";

export interface RealEstateRepository {
  // Queries
  findById(id: string): Promise<RealEstate | null>;
  findByIdFresh(id: string): Promise<RealEstate | null>;
  findAll(): Promise<RealEstate[]>;
  findAllFresh(): Promise<RealEstate[]>;
  
  // Mutations
  create(data: CreateRealEstateFormValues): Promise<RealEstate>;
  update(id: string, data: UpdateRealEstateFormValues): Promise<RealEstate>;
  delete(id: string): Promise<void>;
  
  // Agent management
  addAgent(realEstateId: string, profileId: string, role: EAgentRole): Promise<void>;
  removeAgent(realEstateId: string, profileId: string): Promise<void>;
  getAgents(realEstateId: string): Promise<RealEstateAgent[]>;
  
  // Cache
  invalidateAllCache(): void;
}