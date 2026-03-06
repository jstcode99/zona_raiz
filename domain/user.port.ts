import { UserEntity } from "./entities/user.entity"
import { EUserRole } from "./entities/profile.entity"

export interface ListUsersFilters {
  search?: string
  role?: EUserRole
}

export interface UserPort {
  getUserById(userId: string): Promise<UserEntity | null>

  getUserByEmail(email: string): Promise<UserEntity | null>

  listUsers(filters?: ListUsersFilters): Promise<UserEntity[]>

  createUser(data: Omit<UserEntity, "id" | "created_at" | "updated_at">): Promise<UserEntity>

  updateUser(userId: string, data: Partial<Omit<UserEntity, "id">>): Promise<void>

  updateUserRole(userId: string, role: EUserRole): Promise<void>

  deleteUser(userId: string): Promise<void>
}

