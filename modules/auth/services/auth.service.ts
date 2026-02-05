import { AuthRepository } from "../repositories/auth.repository"
import { AuthUser, IRole, SignInDTO, SignInOtpDTO, SignUpDTO } from "../types/auth.types"

export class AuthService {
  constructor(private readonly repository: AuthRepository) { }

  async requireUser(): Promise<AuthUser> {
    const user = await this.repository.getCurrentUser()
    if (!user) throw new Error("Unauthorized")
    return user
  }

  async requireRole(role: IRole): Promise<AuthUser> {
    const user = await this.requireUser()
    if (user.role !== role) {
      throw new Error("Forbidden")
    }
    return user
  }

  signIn(data: SignInDTO) {
    this.repository.signIn(data)
  }

  signInOTP(data: SignInOtpDTO) {
    this.repository.signInOTP(data)
  }

  signUp(data: SignUpDTO) {
    this.repository.signUp(data)
  }

  signOut() {
    this.repository.signOut()
  }

  loginWithGoogle() {
    this.repository.loginWithGoogle()
  }
}
