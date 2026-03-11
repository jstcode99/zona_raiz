import { Lang } from "./settings"
import { ROUTES } from "@/infrastructure/config/routes"

export function translateRoute(
  pathname: string,
  lang: Lang
) {

  for (const route of Object.values(ROUTES)) {

    const source = lang === "es" ? route.es : route.en
    const target = lang === "es" ? route.en : route.es

    const regex = new RegExp(
      "^" + source.replace(/:[^/]+/g, "([^/]+)").replace(/\//g, "\\/") + "$"
    )

    const match = pathname.match(regex)

    if (!match) continue

    let translated = target

    const params = source.match(/:[^/]+/g)

    if (params) {
      params.forEach((param, i) => {
        translated = translated.replace(param, match[i + 1])
      })
    }

    return translated
  }

  return pathname
}