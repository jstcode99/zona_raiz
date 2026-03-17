export const LANGUAGES = ["es", "en"] as const

export type Lang = (typeof LANGUAGES)[number]
export const fallbackLng: Lang = "es"

export const DEFAULT_LANG: Lang = "es"

export const namespaces = [
  "landing",
  "actions",
  "components",
  "exceptions",
  "fields",
  "placeholders", 
  "sections",
  "status", 
  "subtitles", 
  "titles", 
  "validations", 
  "words"
]