// domain/repositories/AuthRepository.ts
import { AuthUser, AuthUserBase } from "../entities/AuthUser"
import { UserRole } from "../entities/Profile"
import { SignUpFormValues } from "../entities/schemas/signUp"

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUserBase>
  signUp(input: SignUpFormValues): Promise<AuthUserBase>
  otp(email: string): Promise<{ success: boolean }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
  
  // Nuevos métodos para manejo de rol en cookies
  getRoleFromCookie(): Promise<UserRole | null>
  refreshRoleCookie(): Promise<void>
}