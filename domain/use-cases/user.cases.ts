import { UserPort } from "../user.port"
import { UserEntity } from "../entities/user.entity"
import { EUserRole } from "../entities/profile.entity"
import { UserNotFoundError, UserAlreadyExistsError } from "../errors/user.error"

export class UserUseCases {
  constructor(private readonly users: UserPort) {}

  getUserById(userId: string): Promise<UserEntity> {
    return this.ensureUserExists(this.users.getUserById(userId), userId)
  }

  listUsers(filters?: Parameters<UserPort["listUsers"]>[0]): Promise<UserEntity[]> {
    return this.users.listUsers(filters)
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.users.getUserByEmail(email)
    if (!user) {
      throw new UserNotFoundError(email)
    }
    return user
  }

  async createUser(data: Omit<UserEntity, "id" | "created_at" | "updated_at">): Promise<UserEntity> {
    const existing = await this.users.getUserByEmail(data.email)
    if (existing) {
      throw new UserAlreadyExistsError(data.email)
    }
    return this.users.createUser(data)
  }

  async updateUser(userId: string, data: Partial<Omit<UserEntity, "id">>): Promise<void> {
    await this.getUserById(userId)
    await this.users.updateUser(userId, data)
  }

  async updateUserRole(userId: string, role: EUserRole): Promise<void> {
    await this.getUserById(userId)
    await this.users.updateUserRole(userId, role)
  }

  async deleteUser(userId: string): Promise<void> {
    await this.getUserById(userId)
    await this.users.deleteUser(userId)
  }

  private async ensureUserExists(
    promise: Promise<UserEntity | null>,
    identifier: string
  ): Promise<UserEntity> {
    const user = await promise
    if (!user) {
      throw new UserNotFoundError(identifier)
    }
    return user
  }
}

