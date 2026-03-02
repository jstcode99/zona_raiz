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
import { getCurrentUser } from "@/services/session.services"
import { ROUTES } from "@/infrastructure/config/constants"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {

  const profile = await getCurrentUser();

  if (!profile) {
    return encodedRedirect('error', '/auth/sign-in', 'No se pudo cargar el perfil')
  }

  const getMenuByRole = (role: string) => {
    switch (role) {
      case EUserRole.Admin:
        return [
          {
            title: "Dashboard",
            url: `${ROUTES.DASHBOARD}`,
            icon: 'layout-dashboard',
          },
          {
            title: "Inmobiliarias",
            url: `${ROUTES.DASHBOARD}/${ROUTES.REAL_ESTATES}`,
            icon: 'map-pin-house',
          },
          {
            title: "Propiedades",
            url: `${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}`,
            icon: 'building-2',
          }
        ]
      default:
        return [
          {
            title: "Dashboard",
            url: `${ROUTES.DASHBOARD}`,
            icon: 'layout-dashboard',
          },
          {
            title: "Propiedades",
            url: `${ROUTES.DASHBOARD}/${ROUTES.PROPERTIES}`,
            icon: 'building-2',
          },
        ]
    }
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
      <AppSidebar
        variant="inset"
        menu={getMenuByRole(profile?.role || "")}
        profile={profile}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Suspense fallback={<PageLoader />}>
                {children}
              </Suspense>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
