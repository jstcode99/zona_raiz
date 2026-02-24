// path = domain/ports/real-estate.port.ts
import { RealEstateEntity, RealEstateFilters } from "../entities/real-estate.entity";
import { RealEstateFormValues } from "../entities/schemas/real-estate.schema";

export interface RealEstatePort {
  // Queries
  all(filters?: RealEstateFilters): Promise<RealEstateEntity[]>;
  getById(id: string): Promise<RealEstateEntity | null>;

  // Mutations
  create(data: RealEstateFormValues): Promise<RealEstateEntity>;
  uploadLogo(realEstateId: string, file: File): Promise<string | null>
  updatePathLogo(realEstateId: string, logoUrl: string): Promise<void>
  update(id: string, data: RealEstateFormValues): Promise<RealEstateEntity>;
  delete(id: string): Promise<void>;
}