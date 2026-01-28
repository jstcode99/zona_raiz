import i18n from 'i18next'
import en from './en.json'
import es from './es.json'

const langStorage = localStorage.getItem('lang-storage')
let lang = 'es'

if (langStorage) {
  const { state } = JSON.parse(langStorage)
  lang = state.lang
}
const resources = {
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },
  lng: lang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
}

i18n.init(resources)

export default i18n
