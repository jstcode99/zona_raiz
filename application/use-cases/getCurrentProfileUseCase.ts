import { SupabaseProfileRepository } from "@/infrastructure/db/SupabaseProfileRepository"

export class getCurrentProfileUseCase {
  repo = new SupabaseProfileRepository()

  async execute() {
    return this.repo.getCurrentProfile()
  }
}
