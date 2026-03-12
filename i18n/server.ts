import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

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


export async function initI18n(lang: string, ns: string | string[] = "words") {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next) // Importante para que funcione el motor
    .use(
      resourcesToBackend(
        (lng: string, namespace: string) =>
          import(`@/locales/${lng}/${namespace}.json`)
      )
    )
    .init({
      lng: lang,
      fallbackLng: "es",
      ns: namespaces, // Cargamos todos los nombres de archivos
      defaultNS: "words",
      interpolation: {
        escapeValue: false,
      },
    });

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