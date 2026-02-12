import { SupabasePropertyRepository } from "@/infrastructure/db/SupabasePropertyRepository"

export class searchPropertyUseCase {
  repo = new SupabasePropertyRepository()

  async execute(query?: string, sort?: 'asc' | 'desc') {
    return this.repo.search(query, sort)
  }
}