import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { CACHE_TAGS, COOKIE_NAMES } from "@/infrastructure/config/constants"
import { authModule } from "@/application/modules/auth.module"
import { revalidateTag } from "next/cache"
import { initI18n } from "@/i18n/server"
import { createRouter } from "@/i18n/router"
import { Lang } from "@/i18n/settings"

const SUPPORTED_LANGS = ["es", "en"]

function extractLang(request: NextRequest): Lang {
  const segment = request.nextUrl.pathname.split("/")[1]

  if (SUPPORTED_LANGS.includes(segment)) {
    return segment as Lang
  }

  return "es"
}

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)

  const lang = extractLang(request)

  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)

  const routes = createRouter(lang)
  const cookieStore = await cookies()

  const { authService } = await authModule()
  await authService.signOut()

  cookieStore.delete(COOKIE_NAMES.ROLE)
  cookieStore.delete(COOKIE_NAMES.REAL_ESTATE)
  cookieStore.delete(COOKIE_NAMES.REAL_ESTATE_ROLE)

  return NextResponse.redirect(
    `${origin}${routes.signin()}?error=${t("sucess.sign_out_complete")}`
  )
}