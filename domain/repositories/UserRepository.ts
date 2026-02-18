import { UserWithProfile } from "../entities/User";
import { UserRole } from "../entities/Profile";

export interface UserRepository {
  findAll(): Promise<UserWithProfile[]>;
  findById(id: string): Promise<UserWithProfile | null>;
  updateBasic(userId: string, role: UserRole): Promise<void>;
  updateRole(userId: string, role: UserRole): Promise<void>;
  updateRealEstate(userId: string, realEstateId: string | null): Promise<void>;
  delete(userId: string): Promise<void>;
}
