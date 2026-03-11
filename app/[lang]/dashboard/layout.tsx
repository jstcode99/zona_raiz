import { SiteHeader } from "@/features/navigation/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { CSSProperties, ReactNode, Suspense } from "react"
import { AppSidebar } from "@/features/navigation/app-sidebar"
import { PageLoader } from "@/features/loader/page-loader"
import { encodedRedirect } from "@/shared/redirect"
import { EUserRole } from "@/domain/entities/profile.entity"
import { DashboardBottomNav } from "@/features/navigation/dashboard-bottom-nav"
import { sessionModule } from "@/application/modules/session.module"
import { createRouter } from "@/i18n/router"
import { Lang } from "@/i18n/settings"
import { initI18n } from "@/i18n/server"
import { COOKIE_NAMES } from "@/infrastructure/config/constants"
import { cookies } from "next/headers"

export default async function DashboardLayout({
  children,
  params
}: {
  children: ReactNode,
  params: { lang: Lang }
}) {
  const cookieStore = await cookies()
  const { lang } = await params;

  const routes = createRouter(lang)
  const i18n = await initI18n(lang)
  const t = i18n.getFixedT(lang)

  const real_estate_id = cookieStore.get(COOKIE_NAMES.REAL_ESTATE)?.value as string

  if (!real_estate_id) {
    return encodedRedirect('error', routes.signin(), t('errors.real_estate_not_found'))
  }

  const { sessionService } = await sessionModule(lang)
  const profile = await sessionService.getCachedCurrentUser();
  const menu = await sessionService.getMenuByRol();


  if (!profile) {
    return encodedRedirect('error', routes.signin(), t('errors.profile_not_found'))
  }

  if (profile.role == EUserRole.Admin) {
    return encodedRedirect(
      "error",
      routes.signin(),
      t('errors.not_have_access')
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" menu={menu} profile={profile} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Suspense fallback={<PageLoader />}>{children}</Suspense>
            </div>
          </div>
        </div>
        <DashboardBottomNav items={menu} />
      </SidebarInset>
    </SidebarProvider>
  )
}
