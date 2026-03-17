import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { fallbackLng, namespaces } from "./settings"

export async function initI18n(lang: string, ns: string | string[] = "words") {
  const i18nInstance = createInstance();

  await i18nInstance
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

  return i18nInstance;
}

// Helper para obtener 't' directamente en Server Components
export async function getTranslation(lang: string, ns?: string | string[]) {
  const i18nInstance = await initI18n(lang, ns);
  return {
    t: i18nInstance.getFixedT(lang, Array.isArray(ns) ? ns[0] : ns),
    i18n: i18nInstance,
  };
}