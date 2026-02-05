import { AccountRepository } from "../repositories/account.repository"
import {
  AccountProfileUpdateDTO,
  AccountProfileDTO,
  AccountAvatarUpdateDTO
} from "../types/account.types"

export class AccountService {
  constructor(private readonly repository: AccountRepository) { }

  async getAccountProfile(): Promise<AccountProfileDTO | null> {
    const profile = await this.repository.getAccountProfile()
    return profile
  }
  async updateAccountProfile(data: AccountProfileUpdateDTO): Promise<void> {
    await this.repository.updateAccountProfile(data)
  }
  async updateAccountAvatar(data: AccountAvatarUpdateDTO): Promise<void> {
    await this.repository.updateAccountAvatar(data)
  }
}
