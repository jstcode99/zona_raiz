import { ROUTES } from "@/infrastructure/config/routes"
import { Lang } from "./settings"

export function createRouter(lang: Lang) {
  return Object.fromEntries(
    Object.entries(ROUTES).map(([key, value]) => [
      key,
      (...params: string[]) => {
        let path = value[lang]

        params.forEach((param) => {
          path = path.replace(/:[^/]+/, param)
        })

        return `/${lang}${path}`
      },
    ])
  ) as {
    [K in keyof typeof ROUTES]: (...params: string[]) => string
  }
}