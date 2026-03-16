import { type NextRequest, NextResponse } from "next/server"
import { initI18n } from "@/i18n/server"
import { createRouter } from "@/i18n/router"
import { revalidatePath } from "next/cache"
import { detectLang } from "@/i18n/detect-lang"
import { appModule } from "@/application/modules/app.module"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url)

  const lang = detectLang(request)

  const i18n = await initI18n(lang)
  const cookieStore = await cookies()
  const t = i18n.getFixedT(lang)
  const routes = createRouter(lang)

  const { authService, cookiesService } = await appModule(lang, { cookies: cookieStore})

  await authService.signOut()

  cookiesService.clearSession()
  revalidatePath(routes.dashboard());

  return NextResponse.redirect(
    `${origin}${routes.signin()}?success=${t("status:success_signout")}`
  )
}