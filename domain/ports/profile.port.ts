import { ProfileEntity, EUserRole } from "../entities/profile.entity"
import { EAgentRole } from "../entities/real-estate-agent.entity"

export interface ProfilePort {
  searchProfilesByEmail(email: string): Promise<ProfileEntity[]>

  getRoleByUserId(userId: string): Promise<string>

  getProfileByUserId(userId: string): Promise<ProfileEntity>

  getAgentRoleInRealEstate(userId: string, realEstateId: string): Promise<{ role: EAgentRole } | null>

  updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<void>

  updatePathAvatarProfile(userId: string, avatarUrl: string): Promise<void>

  uploadAvatar(userId: string, file: File): Promise<string>

  updateRole(userId: string, role: EUserRole): Promise<void>

  count(filters?: { start_date?: string; end_date?: string; real_estate_id?: string }): Promise<number>
}