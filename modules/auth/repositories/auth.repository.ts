import { AuthUser } from "../types/auth.types"
import { SignInDTO, SignUpDTO } from "../types/auth.types"

export interface AuthRepository {
    signIn(data: SignInDTO): Promise<void>
    signUp(data: SignUpDTO): Promise<void>
    signOut(): Promise<void>
    getCurrentUser(): Promise<AuthUser | null>
    loginWithGoogle(): Promise<string>
}