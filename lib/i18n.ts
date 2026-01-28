import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '@/lang/en.json'
import es from '@/lang/es.json'

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
}

const getInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return 'es'
  }
  return localStorage.getItem('lang') || 'es'
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
})


export default i18n
