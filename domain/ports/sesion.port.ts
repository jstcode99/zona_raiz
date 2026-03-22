import { ProfileEntity } from "../entities/profile.entity";
import { RealEstateWithRoleEntity } from "../entities/real-estate.entity";

export interface SessionPort {
  isAuth(): Promise<boolean>;
  getCurrentUserId(): Promise<string | null>;
  getCurrentUser(): Promise<ProfileEntity | null>;
  getRealEstatesForUser(): Promise<RealEstateWithRoleEntity[]>;
}
