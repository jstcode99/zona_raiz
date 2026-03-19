export const LANGUAGES = ["es", "en"] as const

export type Lang = (typeof LANGUAGES)[number]
export const fallbackLng: Lang = "es"

export const DEFAULT_LANG: Lang = "es"

export const namespaces = [
  // Domain/Feature namespaces
  "landing",
  "auth",
  "dashboard",
  "listings",
  "properties",
  "real-estates",
  "profile",
  "agents",
  "inquiries",
  "import",
  // Common namespaces
  "common",
  "components",
  "validations",
  "words"
]