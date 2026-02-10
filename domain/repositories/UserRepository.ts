import { User } from "../entities/User"

export interface UserRepository {
  findById(id: string): Promise<User | null>
  updateName(id: string, name: string): Promise<void>
}
