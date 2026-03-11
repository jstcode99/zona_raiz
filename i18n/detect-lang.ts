import { NextRequest } from "next/server"
import { DEFAULT_LANG, Lang } from "./settings"

export function detectLang(request: NextRequest): Lang {

  const cookieLang = request.cookies.get("lang")?.value as Lang

  if (cookieLang === "es" || cookieLang === "en") {
    return cookieLang
  }

  const header = request.headers.get("accept-language")

  if (header?.startsWith("es")) return "es"

  return DEFAULT_LANG
}