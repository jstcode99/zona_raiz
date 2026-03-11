import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"

export async function initI18n(lang: string) {

  const i18n = createInstance()

  await i18n
    .use(
      resourcesToBackend(
        (lng: string, ns: string) =>
          import(`@/locales/${lng}/${ns}.json`)
      )
    )
    .init({
      lng: lang,
      fallbackLng: "en",
      defaultNS: "common",
      interpolation: {
        escapeValue: false
      }
    })

  return i18n
}