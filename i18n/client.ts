"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false
  }
})

export default i18n