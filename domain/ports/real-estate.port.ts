import {
  RealEstateEntity,
  RealEstateFilters,
} from "@/domain/entities/real-estate.entity"

export interface RealEstatePort {
  all(filters?: RealEstateFilters): Promise<RealEstateEntity[]>
  getById(id: string): Promise<RealEstateEntity>
  
  create(data: Partial<RealEstateEntity>): Promise<string>
  update(id: string, data: Partial<RealEstateEntity>): Promise<void>
  delete(id: string): Promise<void>

  uploadLogo(id: string, file: File): Promise<string>
  updatePathLogo(id: string, logoUrl: string): Promise<void>

  count(filters?: { start_date?: string; end_date?: string }): Promise<number>
}