import { AuthUserEntity } from "../entities/auth-user.entity";
import { RealEstateWithRoleEntity } from "../entities/real-estate.entity";

export interface SessionPort {
  getCurrentUserId(): Promise<string | null>;
  getCurrentUser(): Promise<AuthUserEntity | null>
  getRealEstatesForUser(): Promise<RealEstateWithRoleEntity[]>
}