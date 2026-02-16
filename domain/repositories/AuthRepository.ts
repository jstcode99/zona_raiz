import { AuthUser } from "../entities/AuthUser"
import { SignUpFormValues } from "../entities/schemas/signUp"

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUser>
  signUp(input: SignUpFormValues): Promise<AuthUser>
  otp(email: string): Promise<{ success: boolean }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
}
