import {
    AccountProfileUpdateDTO,
    AccountProfileDTO,
    AccountAvatarUpdateDTO
} from "../types/account.types";

export interface AccountRepository {
    getAccountProfile(): Promise<AccountProfileDTO | null>
    updateAccountProfile(data: AccountProfileUpdateDTO): Promise<void>
    updateAccountAvatar(data: AccountAvatarUpdateDTO): Promise<void>
}