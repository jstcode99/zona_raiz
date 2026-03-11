import { updateSession } from "@/infrastructure/db/supabase.proxy"
import { NextRequest, NextResponse } from "next/server"
import { translateRoute } from "@/infrastructure/config/routes.i18n"
import { getServerLang } from "@/lib/utils"

export async function proxy(request: NextRequest) {
  const lang = getServerLang(request)
  const pathname = request.nextUrl.pathname

  const translated = translateRoute(pathname, lang)
  if (translated !== pathname) {
    return NextResponse.rewrite(new URL(translated, request.url))
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}