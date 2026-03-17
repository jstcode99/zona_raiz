"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { fallbackLng, namespaces } from "./settings"



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
    // Indica a i18n qué namespaces existen
    ns: namespaces,
    interpolation: {
      escapeValue: false
    }
  })

export default i18n