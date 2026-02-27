import { RealEstatePort } from "@/domain/ports/real-estate.port"
import {
  RealEstateEntity,
  RealEstateFilters,
} from "@/domain/entities/real-estate.entity"

export class RealEstateUseCases {
  constructor(private repository: RealEstatePort) { }

  all(filters?: RealEstateFilters): Promise<RealEstateEntity[]> {
    return this.repository.all(filters)
  }

  getById(id: string): Promise<RealEstateEntity> {
    return this.repository.getById(id)
  }

  create(data: Partial<RealEstateEntity>): Promise<string> {
    return this.repository.create(data)
  }

  update(id: string, data: Partial<RealEstateEntity>): Promise<void> {
    return this.repository.update(id, data)
  }

  delete(id: string): Promise<void> {
    return this.repository.delete(id)
  }

  async uploadLogo(id: string, file: File): Promise<void> {
    const url = await this.repository.uploadLogo(id, file)
    await this.repository.updatePathLogo(id, url)
  }
}