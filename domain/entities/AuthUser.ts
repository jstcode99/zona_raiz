import { UserRole } from "./Profile"

export type AuthUserBase = {
  id: string
  email: string
}

export interface AuthUser extends AuthUserBase {
  role: UserRole
}

