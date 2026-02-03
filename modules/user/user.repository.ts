import { User, CreateUserDTO } from "./user.types"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
}
