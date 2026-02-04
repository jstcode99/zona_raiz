import { AccountProfileUpdateDTO, AccountProfileDTO } from "../types/account.types";

export interface AccountRepository {
    getAccountProfile(): Promise<AccountProfileDTO | null>
    updateAccountProfile(data: AccountProfileUpdateDTO): Promise<void>
    // signIn(data: SignInDTO): Promise<void>
    // signUp(data: SignUpDTO): Promise<void>
}