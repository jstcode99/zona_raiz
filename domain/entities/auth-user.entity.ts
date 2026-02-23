import { EUserRole } from "./profile.entity"

export interface AuthEmailEntity {
  id: string
  email: string
}

export interface AuthUserEntity {
  id: string
  email: string
  role: EUserRole
  fullName: string | null
  avatarUrl: string | null
}