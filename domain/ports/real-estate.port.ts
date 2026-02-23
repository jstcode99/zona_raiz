import { RealEstateEntity } from "../entities/real-estate.entity";
import { realEstateFormValues } from "../entities/schemas/real-estate.schema";

export interface RealEstatePort {
  // Queries
  all(): Promise<RealEstateEntity[]>;
  getById(id: string): Promise<RealEstateEntity | null>;

  // Mutations
  create(data: realEstateFormValues): Promise<RealEstateEntity>;
  uploadLogo(realEstateId: string, file: File): Promise<string | null>
  updatePathLogo(realEstateId: string, logoUrl: string): Promise<void>
  update(id: string, data: realEstateFormValues): Promise<RealEstateEntity>;
  delete(id: string): Promise<void>;
}