import { AuthUser, AuthUserBase } from "../entities/AuthUser"
import { UserRole } from "../entities/Profile"
import { RealEstateWithRole } from "../entities/RealEstate"
import { SignUpFormValues } from "../entities/schemas/signUpSchema"

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUserBase>
  signUp(input: SignUpFormValues): Promise<AuthUserBase>
  otp(email: string): Promise<{ success: boolean }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>

  // cookies management
  getRoleFromCookie(): Promise<UserRole | null>
  refreshRoleCookie(): Promise<void>

  getRealEstatesForUser(): Promise<RealEstateWithRole[]>
  setRealEstateCookie(realEstateId: string): Promise<void>
  getRealEstateFromCookie(): Promise<string | null>
}