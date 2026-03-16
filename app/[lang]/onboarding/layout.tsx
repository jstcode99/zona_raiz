import { ReactNode } from "react"
import { encodedRedirect } from "@/shared/redirect"
import { initI18n } from "@/i18n/server"
import { createRouter } from "@/i18n/router"
import { Lang } from "@/i18n/settings"
import { cookies } from "next/headers"
import { appModule } from "@/application/modules/app.module"

export default async function PostLoginLayout({
  children,
  params
}: {
  children: ReactNode,
  params: { lang: Lang }
}) {

  const { lang } = await params;
  const cookieStore = await cookies()

  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const routes = createRouter(lang)

  const { sessionService } = await appModule(lang, { cookies: cookieStore })
  const user = await sessionService.getCachedCurrentUser();

  if (!user) {
    return encodedRedirect('error', routes.signin(), t("exeptions.auth_error"))
  }

  return (
    <>
      {children}
    </>
  )
}
