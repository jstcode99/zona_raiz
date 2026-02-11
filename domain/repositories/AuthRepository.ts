import { AuthUser } from "../entities/AuthUser"

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUser>
  signUp(email: string, password: string): Promise<AuthUser>
  otp(email: string): Promise<{ success: boolean }>
  signOut(): Promise<void>
  getCurrentUser(): Promise<AuthUser | null>
}
