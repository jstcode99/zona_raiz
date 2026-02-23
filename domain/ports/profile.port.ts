import { EUserRole, ProfileEntity } from "../entities/profile.entity";

export interface ProfilePort {
  getRoleByUserId(userId: string): Promise<string>
  getProfileByUserId(userId: string): Promise<ProfileEntity>
  // Profile mutations
  updateProfile(userId: string, data: any): Promise<void>
  updatePathAvatarProfile(userId: string, avatarUrl: string): Promise<void> 
  uploadAvatar(userId: string, file: File): Promise<string>
  updateRole(userId: string, role: EUserRole): Promise<void>
}