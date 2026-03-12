export const LANGUAGES = ["es", "en"] as const

export type Lang = (typeof LANGUAGES)[number]
export const fallbackLng: Lang = "es"

export const DEFAULT_LANG: Lang = "es"