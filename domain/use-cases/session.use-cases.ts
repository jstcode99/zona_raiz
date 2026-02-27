import { ProfileEntity } from "@/domain/entities/profile.entity"
import { SessionPort } from "../ports/sesion.port"
import { RealEstateWithRoleEntity } from "../entities/real-estate.entity"


export class SessionUseCases {
  constructor(private session: SessionPort) {}

  async getCurrentUser(): Promise<ProfileEntity | null> {
    return this.session.getCurrentUser()
  }

  async getCurrentUserId(): Promise<string | null> {
    return this.session.getCurrentUserId()
  }

  async getRealEstatesForUser(): Promise<RealEstateWithRoleEntity[]> {
    return this.session.getRealEstatesForUser()
  }
}