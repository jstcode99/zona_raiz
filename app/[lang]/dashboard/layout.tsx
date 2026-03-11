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
import { ROUTES } from "@/infrastructure/config/constants"
import { DashboardBottomNav } from "@/features/navigation/dashboard-bottom-nav"
import { sessionModule } from "@/application/modules/session.module"
import { useLang } from "@/hooks/use-lang"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const { sessionService } = await sessionModule()
  const profile = await sessionService.getCachedCurrentUser();
  const menu = await sessionService.getMenuByRol();

  if (!profile) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  if (profile.role == EUserRole.Admin) {
    return encodedRedirect(
      "error",
      ROUTES.DASHBOARD,
      "Solo los administradores pueden acceder al dashboard"
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
