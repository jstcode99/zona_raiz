"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { fallbackLng } from "./settings"

export const namespaces = [
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

i18n
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`@/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    fallbackLng,
    // 2. Puedes dejar 'words' como default para textos generales
    defaultNS: "words",
    // Indica a i18n qué namespaces existen
    ns: namespaces, 
    interpolation: {
      escapeValue: false
    }
  })

export default i18n