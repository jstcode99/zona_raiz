import { ROUTES } from "@/infrastructure/config/routes"
import { Lang } from "./settings"

export function getRoute(
  key: keyof typeof ROUTES,
  lang: Lang,
  params?: Record<string, string>
) {

  let path: string = ROUTES[key][lang]

  if (params) {
    for (const p in params) {
      path = path.replace(`:${p}`, params[p])
    }
  }

  return `/${lang}${path}`
}