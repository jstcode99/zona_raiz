import { EUserRole } from "@/domain/entities/profile.entity"

export const ROUTES = {
  home: {
    es: "/es",
    en: "/en",
  },

  signin: {
    es: "/autenticacion/login",
    en: "/auth/sign-in",
  },

  signup: {
    es: "/autenticacion/registro",
    en: "/auth/sign-up",
  },

  signout: {
    es: "/autenticacion/logout",
    en: "/auth/sign-out",
  },

  otp: {
    es: "/autenticacion/otp",
    en: "/auth/otp",
  },

  callback: {
    es: "/autenticacion/callback",
    en: "/auth/callback",
  },

  onboarding: {
    es: "/incorporacion",
    en: "/onboarding",
  },

  onboardingReaEstate: {
    es: "/incorporacion/registro-inmobiliaria",
    en: "/onboarding/register-real-estate",
  },

  dashboard: {
    es: "/panel",
    en: "/dashboard",
  },

  profile: {
    es: "/panel/perfil",
    en: "/dashboard/profile",
  },

  realEstates: {
    es: "/panel/inmobiliarias",
    en: "/dashboard/real-estates",
  },

  currentRealEstate: {
    es: "/panel/inmobiliaria",
    en: "/dashboard/real-estate",
  },

  realEstate: {
    es: "/panel/inmobiliarias/:id",
    en: "/dashboard/real-estates/:id",
  },

  properties: {
    es: "/panel/propiedades",
    en: "/dashboard/properties",
  },

  property: {
    es: "/panel/propiedades/:id",
    en: "/dashboard/properties/:id",
  },

  listing: {
    es: "/panel/publicaciones/:id",
    en: "/dashboard/listings/:id",
  },

  listings: {
    es: "/panel/publicaciones",
    en: "/dashboard/listings",
  },
  
  inquiries: {
    es: "/panel/consultas",
    en: "/dashboard/inquiries",
  },

  users: {
    es: "/panel/usuarios",
    en: "/dashboard/users",
  },

  user: {
    es: "/panel/usuarios/:id",
    en: "/dashboard/users/:id",
  },
} as const

type Lang = "es" | "en"

export function getRoutes(
  keys: readonly (keyof typeof ROUTES)[],
  lang: Lang
) {
  return keys.map((key) => ROUTES[key][lang])
}

export const PUBLIC_ROUTE_KEYS = [
  "home",
  "signin",
  "signup",
  "otp",
  "callback",
] as const

export const PROTECTED_ROUTE_KEYS = [
  "dashboard",
  "realEstates",
  "realEstate",
  "properties",
  "listings",
  "inquiries",
] as const

export const PUBLIC_ROUTES = [
  ...getRoutes(PUBLIC_ROUTE_KEYS, "en"),
  ...getRoutes(PUBLIC_ROUTE_KEYS, "es"),
]

export const PROTECTED_BASE_ROUTES = [
  ...getRoutes(PROTECTED_ROUTE_KEYS, "en"),
  ...getRoutes(PROTECTED_ROUTE_KEYS, "es"),
  "/api",
]

export const ROLE_ACCESS: Record<EUserRole, string[]> = {
  admin: PROTECTED_BASE_ROUTES,
  "real-estate": PROTECTED_BASE_ROUTES,
  client: PROTECTED_BASE_ROUTES,
}


