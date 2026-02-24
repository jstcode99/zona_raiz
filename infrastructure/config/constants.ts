// ==========================================
// COOKIES
// ==========================================

import { EUserRole } from "@/domain/entities/profile.entity"

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 días
  path: "/",
} as const

export const COOKIE_NAMES = {
  ROLE: "user_role",
  REAL_ESTATE: "real_estate_id",
  SESSION: "supabase_session",
} as const

// ==========================================
// CACHE TAGS
// ==========================================

export const CACHE_TAGS = {
  AUTH: {
    USER: "auth-user",
    SESSION: "auth-session",
  },
  PROFILE: {
    BASE: "profile",
    AVATAR: "profile-avatar",
  },
  REAL_ESTATE: {
    LIST: "real-estates-list",
    DETAIL: (id: string) => `real-estate-${id}`,
    ALL: "real-estates-all",
  },
} as const

// ==========================================
// STORAGE BUCKETS
// ==========================================

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  REAL_ESTATE_LOGOS: "real-estate-logos",
  PROPERTIES: "properties",
} as const

// ==========================================
// VALIDATION
// ==========================================

export const FILE_LIMITS = {
  AVATAR_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  LOGO_MAX_SIZE: 2 * 1024 * 1024, // 2MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
} as const


// ==========================================
// ROUTES
// ==========================================

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  OTP: "/auth/otp",
  CALLBACK: "/auth/callback",
  UNAUTHORIZED: "/unauthorized",
  PROPERTIES: "/properties",
  ONBOARDING: "/onboarding",
  REGISTER_REAL_ESTATE: "/onboarding/register-real-estate",

  DASHBOARD: "/dashboard",
} as const

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.OTP,
  ROUTES.CALLBACK,
  ROUTES.UNAUTHORIZED,
]

export const PROTECTED_BASE_ROUTES = [
  "/api",
  "/admin",
  "/dashboard",
  "/real-estates",
  "/agents",
  "/settings",
]

export const ROLE_ACCESS: Record<EUserRole, string[]> = {
  admin: PROTECTED_BASE_ROUTES,
  coordinator: PROTECTED_BASE_ROUTES,
  agent: PROTECTED_BASE_ROUTES,
  client: PROTECTED_BASE_ROUTES,
}