import { ProfilePort } from "../ports/profile.port"
import { ProfileEntity, EUserRole } from "../entities/profile.entity"

export class ProfileUseCases {
  constructor(private readonly profiles: ProfilePort) {}

  getRoleByUserId(userId: string) {
    return this.profiles.getRoleByUserId(userId)
  }

  getProfileByUserId(userId: string): Promise<ProfileEntity> {
    return this.profiles.getProfileByUserId(userId)
  }

  updateProfile(userId: string, data: Partial<ProfileEntity>) {
    return this.profiles.updateProfile(userId, data)
  }

  updatePathAvatarProfile(userId: string, avatarUrl: string) {
    return this.profiles.updatePathAvatarProfile(userId, avatarUrl)
  }

  uploadAvatar(userId: string, file: File) {
    return this.profiles.uploadAvatar(userId, file)
  }

  updateRole(userId: string, role: EUserRole) {
    return this.profiles.updateRole(userId, role)
  }
}