import { NextRequest, NextResponse } from "next/server"
import { translateRoute } from "@/i18n/translate-route"
import { getServerLang } from "@/lib/utils"

const LANG_REGEX = /^\/(es|en)(\/|$)/

export async function proxy(request: NextRequest) {

  const { pathname } = request.nextUrl

  const lang = getServerLang(request)

  const hasLang = LANG_REGEX.test(pathname)

  if (!hasLang) {

    const url = request.nextUrl.clone()

    url.pathname = `/${lang}${pathname}`

    return NextResponse.redirect(url)
  }

  const urlLang = pathname.split("/")[1] as "es" | "en"

  const cleanPath = pathname.replace(`/${urlLang}`, "") || "/"

  const translated = translateRoute(cleanPath, urlLang)

  if (translated !== cleanPath) {

    const url = request.nextUrl.clone()

    url.pathname = `/${urlLang}${translated}`

    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"]
}