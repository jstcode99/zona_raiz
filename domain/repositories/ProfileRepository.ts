import { UserWithProfile } from "@/domain/entities/User"
import { UserRole } from "@/domain/entities/Profile"

export interface UpdateProfileInput {
  full_name: string
  phone?: string
  avatar_url?: string
}

export interface ProfileRepository {
  // Profile queries
  getCurrentProfile(): Promise<UserWithProfile>
  
  // Profile mutations
  updateProfile(data: UpdateProfileInput): Promise<void>
  updateAvatar(file: File): Promise<string>
  updateRole(userId: string, role: UserRole): Promise<void>
  
  // Role cookie management
  getRoleFromCookie(): Promise<UserRole | null>
  refreshRoleCookie(): Promise<void>
}