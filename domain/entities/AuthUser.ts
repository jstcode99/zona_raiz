// domain/entities/AuthUser.ts
import { UserRole } from "./Profile"

export interface AuthUserBase {
  id: string
  email: string
  role?: UserRole  // Opcional en registro, requerido en login
}

export interface AuthUser extends AuthUserBase {
  role: UserRole
  fullName: string | null
  avatarUrl: string | null
}