import { EUserRole } from "@/domain/entities/profile.entity"

export const ROUTES = {
  dashboard: {
    es: "/panel",
    en: "/dashboard",
  },
  
  properties: {
    es: "/propiedades",
    en: "/properties",
  },

  property: {
    es: "/propiedades/:id",
    en: "/properties/:id",
  },

  listings: {
    es: "/publicaciones/:id",
    en: "/listings/:id",
  },

  listing: {
    es: "/publicaciones/:id",
    en: "/listings/:id",
  },


  login: {
    es: "/autenticacion/login",
    en: "/auth/sign-in",
  },

} as const

export const PUBLIC_ROUTES = [
  "/",
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/otp",
  "/auth/callback",
  "/callback",
]

export const PROTECTED_BASE_ROUTES = [
  "/api",
  "/dashboard",
]

export const ROLE_ACCESS: Record<EUserRole, string[]> = {
  admin: PROTECTED_BASE_ROUTES,
  "real-estate": PROTECTED_BASE_ROUTES,
  client: PROTECTED_BASE_ROUTES,
}


