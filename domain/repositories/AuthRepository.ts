import { AuthUser, AuthUserBase } from "../entities/AuthUser"
import { RealEstate, RealEstateWithRole } from "../entities/RealEstate"
import { SignUpFormValues } from "../entities/schemas/signUp"

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUserBase>
  signUp(input: SignUpFormValues): Promise<AuthUserBase>
  otp(email: string): Promise<{ success: boolean }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
  getCurrentRealState(): Promise<string>
  getRealStates(): Promise<RealEstate[]>
  getMyRealEstateWithRole(): Promise<RealEstateWithRole | null>
}
