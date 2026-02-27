import { ProfileEntity } from "../entities/profile.entity"
import { AuthPort, SignUpData } from "../ports/auth.port"

export interface ProfileGateway {
  getRoleByUserId(userId: string): Promise<string>
  getProfileByUserId(userId: string): Promise<ProfileEntity>
}

export class AuthUseCases {
  constructor(
    private readonly auth: AuthPort,
    private readonly profiles: ProfileGateway
  ) { }

  async signUp(data: SignUpData) {
    return this.auth.signUp(data)
  }

  async signIn(email: string, password: string): Promise<string> {
    const { userId } = await this.auth.signIn(email, password)

    const role = await this.profiles.getRoleByUserId(userId)
    return role
  }

  async sendOtp(email: string) {
    return this.auth.sendOtp(email)
  }

  async signOut() {
    return this.auth.signOut()
  }

  async exchangeCodeForSession(token: string): Promise<ProfileEntity> {
    const { userId } = await this.auth.exchangeCodeForSession(token)
    const profile = await this.profiles.getProfileByUserId(userId)
    return profile
  }


  async verifyOtp(token: string, type: string): Promise<ProfileEntity> {
    const { userId } = await this.auth.verifyOtp(token, type)
    const profile = await this.profiles.getProfileByUserId(userId)
    return profile
  }
}