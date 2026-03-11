import { ReactNode, Suspense } from "react"
import { PageLoader } from "@/features/loader/page-loader"
import { encodedRedirect } from "@/shared/redirect"
import { sessionModule } from "@/application/modules/session.module"
import { initI18n } from "@/i18n/server"
import { createRouter } from "@/i18n/router"
import { Lang } from "@/i18n/settings"

export default async function PostLoginLayout({
  children,
  params
}: {
  children: ReactNode,
  params: { lang: Lang }
}) {

  const { lang } = await params;

  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)
  const routes = createRouter(lang)

  const { sessionService } = await sessionModule()
  const user = await sessionService.getCachedCurrentUser();

  if (!user) {
    return encodedRedirect('error', routes.signin(), t("errors.auth_error"))
  }

  return (
    <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
      <div className='relative max-h-screen w-full p-2 max-lg:hidden'>
        <div className='h-full w-full rounded-2xl bg-black'></div>
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png'
          alt='404 illustration'
          className='absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2'
        />
      </div>
    </div>
  )
}
