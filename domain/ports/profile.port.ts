import { ProfileEntity, EUserRole } from "../entities/profile.entity"

export interface ProfilePort {
  getRoleByUserId(userId: string): Promise<string>

  getProfileByUserId(userId: string): Promise<ProfileEntity>

  updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<void>

  updatePathAvatarProfile(userId: string, avatarUrl: string): Promise<void>

  uploadAvatar(userId: string, file: File): Promise<string>

  updateRole(userId: string, role: EUserRole): Promise<void>
}