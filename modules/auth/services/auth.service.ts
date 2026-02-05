import { AuthRepository } from "../repositories/auth.repository"
import { AuthUser, IRole, SignInDTO, SignUpDTO } from "../types/auth.types"

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
    return this.repository.signIn(data)
  }

  signUp(data: SignUpDTO) {
    return this.repository.signUp(data)
  }

  signOut() {
    return this.repository.signOut()
  }

  loginWithGoogle() {
    return this.repository.loginWithGoogle()
  }
}
