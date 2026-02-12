import { Property } from "@/domain/entities/Property"
import { SupabasePropertyRepository } from "@/infrastructure/db/SupabasePropertyRepository"

export class createPropertyUseCase {
  repo = new SupabasePropertyRepository()

  async execute(data: Omit<Property, "id">) {
    return this.repo.create(data)
  }
}